// Blueprint references: javascript_log_in_with_replit, javascript_openai
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "@db";
import { ayahs, surahs, hadith, hadithBooks, hadithChapters } from "@shared/schema";
import { eq, sql } from "drizzle-orm";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { generateArabicSpeech, extractTextFromImage, saveAudioFile, analyzeQuranicVerse, validateHadith } from "./openai";
import { z } from "zod";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth setup
  await setupAuth(app);

  // Auth routes
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ============== QURAN API ==============
  
  // Get all surahs
  app.get("/api/quran/surahs", async (req, res) => {
    try {
      const surahs = await storage.getSurahs();
      res.json(surahs);
    } catch (error) {
      console.error("Error fetching surahs:", error);
      res.status(500).json({ message: "Failed to fetch surahs" });
    }
  });

  // Get specific surah
  app.get("/api/quran/surah/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const surah = await storage.getSurahById(id);
      if (!surah) {
        return res.status(404).json({ message: "Surah not found" });
      }
      res.json(surah);
    } catch (error) {
      console.error("Error fetching surah:", error);
      res.status(500).json({ message: "Failed to fetch surah" });
    }
  });

  // Get ayahs by surah
  app.get("/api/quran/surah/:id/ayahs", async (req, res) => {
    try {
      const surahId = parseInt(req.params.id);
      const ayahs = await storage.getAyahsBySurah(surahId);
      
      // Check if first ayah has audio URL for debugging
      if (ayahs.length > 0) {
        console.log("First ayah audio URL:", ayahs[0].audioUrl ? "Present" : "Missing");
      }
      
      res.json(ayahs);
    } catch (error) {
      console.error("Error fetching ayahs:", error);
      res.status(500).json({ message: "Failed to fetch ayahs" });
    }
  });

  // Search Quran verses
  app.get("/api/quran/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query required" });
      }
      const results = await storage.searchAyahs(query);
      res.json(results);
    } catch (error) {
      console.error("Error searching ayahs:", error);
      res.status(500).json({ message: "Failed to search ayahs" });
    }
  });

  // Get random ayah (Verse of the Day)
  app.get("/api/ayahs/random", async (req, res) => {
    try {
      // Get random ayah
      const randomAyahResult = await db
        .select()
        .from(ayahs)
        .orderBy(sql`RANDOM()`)
        .limit(1);
      
      if (!randomAyahResult || randomAyahResult.length === 0) {
        return res.json(null);
      }
      
      const ayah = randomAyahResult[0];
      
      // Get surah info
      const surahResult = await db
        .select()
        .from(surahs)
        .where(eq(surahs.id, ayah.surahId))
        .limit(1);
      
      const surah = surahResult[0];
      
      res.json({
        id: ayah.id,
        surahId: ayah.surahId,
        ayahNumber: ayah.ayahNumber,
        textArabic: ayah.textArabic,
        translationEn: ayah.translationEn,
        surahName: surah?.name || "",
        surahNameArabic: surah?.nameArabic || "",
      });
    } catch (error) {
      console.error("Error fetching random ayah:", error);
      res.status(500).json({ message: "Failed to fetch verse" });
    }
  });

  // Note: Authentic audio recitation is included with ayahs from the API
  // No need for TTS - audio URLs from Mishary Rashid Alafasy are pre-loaded

  // AI-powered verse analysis
  app.post("/api/quran/analyze", async (req, res) => {
    try {
      const { arabicText, translation } = req.body;
      if (!arabicText || !translation) {
        return res.status(400).json({ message: "Arabic text and translation required" });
      }

      const analysis = await analyzeQuranicVerse(arabicText, translation);
      res.json({ analysis });
    } catch (error) {
      console.error("Error analyzing verse:", error);
      res.status(500).json({ message: "Failed to analyze verse" });
    }
  });

  // Get ayah translations
  app.get("/api/quran/ayah/:ayahId/translations", async (req, res) => {
    try {
      const { ayahId } = req.params;
      const language = req.query.language as string | undefined;
      const translations = await storage.getAyahTranslations(ayahId, language);
      res.json(translations);
    } catch (error) {
      console.error("Error fetching translations:", error);
      res.status(500).json({ message: "Failed to fetch translations" });
    }
  });

  // Get all reciters
  app.get("/api/quran/reciters", async (req, res) => {
    try {
      const reciters = await storage.getAllReciters();
      res.json(reciters);
    } catch (error) {
      console.error("Error fetching reciters:", error);
      res.status(500).json({ message: "Failed to fetch reciters" });
    }
  });

  // Get ayah recitations
  app.get("/api/quran/ayah/:ayahId/recitations", async (req, res) => {
    try {
      const { ayahId } = req.params;
      const reciterId = req.query.reciterId as string | undefined;
      const recitations = await storage.getAyahRecitations(ayahId, reciterId);
      res.json(recitations);
    } catch (error) {
      console.error("Error fetching recitations:", error);
      res.status(500).json({ message: "Failed to fetch recitations" });
    }
  });

  // Get surah line formats
  app.get("/api/quran/surah/:surahId/formats", async (req, res) => {
    try {
      const surahId = parseInt(req.params.surahId);
      const lineFormat = req.query.format as string | undefined;
      const formats = await storage.getSurahLineFormats(surahId, lineFormat);
      res.json(formats);
    } catch (error) {
      console.error("Error fetching line formats:", error);
      res.status(500).json({ message: "Failed to fetch line formats" });
    }
  });

  // AI Quran Chatbot
  app.post("/api/quran/chat", async (req, res) => {
    try {
      const { question } = req.body;
      if (!question) {
        return res.status(400).json({ message: "Question required" });
      }

      // First, search Islamic knowledge base for authentic answers
      const knowledgeResults = await storage.searchIslamicKnowledge(question);
      const knowledgeContext = knowledgeResults.length > 0
        ? knowledgeResults.map(k => 
            `Q: ${k.question}\nA: ${k.answer}\nReferences: ${k.references?.join(', ')}`
          ).join('\n\n')
        : '';

      // Then search Quran verses
      const searchResults = await storage.searchAyahs(question);
      const quranContext = searchResults.slice(0, 5).map(ayah => 
        `Surah ${ayah.surahId}, Ayah ${ayah.ayahNumber}: ${ayah.textArabic} - ${ayah.translationEn}`
      ).join('\n\n');

      const fullContext = `${knowledgeContext ? 'Authentic Islamic Knowledge:\n' + knowledgeContext + '\n\n' : ''}Context from Quran:\n${quranContext}`;

      const analysis = await analyzeQuranicVerse(
        question,
        fullContext
      );

      res.json({ 
        answer: analysis,
        relevantVerses: searchResults.slice(0, 5),
        knowledgeBase: knowledgeResults.slice(0, 3)
      });
    } catch (error: any) {
      console.error("Error in Quran chatbot:", error);
      if (error?.status === 429 || error?.code === 'insufficient_quota') {
        return res.status(503).json({ 
          message: "AI service temporarily unavailable. Please try again later.",
          reason: "quota_exceeded"
        });
      }
      res.status(500).json({ message: "Failed to process question" });
    }
  });

  // ============== HADITH API ==============

  // Get random hadith (Hadith of the Day)
  app.get("/api/hadith/random", async (req, res) => {
    try {
      const randomHadith = await db
        .select()
        .from(hadith)
        .where(eq(hadith.grade, "Sahih"))
        .orderBy(sql`RANDOM()`)
        .limit(1);
      
      res.json(randomHadith[0] || null);
    } catch (error) {
      console.error("Error fetching random hadith:", error);
      res.status(500).json({ message: "Failed to fetch hadith" });
    }
  });

  // Get all hadith books
  app.get("/api/hadith/books", async (req, res) => {
    try {
      const books = await storage.getAllHadithBooks();
      res.json(books);
    } catch (error) {
      console.error("Error fetching hadith books:", error);
      res.status(500).json({ message: "Failed to fetch hadith books" });
    }
  });

  // Get chapters by book ID
  app.get("/api/hadith/books/:bookId/chapters", async (req, res) => {
    try {
      const chapters = await storage.getChaptersByBookId(req.params.bookId);
      res.json(chapters);
    } catch (error) {
      console.error("Error fetching chapters:", error);
      res.status(500).json({ message: "Failed to fetch chapters" });
    }
  });

  // Get hadith by chapter ID
  app.get("/api/hadith/chapters/:chapterId/hadiths", async (req, res) => {
    try {
      const hadiths = await storage.getHadithByChapterId(req.params.chapterId);
      res.json(hadiths);
    } catch (error) {
      console.error("Error fetching hadiths:", error);
      res.status(500).json({ message: "Failed to fetch hadiths" });
    }
  });

  // Get all hadith with pagination
  app.get("/api/hadith", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const hadithList = await storage.getAllHadith(limit, offset);
      const totalCount = await storage.getHadithCount();
      res.json({ hadith: hadithList, total: totalCount });
    } catch (error) {
      console.error("Error fetching hadith:", error);
      res.status(500).json({ message: "Failed to fetch hadith" });
    }
  });
  
  // Get hadith chapters for a book
  app.get("/api/hadith/chapters/:book", async (req, res) => {
    try {
      const { book } = req.params;
      const chapters = await storage.getHadithChapters(book);
      res.json(chapters);
    } catch (error) {
      console.error("Error fetching chapters:", error);
      res.status(500).json({ message: "Failed to fetch chapters" });
    }
  });

  // Search hadith
  app.get("/api/hadith/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      const grade = req.query.grade as string | undefined;
      const book = req.query.book as string | undefined;

      if (!query) {
        return res.status(400).json({ message: "Search query required" });
      }

      const results = await storage.searchHadith(query, grade, book);
      res.json(results);
    } catch (error) {
      console.error("Error searching hadith:", error);
      res.status(500).json({ message: "Failed to search hadith" });
    }
  });

  // Get specific hadith
  app.get("/api/hadith/:id", async (req, res) => {
    try {
      const hadith = await storage.getHadithById(req.params.id);
      if (!hadith) {
        return res.status(404).json({ message: "Hadith not found" });
      }
      res.json(hadith);
    } catch (error) {
      console.error("Error fetching hadith:", error);
      res.status(500).json({ message: "Failed to fetch hadith" });
    }
  });

  // Get hadith translations
  app.get("/api/hadith/:hadithId/translations", async (req, res) => {
    try {
      const { hadithId } = req.params;
      const language = req.query.language as string | undefined;
      const translations = await storage.getHadithTranslations(hadithId, language);
      res.json(translations);
    } catch (error) {
      console.error("Error fetching hadith translations:", error);
      res.status(500).json({ message: "Failed to fetch translations" });
    }
  });

  // AI Hadith Chatbot
  app.post("/api/hadith/chat", async (req, res) => {
    try {
      const { question } = req.body;
      if (!question) {
        return res.status(400).json({ message: "Question required" });
      }

      // First, search Islamic knowledge base for authentic answers
      const knowledgeResults = await storage.searchIslamicKnowledge(question);
      const knowledgeContext = knowledgeResults.length > 0
        ? knowledgeResults.map(k => 
            `Q: ${k.question}\nA: ${k.answer}\nReferences: ${k.references?.join(', ')}`
          ).join('\n\n')
        : '';

      // Then search Hadith collections
      const searchResults = await storage.searchHadith(question);
      const hadithContext = searchResults.slice(0, 5).map(h => 
        `${h.book} - ${h.chapter}\nArabic: ${h.textArabic}\nEnglish: ${h.translationEn}\nNarrator: ${h.narrator}\nGrade: ${h.grade}`
      ).join('\n\n---\n\n');

      const fullContext = `${knowledgeContext ? 'Authentic Islamic Knowledge:\n' + knowledgeContext + '\n\n' : ''}Context from authentic Hadith collections:\n${hadithContext}\n\nPlease provide an answer based on these authentic narrations.`;

      const analysis = await analyzeQuranicVerse(
        question,
        fullContext
      );

      res.json({ 
        answer: analysis,
        relevantHadith: searchResults.slice(0, 5),
        knowledgeBase: knowledgeResults.slice(0, 3)
      });
    } catch (error: any) {
      console.error("Error in Hadith chatbot:", error);
      if (error?.status === 429 || error?.code === 'insufficient_quota') {
        return res.status(503).json({ 
          message: "AI service temporarily unavailable. Please try again later.",
          reason: "quota_exceeded"
        });
      }
      res.status(500).json({ message: "Failed to process question" });
    }
  });

  // Validate Hadith authenticity
  app.post("/api/hadith/validate", async (req, res) => {
    try {
      const { hadithText, narrator, source } = req.body;
      if (!hadithText) {
        return res.status(400).json({ message: "Hadith text required" });
      }

      const validation = await validateHadith(hadithText, narrator, source);
      res.json(validation);
    } catch (error: any) {
      console.error("Error validating hadith:", error);
      if (error?.status === 429 || error?.code === 'insufficient_quota') {
        return res.status(503).json({ 
          message: "AI service temporarily unavailable. Please try again later.",
          reason: "quota_exceeded"
        });
      }
      res.status(500).json({ message: "Failed to validate hadith" });
    }
  });

  // ============== RECITERS API ==============
  
  // Get all reciters
  app.get("/api/reciters", async (req, res) => {
    try {
      const reciters = await storage.getAllReciters();
      res.json(reciters);
    } catch (error) {
      console.error("Error fetching reciters:", error);
      res.status(500).json({ message: "Failed to fetch reciters" });
    }
  });

  // ============== BOOKMARKS API ==============

  // Get user bookmarks
  app.get("/api/bookmarks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookmarks = await storage.getUserBookmarks(userId);
      res.json(bookmarks);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      res.status(500).json({ message: "Failed to fetch bookmarks" });
    }
  });

  // Create bookmark
  app.post("/api/bookmarks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { ayahId, hadithId, note } = req.body;

      const bookmark = await storage.createBookmark({
        userId,
        ayahId,
        hadithId,
        note,
      });

      res.json(bookmark);
    } catch (error) {
      console.error("Error creating bookmark:", error);
      res.status(500).json({ message: "Failed to create bookmark" });
    }
  });

  // Delete bookmark
  app.delete("/api/bookmarks/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.deleteBookmark(req.params.id);
      res.json({ message: "Bookmark deleted" });
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      res.status(500).json({ message: "Failed to delete bookmark" });
    }
  });

  // ============== PRAYER TIMES API ==============

  // Get prayer times by location
  app.get("/api/prayer-times", async (req, res) => {
    try {
      const { location, lat, lon } = req.query;

      if (!location || !lat || !lon) {
        return res.status(400).json({ message: "Location, latitude, and longitude required" });
      }

      // Call Aladhan API for accurate prayer times
      const today = new Date();
      const timestamp = Math.floor(today.getTime() / 1000);
      
      const aladhanUrl = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lon}&method=2`;
      
      const aladhanResponse = await fetch(aladhanUrl);
      if (!aladhanResponse.ok) {
        throw new Error("Failed to fetch from Aladhan API");
      }
      
      const aladhanData = await aladhanResponse.json();
      const timings = aladhanData.data.timings;

      res.json({
        location,
        date: aladhanData.data.date.readable,
        fajr: timings.Fajr,
        dhuhr: timings.Dhuhr,
        asr: timings.Asr,
        maghrib: timings.Maghrib,
        isha: timings.Isha,
      });
    } catch (error) {
      console.error("Error fetching prayer times:", error);
      res.status(500).json({ message: "Failed to fetch prayer times" });
    }
  });

  // ============== FINANCE API ==============

  // Calculate Zakat
  app.post("/api/finance/zakat", async (req, res) => {
    try {
      const { cash, gold, silver, investments } = req.body;
      
      const total = 
        parseFloat(cash || 0) +
        parseFloat(gold || 0) +
        parseFloat(silver || 0) +
        parseFloat(investments || 0);

      const zakatAmount = total * 0.025; // 2.5% of total wealth

      res.json({
        total,
        zakatAmount,
        breakdown: {
          cash: parseFloat(cash || 0) * 0.025,
          gold: parseFloat(gold || 0) * 0.025,
          silver: parseFloat(silver || 0) * 0.025,
          investments: parseFloat(investments || 0) * 0.025,
        },
      });
    } catch (error) {
      console.error("Error calculating zakat:", error);
      res.status(500).json({ message: "Failed to calculate zakat" });
    }
  });

  // Get finance articles
  app.get("/api/finance/articles", async (req, res) => {
    try {
      const articles = await storage.getFinanceArticles();
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  // ============== CULTURE & BROTHERHOOD API ==============

  // Get all culture articles
  app.get("/api/culture/articles", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const featured = req.query.featured === "true";

      let articles;
      if (featured) {
        articles = await storage.getFeaturedCultureArticles();
      } else if (category) {
        articles = await storage.getCultureArticlesByCategory(category);
      } else {
        articles = await storage.getAllCultureArticles();
      }

      res.json(articles);
    } catch (error) {
      console.error("Error fetching culture articles:", error);
      res.status(500).json({ message: "Failed to fetch culture articles" });
    }
  });

  // Get article by ID
  app.get("/api/culture/articles/:id", async (req, res) => {
    try {
      const article = await storage.getCultureArticleById(req.params.id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  // ============== EVENTS API ==============

  // Get all events
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  // Create event
  app.post("/api/events", isAuthenticated, async (req, res) => {
    try {
      const { title, date, location, organizer, description } = req.body;

      const event = await storage.createEvent({
        title,
        date: new Date(date),
        location,
        organizer,
        description,
      });

      res.json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  // RSVP to event
  app.post("/api/events/:eventId/rsvp", isAuthenticated, async (req: any, res) => {
    try {
      const { eventId } = req.params;
      const { status = "attending" } = req.body;
      const userId = req.user.claims.sub;

      // Check if user already has RSVP
      const existingRsvp = await storage.getUserEventRsvp(eventId, userId);
      
      if (existingRsvp) {
        // Update existing RSVP
        const updated = await storage.updateEventRsvp(existingRsvp.id, status);
        return res.json(updated);
      }

      // Create new RSVP
      const rsvp = await storage.createEventRsvp({
        eventId,
        userId,
        status,
      });

      res.json(rsvp);
    } catch (error) {
      console.error("Error creating RSVP:", error);
      res.status(500).json({ message: "Failed to RSVP" });
    }
  });

  // Get event RSVPs
  app.get("/api/events/:eventId/rsvps", async (req, res) => {
    try {
      const { eventId } = req.params;
      const rsvps = await storage.getEventRsvps(eventId);
      res.json(rsvps);
    } catch (error) {
      console.error("Error fetching RSVPs:", error);
      res.status(500).json({ message: "Failed to fetch RSVPs" });
    }
  });

  // Get user's RSVP for event
  app.get("/api/events/:eventId/my-rsvp", isAuthenticated, async (req: any, res) => {
    try {
      const { eventId } = req.params;
      const userId = req.user.claims.sub;
      const rsvp = await storage.getUserEventRsvp(eventId, userId);
      res.json(rsvp || null);
    } catch (error) {
      console.error("Error fetching user RSVP:", error);
      res.status(500).json({ message: "Failed to fetch RSVP" });
    }
  });

  // ============== DUAS API ==============

  // Get all duas
  app.get("/api/duas", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      
      const duas = category 
        ? await storage.getDuasByCategory(category)
        : await storage.getAllDuas();

      res.json(duas);
    } catch (error) {
      console.error("Error fetching duas:", error);
      res.status(500).json({ message: "Failed to fetch duas" });
    }
  });

  // Get featured duas for homepage
  app.get("/api/duas/featured", async (req, res) => {
    try {
      const featuredDuas = await storage.getFeaturedDuas();
      res.json(featuredDuas);
    } catch (error) {
      console.error("Error fetching featured duas:", error);
      res.status(500).json({ message: "Failed to fetch featured duas" });
    }
  });

  // ============== GLOBAL SEARCH API ==============
  
  // Global search across all content
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      const type = req.query.type as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      
      if (!query || query.trim().length < 2) {
        return res.json({ quran: [], hadith: [], books: [], topics: [], duas: [] });
      }
      
      const results = await storage.globalSearch(query, { type, limit });
      res.json(results);
    } catch (error) {
      console.error("Error in global search:", error);
      res.status(500).json({ message: "Failed to perform search" });
    }
  });

  // ============== RECOMMENDATION API ==============
  
  // Get scenario-based recommendations
  app.get("/api/recommendations/scenario", async (req, res) => {
    try {
      const scenario = req.query.scenario as string;
      
      // Map scenarios to relevant content
      const scenarioMap: Record<string, { duaCategory: string; keywords: string[] }> = {
        stress: { duaCategory: "protection", keywords: ["patience", "sabr", "peace", "tranquility"] },
        sick: { duaCategory: "healing", keywords: ["healing", "shifa", "health", "cure"] },
        anxious: { duaCategory: "protection", keywords: ["anxiety", "worry", "peace", "trust"] },
        grateful: { duaCategory: "gratitude", keywords: ["thanks", "gratitude", "blessing", "alhamdulillah"] },
        difficulty: { duaCategory: "prayer", keywords: ["patience", "hardship", "trial", "sabr"] },
        seeking_guidance: { duaCategory: "prayer", keywords: ["guidance", "istikhara", "wisdom", "decision"] }
      };
      
      const mapping = scenarioMap[scenario];
      if (!mapping) {
        return res.json({ duas: [], verses: [], hadiths: [] });
      }
      
      const duas = await storage.getDuasByCategory(mapping.duaCategory);
      const verses = await storage.searchAyahs(mapping.keywords[0]);
      const hadiths = await storage.searchHadith(mapping.keywords[0]);
      
      res.json({
        scenario,
        duas: duas.slice(0, 3),
        verses: verses.slice(0, 2),
        hadiths: hadiths.slice(0, 2)
      });
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  // ============== OCR API ==============

  // Extract text from image (OCR)
  app.post("/api/ocr", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image file required" });
      }

      const base64Image = req.file.buffer.toString("base64");
      const result = await extractTextFromImage(base64Image);

      res.json(result);
    } catch (error) {
      console.error("Error extracting text:", error);
      res.status(500).json({ message: "Failed to extract text from image" });
    }
  });

  // ============== BOOKS API ==============
  
  // Get all books
  app.get("/api/books", async (req, res) => {
    try {
      const books = await storage.getAllBooks();
      res.json(books);
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ message: "Failed to fetch books" });
    }
  });

  // Get featured books
  app.get("/api/books/featured", async (req, res) => {
    try {
      const books = await storage.getFeaturedBooks();
      res.json(books);
    } catch (error) {
      console.error("Error fetching featured books:", error);
      res.status(500).json({ message: "Failed to fetch featured books" });
    }
  });

  // Get books by category
  app.get("/api/books/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const books = await storage.getBooksByCategory(category);
      res.json(books);
    } catch (error) {
      console.error("Error fetching books by category:", error);
      res.status(500).json({ message: "Failed to fetch books" });
    }
  });

  // Search books
  app.get("/api/books/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query required" });
      }
      const books = await storage.searchBooks(query);
      res.json(books);
    } catch (error) {
      console.error("Error searching books:", error);
      res.status(500).json({ message: "Failed to search books" });
    }
  });

  // Get book by ID
  app.get("/api/books/:id", async (req, res) => {
    try {
      const { id} = req.params;
      const book = await storage.getBookById(id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.json(book);
    } catch (error) {
      console.error("Error fetching book:", error);
      res.status(500).json({ message: "Failed to fetch book" });
    }
  });

  // ============== TOPICS API (Knowledge Hub) ==============
  
  // Get all topics
  app.get("/api/topics", async (req, res) => {
    try {
      const topics = await storage.getAllTopics();
      res.json(topics);
    } catch (error) {
      console.error("Error fetching topics:", error);
      res.status(500).json({ message: "Failed to fetch topics" });
    }
  });

  // Get topics by section
  app.get("/api/sections/:section/topics", async (req, res) => {
    try {
      const { section } = req.params;
      const topics = await storage.getTopicsBySection(section);
      res.json(topics);
    } catch (error) {
      console.error("Error fetching topics by section:", error);
      res.status(500).json({ message: "Failed to fetch topics" });
    }
  });

  // Get topic by slug with related content
  app.get("/api/topics/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const topic = await storage.getTopicBySlug(slug);
      
      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }

      // Get topic content (Quran/Hadith/Book references)
      const content = await storage.getTopicContent(topic.id);
      
      res.json({ topic, content });
    } catch (error) {
      console.error("Error fetching topic:", error);
      res.status(500).json({ message: "Failed to fetch topic" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
