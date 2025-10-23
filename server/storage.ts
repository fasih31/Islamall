import { db } from "./db";
import {
  type User,
  type InsertUser,
  type UpsertUser,
  type EnrichedTopicContent,
  users,
  type Surah,
  type InsertSurah,
  surahs,
  type Ayah,
  type InsertAyah,
  ayahs,
  type Hadith,
  type InsertHadith,
  hadith,
  type HadithBook,
  type InsertHadithBook,
  hadithBooks,
  type HadithChapter,
  type InsertHadithChapter,
  hadithChapters,
  type Bookmark,
  type InsertBookmark,
  bookmarks,
  type Event,
  type InsertEvent,
  events,
  type EventRsvp,
  type InsertEventRsvp,
  eventRsvps,
  type FinanceArticle,
  type InsertFinanceArticle,
  financeArticles,
  type CultureArticle,
  type InsertCultureArticle,
  cultureArticles,
  type Dua,
  type InsertDua,
  duas,
  type PrayerTime,
  type InsertPrayerTime,
  prayerTimes,
  type AyahTranslation,
  type InsertAyahTranslation,
  ayahTranslations,
  type HadithTranslation,
  type InsertHadithTranslation,
  hadithTranslations,
  type Reciter,
  type InsertReciter,
  reciters,
  type AyahRecitation,
  type InsertAyahRecitation,
  ayahRecitations,
  type SurahLineFormat,
  type InsertSurahLineFormat,
  surahLineFormats,
  type Book,
  type InsertBook,
  books,
  type Topic,
  type InsertTopic,
  topics,
  type TopicContent,
  type InsertTopicContent,
  topicContent,
  type IslamicKnowledge,
  type InsertIslamicKnowledge,
  islamicKnowledge,
} from "@shared/schema";
import { eq, and, or, like, sql, inArray } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Global Search
  globalSearch(query: string, filters?: { type?: string; limit?: number }): Promise<{
    quran: Ayah[];
    hadith: Hadith[];
    books: Book[];
    topics: Topic[];
    duas: Dua[];
  }>;

  // Quran methods
  getSurahs(): Promise<Surah[]>;
  getSurahById(id: number): Promise<Surah | undefined>;
  getAyahsBySurah(surahId: number): Promise<Ayah[]>;
  getAyah(surahId: number, ayahNumber: number): Promise<Ayah | undefined>;
  searchAyahs(query: string): Promise<Ayah[]>;

  // Hadith methods
  getHadithById(id: string): Promise<Hadith | undefined>;
  searchHadith(query: string, grade?: string, book?: string): Promise<Hadith[]>;
  getAllHadith(limit?: number, offset?: number): Promise<Hadith[]>;
  getHadithCount(): Promise<number>;
  getHadithChapters(book: string): Promise<string[]>;
  
  // Hadith Book methods
  getAllHadithBooks(): Promise<HadithBook[]>;
  getHadithBookById(id: string): Promise<HadithBook | undefined>;
  getChaptersByBookId(bookId: string): Promise<HadithChapter[]>;
  getHadithByChapterId(chapterId: string): Promise<Hadith[]>;

  // Bookmark methods
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  getUserBookmarks(userId: string): Promise<Bookmark[]>;
  deleteBookmark(id: string): Promise<void>;

  // Event methods
  getAllEvents(): Promise<Event[]>;
  getEventById(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  // Event RSVP methods
  createEventRsvp(rsvp: InsertEventRsvp): Promise<EventRsvp>;
  getEventRsvps(eventId: string): Promise<EventRsvp[]>;
  getUserEventRsvp(eventId: string, userId: string): Promise<EventRsvp | undefined>;
  updateEventRsvp(id: string, status: string): Promise<EventRsvp>;

  // Finance methods
  getFinanceArticles(): Promise<FinanceArticle[]>;
  getFinanceArticleById(id: string): Promise<FinanceArticle | undefined>;

  // Culture & Brotherhood methods
  getAllCultureArticles(): Promise<CultureArticle[]>;
  getCultureArticleById(id: string): Promise<CultureArticle | undefined>;
  getCultureArticlesByCategory(category: string): Promise<CultureArticle[]>;
  getFeaturedCultureArticles(): Promise<CultureArticle[]>;
  createCultureArticle(article: InsertCultureArticle): Promise<CultureArticle>;

  // Dua methods
  getDuasByCategory(category: string): Promise<Dua[]>;
  getAllDuas(): Promise<Dua[]>;
  getFeaturedDuas(): Promise<Dua[]>;

  // Prayer Times methods
  getPrayerTimes(location: string, date: Date): Promise<PrayerTime | undefined>;
  savePrayerTimes(prayerTime: InsertPrayerTime): Promise<PrayerTime>;

  // Translation methods
  getAyahTranslations(ayahId: string, language?: string): Promise<AyahTranslation[]>;
  createAyahTranslation(translation: InsertAyahTranslation): Promise<AyahTranslation>;
  getHadithTranslations(hadithId: string, language?: string): Promise<HadithTranslation[]>;
  createHadithTranslation(translation: InsertHadithTranslation): Promise<HadithTranslation>;

  // Reciter methods
  getAllReciters(): Promise<Reciter[]>;
  getReciterById(id: string): Promise<Reciter | undefined>;
  createReciter(reciter: InsertReciter): Promise<Reciter>;

  // Recitation methods
  getAyahRecitations(ayahId: string, reciterId?: string): Promise<AyahRecitation[]>;
  createAyahRecitation(recitation: InsertAyahRecitation): Promise<AyahRecitation>;

  // Line Format methods
  getSurahLineFormats(surahId: number, lineFormat?: string): Promise<SurahLineFormat[]>;
  createSurahLineFormat(format: InsertSurahLineFormat): Promise<SurahLineFormat>;

  // Books methods
  getAllBooks(): Promise<Book[]>;
  getBookById(id: string): Promise<Book | undefined>;
  getBooksByCategory(category: string): Promise<Book[]>;
  getFeaturedBooks(): Promise<Book[]>;
  searchBooks(query: string): Promise<Book[]>;

  // Topics methods
  getAllTopics(): Promise<Topic[]>;
  getTopicById(id: string): Promise<Topic | undefined>;
  getTopicBySlug(slug: string): Promise<Topic | undefined>;
  getTopicsBySection(section: string): Promise<Topic[]>;
  createTopic(topic: InsertTopic): Promise<Topic>;
  
  // Topic Content methods
  getTopicContent(topicId: string): Promise<EnrichedTopicContent[]>;
  createTopicContent(content: InsertTopicContent): Promise<TopicContent>;

  // Islamic Knowledge Base methods  
  searchIslamicKnowledge(query: string): Promise<IslamicKnowledge[]>;
  getKnowledgeByCategory(category: string): Promise<IslamicKnowledge[]>;
  globalSearch(query: string, filters?: { type?: string; limit?: number }): Promise<{
    quran: Ayah[];
    hadith: Hadith[];
    books: Book[];
    topics: Topic[];
    duas: Dua[];
  }>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const result = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result[0];
  }

  // Global Search
  async globalSearch(query: string, filters?: { type?: string; limit?: number }): Promise<{
    quran: Ayah[];
    hadith: Hadith[];
    books: Book[];
    topics: Topic[];
    duas: Dua[];
  }> {
    const searchPattern = `%${query}%`;
    const limit = filters?.limit || 5;

    // Search Quran (Arabic and English translation)
    const quranResults = (!filters?.type || filters.type === 'quran') 
      ? await db
          .select()
          .from(ayahs)
          .where(
            or(
              like(ayahs.textArabic, searchPattern),
              like(ayahs.translationEn, searchPattern)
            )
          )
          .limit(limit)
      : [];

    // Search Hadith (Arabic and English)
    const hadithResults = (!filters?.type || filters.type === 'hadith')
      ? await db
          .select()
          .from(hadith)
          .where(
            or(
              like(hadith.textArabic, searchPattern),
              like(hadith.translationEn, searchPattern)
            )
          )
          .limit(limit)
      : [];

    // Search Books (title, author, description)
    const bookResults = (!filters?.type || filters.type === 'books')
      ? await db
          .select()
          .from(books)
          .where(
            or(
              like(books.title, searchPattern),
              like(books.author, searchPattern),
              like(books.description, searchPattern)
            )
          )
          .limit(limit)
      : [];

    // Search Topics (name, summary)
    const topicResults = (!filters?.type || filters.type === 'topics')
      ? await db
          .select()
          .from(topics)
          .where(
            or(
              like(topics.name, searchPattern),
              like(topics.summary, searchPattern)
            )
          )
          .limit(limit)
      : [];

    // Search Duas (Arabic text, translation, transliteration)
    const duaResults = (!filters?.type || filters.type === 'duas')
      ? await db
          .select()
          .from(duas)
          .where(
            or(
              like(duas.textArabic, searchPattern),
              like(duas.translationEn, searchPattern),
              like(duas.transliteration, searchPattern)
            )
          )
          .limit(limit)
      : [];

    return {
      quran: quranResults,
      hadith: hadithResults,
      books: bookResults,
      topics: topicResults,
      duas: duaResults,
    };
  }

  // Quran methods
  async getSurahs(): Promise<Surah[]> {
    return await db.select().from(surahs).orderBy(surahs.id);
  }

  async getSurahById(id: number): Promise<Surah | undefined> {
    const result = await db.select().from(surahs).where(eq(surahs.id, id));
    return result[0];
  }

  async getAyahsBySurah(surahId: number): Promise<Ayah[]> {
    return await db
      .select()
      .from(ayahs)
      .where(eq(ayahs.surahId, surahId))
      .orderBy(ayahs.ayahNumber);
  }

  async getAyah(surahId: number, ayahNumber: number): Promise<Ayah | undefined> {
    const result = await db
      .select()
      .from(ayahs)
      .where(and(eq(ayahs.surahId, surahId), eq(ayahs.ayahNumber, ayahNumber)));
    return result[0];
  }

  async searchAyahs(query: string): Promise<Ayah[]> {
    return await db
      .select()
      .from(ayahs)
      .where(
        or(
          like(ayahs.textArabic, `%${query}%`),
          like(ayahs.translationEn, `%${query}%`)
        )
      )
      .limit(50);
  }

  // Hadith methods
  async getHadithById(id: string): Promise<Hadith | undefined> {
    const result = await db.select().from(hadith).where(eq(hadith.id, id));
    return result[0];
  }

  async searchHadith(query: string, grade?: string, book?: string): Promise<Hadith[]> {
    let conditions = [
      or(
        like(hadith.textArabic, `%${query}%`),
        like(hadith.translationEn, `%${query}%`),
        like(hadith.narrator, `%${query}%`)
      ),
    ];

    if (grade) {
      conditions.push(eq(hadith.grade, grade as any));
    }

    if (book) {
      conditions.push(like(hadith.book, `%${book}%`));
    }

    return await db
      .select()
      .from(hadith)
      .where(and(...conditions))
      .limit(50);
  }

  async getAllHadith(limit: number = 50, offset: number = 0): Promise<Hadith[]> {
    return await db.select().from(hadith).limit(limit).offset(offset);
  }
  
  async getHadithCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)::int` }).from(hadith);
    return result[0].count;
  }
  
  async getHadithChapters(book: string): Promise<string[]> {
    const result = await db.selectDistinct({ chapter: hadith.chapter })
      .from(hadith)
      .where(eq(hadith.book, book))
      .orderBy(hadith.chapter);
    return result.map(r => r.chapter).filter((ch): ch is string => ch !== null);
  }

  // Bookmark methods
  async createBookmark(insertBookmark: InsertBookmark): Promise<Bookmark> {
    const result = await db.insert(bookmarks).values(insertBookmark).returning();
    return result[0];
  }

  async getUserBookmarks(userId: string): Promise<Bookmark[]> {
    return await db.select().from(bookmarks).where(eq(bookmarks.userId, userId));
  }

  async deleteBookmark(id: string): Promise<void> {
    await db.delete(bookmarks).where(eq(bookmarks.id, id));
  }

  // Event methods
  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(sql`${events.date} DESC`);
  }

  async getEventById(id: string): Promise<Event | undefined> {
    const result = await db.select().from(events).where(eq(events.id, id));
    return result[0];
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const result = await db.insert(events).values(insertEvent).returning();
    return result[0];
  }

  // Event RSVP methods
  async createEventRsvp(insertRsvp: InsertEventRsvp): Promise<EventRsvp> {
    const result = await db.insert(eventRsvps).values(insertRsvp).returning();
    return result[0];
  }

  async getEventRsvps(eventId: string): Promise<EventRsvp[]> {
    return await db.select().from(eventRsvps).where(eq(eventRsvps.eventId, eventId));
  }

  async getUserEventRsvp(eventId: string, userId: string): Promise<EventRsvp | undefined> {
    const result = await db.select().from(eventRsvps)
      .where(and(eq(eventRsvps.eventId, eventId), eq(eventRsvps.userId, userId)));
    return result[0];
  }

  async updateEventRsvp(id: string, status: string): Promise<EventRsvp> {
    const result = await db.update(eventRsvps)
      .set({ status })
      .where(eq(eventRsvps.id, id))
      .returning();
    return result[0];
  }

  // Finance methods
  async getFinanceArticles(): Promise<FinanceArticle[]> {
    return await db.select().from(financeArticles).orderBy(sql`${financeArticles.createdAt} DESC`);
  }

  async getFinanceArticleById(id: string): Promise<FinanceArticle | undefined> {
    const result = await db.select().from(financeArticles).where(eq(financeArticles.id, id));
    return result[0];
  }

  // Culture & Brotherhood methods
  async getAllCultureArticles(): Promise<CultureArticle[]> {
    return await db.select().from(cultureArticles).orderBy(sql`${cultureArticles.createdAt} DESC`);
  }

  async getCultureArticleById(id: string): Promise<CultureArticle | undefined> {
    const result = await db.select().from(cultureArticles).where(eq(cultureArticles.id, id));
    return result[0];
  }

  async getCultureArticlesByCategory(category: string): Promise<CultureArticle[]> {
    return await db.select().from(cultureArticles)
      .where(eq(cultureArticles.category, category))
      .orderBy(sql`${cultureArticles.createdAt} DESC`);
  }

  async getFeaturedCultureArticles(): Promise<CultureArticle[]> {
    return await db.select().from(cultureArticles)
      .where(eq(cultureArticles.featured, true))
      .orderBy(sql`${cultureArticles.createdAt} DESC`);
  }

  async createCultureArticle(article: InsertCultureArticle): Promise<CultureArticle> {
    const [newArticle] = await db.insert(cultureArticles).values(article).returning();
    return newArticle;
  }

  // Dua methods
  async getDuasByCategory(category: string): Promise<Dua[]> {
    return await db.select().from(duas).where(eq(duas.category, category));
  }

  async getAllDuas(): Promise<Dua[]> {
    return await db.select().from(duas);
  }

  async getFeaturedDuas(): Promise<Dua[]> {
    return await db.select().from(duas).where(eq(duas.featured, true));
  }

  // Prayer Times methods
  async getPrayerTimes(location: string, date: Date): Promise<PrayerTime | undefined> {
    const result = await db
      .select()
      .from(prayerTimes)
      .where(
        and(
          eq(prayerTimes.location, location),
          eq(prayerTimes.date, date)
        )
      );
    return result[0];
  }

  async savePrayerTimes(insertPrayerTime: InsertPrayerTime): Promise<PrayerTime> {
    const result = await db.insert(prayerTimes).values(insertPrayerTime).returning();
    return result[0];
  }

  // Translation methods
  async getAyahTranslations(ayahId: string, language?: string): Promise<AyahTranslation[]> {
    const conditions = [eq(ayahTranslations.ayahId, ayahId)];
    if (language) {
      conditions.push(eq(ayahTranslations.language, language as any));
    }
    return await db
      .select()
      .from(ayahTranslations)
      .where(and(...conditions));
  }

  async createAyahTranslation(translation: InsertAyahTranslation): Promise<AyahTranslation> {
    const result = await db.insert(ayahTranslations).values(translation).returning();
    return result[0];
  }

  async getHadithTranslations(hadithId: string, language?: string): Promise<HadithTranslation[]> {
    const conditions = [eq(hadithTranslations.hadithId, hadithId)];
    if (language) {
      conditions.push(eq(hadithTranslations.language, language as any));
    }
    return await db
      .select()
      .from(hadithTranslations)
      .where(and(...conditions));
  }

  async createHadithTranslation(translation: InsertHadithTranslation): Promise<HadithTranslation> {
    const result = await db.insert(hadithTranslations).values(translation).returning();
    return result[0];
  }

  // Reciter methods
  async getAllReciters(): Promise<Reciter[]> {
    return await db.select().from(reciters);
  }

  async getReciterById(id: string): Promise<Reciter | undefined> {
    const result = await db.select().from(reciters).where(eq(reciters.id, id));
    return result[0];
  }

  async createReciter(reciter: InsertReciter): Promise<Reciter> {
    const result = await db.insert(reciters).values(reciter).returning();
    return result[0];
  }

  // Recitation methods
  async getAyahRecitations(ayahId: string, reciterId?: string): Promise<AyahRecitation[]> {
    const conditions = [eq(ayahRecitations.ayahId, ayahId)];
    if (reciterId) {
      conditions.push(eq(ayahRecitations.reciterId, reciterId));
    }
    return await db
      .select()
      .from(ayahRecitations)
      .where(and(...conditions));
  }

  async createAyahRecitation(recitation: InsertAyahRecitation): Promise<AyahRecitation> {
    const result = await db.insert(ayahRecitations).values(recitation).returning();
    return result[0];
  }

  // Line Format methods
  async getSurahLineFormats(surahId: number, lineFormat?: string): Promise<SurahLineFormat[]> {
    const conditions = [eq(surahLineFormats.surahId, surahId)];
    if (lineFormat) {
      conditions.push(eq(surahLineFormats.lineFormat, lineFormat as any));
    }
    return await db
      .select()
      .from(surahLineFormats)
      .where(and(...conditions))
      .orderBy(surahLineFormats.pageNumber);
  }

  async createSurahLineFormat(format: InsertSurahLineFormat): Promise<SurahLineFormat> {
    const result = await db.insert(surahLineFormats).values(format).returning();
    return result[0];
  }

  // Books methods
  async getAllBooks(): Promise<Book[]> {
    return await db.select().from(books).orderBy(books.createdAt);
  }

  async getBookById(id: string): Promise<Book | undefined> {
    const result = await db.select().from(books).where(eq(books.id, id));
    return result[0];
  }

  async getBooksByCategory(category: string): Promise<Book[]> {
    return await db.select().from(books).where(eq(books.category, category as any));
  }

  async getFeaturedBooks(): Promise<Book[]> {
    return await db.select().from(books).where(eq(books.isFeatured, true));
  }

  async searchBooks(query: string): Promise<Book[]> {
    const searchPattern = `%${query}%`;
    return await db
      .select()
      .from(books)
      .where(
        or(
          like(books.title, searchPattern),
          like(books.author, searchPattern),
          like(books.description, searchPattern)
        )
      );
  }

  // Topics methods
  async getAllTopics(): Promise<Topic[]> {
    return await db.select().from(topics).orderBy(topics.section, topics.name);
  }

  async getTopicById(id: string): Promise<Topic | undefined> {
    const result = await db.select().from(topics).where(eq(topics.id, id));
    return result[0];
  }

  async getTopicBySlug(slug: string): Promise<Topic | undefined> {
    const result = await db.select().from(topics).where(eq(topics.slug, slug));
    return result[0];
  }

  async getTopicsBySection(section: string): Promise<Topic[]> {
    return await db.select().from(topics).where(eq(topics.section, section as any));
  }

  async createTopic(topic: InsertTopic): Promise<Topic> {
    const result = await db.insert(topics).values(topic).returning();
    return result[0];
  }

  // Topic Content methods
  async getTopicContent(topicId: string): Promise<EnrichedTopicContent[]> {
    // Get all content links for this topic
    const content = await db
      .select()
      .from(topicContent)
      .where(eq(topicContent.topicId, topicId))
      .orderBy(topicContent.relevanceScore);

    if (content.length === 0) return [];

    // Separate reference IDs by type for batch queries
    const quranIds = content.filter(c => c.contentType === 'quran').map(c => c.referenceId);
    const hadithIds = content.filter(c => c.contentType === 'hadith').map(c => c.referenceId);
    const bookIds = content.filter(c => c.contentType === 'book').map(c => c.referenceId);

    // Batch fetch all referenced content with JOINs
    const [quranData, hadithData, bookData] = await Promise.all([
      // Fetch Quran verses with Surah info in one JOIN query
      quranIds.length > 0
        ? db
            .select({
              ayah: ayahs,
              surah: surahs
            })
            .from(ayahs)
            .innerJoin(surahs, eq(ayahs.surahId, surahs.id))
            .where(inArray(ayahs.id, quranIds))
        : Promise.resolve([]),
      
      // Fetch Hadiths in one query
      hadithIds.length > 0
        ? db.select().from(hadith).where(inArray(hadith.id, hadithIds))
        : Promise.resolve([]),
      
      // Fetch Books in one query
      bookIds.length > 0
        ? db.select().from(books).where(inArray(books.id, bookIds))
        : Promise.resolve([])
    ]);

    // Create lookup maps for O(1) access
    const quranMap = new Map(quranData.map(item => [item.ayah.id, { ...item.ayah, surah: item.surah }]));
    const hadithMap = new Map(hadithData.map(item => [item.id, item]));
    const bookMap = new Map(bookData.map(item => [item.id, item]));

    // Enrich content with details using maps (with proper type narrowing)
    const enrichedContent: EnrichedTopicContent[] = content.map(item => {
      let details: any = null;
      
      if (item.contentType === 'quran') {
        const ayahData = quranMap.get(item.referenceId);
        if (ayahData) {
          details = {
            id: ayahData.id,
            surahId: ayahData.surahId,
            ayahNumber: ayahData.ayahNumber,
            textArabic: ayahData.textArabic,
            translationEn: ayahData.translationEn,
            audioUrl: ayahData.audioUrl,
            surah: {
              id: ayahData.surah.id,
              name: ayahData.surah.name,
              nameArabic: ayahData.surah.nameArabic,
              revelationPlace: ayahData.surah.revelationPlace,
              totalAyahs: ayahData.surah.totalAyahs
            }
          };
        }
      } else if (item.contentType === 'hadith') {
        const hadithData = hadithMap.get(item.referenceId);
        if (hadithData) {
          details = {
            id: hadithData.id,
            book: hadithData.book,
            chapter: hadithData.chapter,
            textArabic: hadithData.textArabic,
            translationEn: hadithData.translationEn,
            grade: hadithData.grade,
            narrator: hadithData.narrator,
            sourceUrl: hadithData.sourceUrl
          };
        }
      } else if (item.contentType === 'book') {
        const bookData = bookMap.get(item.referenceId);
        if (bookData) {
          details = {
            id: bookData.id,
            title: bookData.title,
            author: bookData.author,
            description: bookData.description,
            category: bookData.category,
            purchaseUrl: bookData.purchaseUrl,
            coverImageUrl: bookData.coverImageUrl
          };
        }
      }
      
      // Log warning for missing references (data integrity issue)
      if (!details) {
        console.warn(`Missing ${item.contentType} reference: ${item.referenceId} for topic ${topicId}`);
      }
      
      return {
        ...item,
        details
      };
    });

    // Return ALL items including those with null details
    // Frontend can decide how to display missing content
    return enrichedContent;
  }

  async createTopicContent(content: InsertTopicContent): Promise<TopicContent> {
    const result = await db.insert(topicContent).values(content).returning();
    return result[0];
  }

  // Islamic Knowledge Base methods
  async searchIslamicKnowledge(query: string): Promise<IslamicKnowledge[]> {
    const searchPattern = `%${query}%`;
    return await db
      .select()
      .from(islamicKnowledge)
      .where(
        or(
          like(islamicKnowledge.question, searchPattern),
          like(islamicKnowledge.answer, searchPattern),
          like(islamicKnowledge.topic, searchPattern)
        )
      )
      .limit(10);
  }

  async getKnowledgeByCategory(category: string): Promise<IslamicKnowledge[]> {
    return await db
      .select()
      .from(islamicKnowledge)
      .where(eq(islamicKnowledge.category, category))
      .orderBy(islamicKnowledge.topic);
  }

  // Hadith Book methods
  async getAllHadithBooks(): Promise<HadithBook[]> {
    return await db.select().from(hadithBooks).orderBy(hadithBooks.nameEnglish);
  }

  async getHadithBookById(id: string): Promise<HadithBook | undefined> {
    const result = await db.select().from(hadithBooks).where(eq(hadithBooks.id, id));
    return result[0];
  }

  async getChaptersByBookId(bookId: string): Promise<HadithChapter[]> {
    return await db
      .select()
      .from(hadithChapters)
      .where(eq(hadithChapters.bookId, bookId))
      .orderBy(hadithChapters.chapterNumber);
  }

  async getHadithByChapterId(chapterId: string): Promise<Hadith[]> {
    return await db
      .select()
      .from(hadith)
      .where(eq(hadith.chapterId, chapterId))
      .orderBy(hadith.hadithNumber);
  }
}

export const storage = new DatabaseStorage();
