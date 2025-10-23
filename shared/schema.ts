import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, pgEnum, index, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["user", "scholar", "admin"]);
export const hadithGradeEnum = pgEnum("hadith_grade", ["Sahih", "Hasan", "Daif"]);
export const habitTypeEnum = pgEnum("habit_type", ["quran_reading", "fasting", "dua", "prayer"]);
export const languageEnum = pgEnum("language", ["en", "ur", "hi", "ar"]);
export const lineFormatEnum = pgEnum("line_format", ["15", "17", "21"]);
export const reciterEnum = pgEnum("reciter", [
  "mishary_rashid",
  "abdul_basit",
  "abdulrahman_sudais",
  "saad_al_ghamdi",
  "maher_al_muaiqly",
  "ahmed_al_ajmy",
  "muhammad_jibreel",
  "nasser_al_qatami"
]);

// Session storage table - Required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users Table - Compatible with Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").notNull().default("user"),
  verifiedScholar: boolean("verified_scholar").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type InsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Surahs Table (Quran Chapters)
export const surahs = pgTable("surahs", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  nameArabic: text("name_arabic").notNull(),
  revelationPlace: text("revelation_place").notNull(),
  totalAyahs: integer("total_ayahs").notNull(),
});

export const insertSurahSchema = createInsertSchema(surahs);
export type InsertSurah = z.infer<typeof insertSurahSchema>;
export type Surah = typeof surahs.$inferSelect;

// Ayahs Table (Quran Verses)
export const ayahs = pgTable("ayahs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  surahId: integer("surah_id").notNull().references(() => surahs.id),
  ayahNumber: integer("ayah_number").notNull(),
  textArabic: text("text_arabic").notNull(),
  translationEn: text("translation_en").notNull(),
  audioUrl: text("audio_url"),
});

export const insertAyahSchema = createInsertSchema(ayahs).omit({ id: true });
export type InsertAyah = z.infer<typeof insertAyahSchema>;
export type Ayah = typeof ayahs.$inferSelect;

// Tafsir Table (Quran Commentary)
export const tafsir = pgTable("tafsir", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ayahId: varchar("ayah_id").notNull().references(() => ayahs.id),
  scholarName: text("scholar_name").notNull(),
  source: text("source").notNull(),
  commentary: text("commentary").notNull(),
});

export const insertTafsirSchema = createInsertSchema(tafsir).omit({ id: true });
export type InsertTafsir = z.infer<typeof insertTafsirSchema>;
export type Tafsir = typeof tafsir.$inferSelect;

// Hadith Books Table (Collections like Bukhari, Muslim, etc.)
export const hadithBooks = pgTable("hadith_books", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nameArabic: text("name_arabic").notNull(),
  nameEnglish: text("name_english").notNull(),
  author: text("author").notNull(),
  totalHadith: integer("total_hadith").notNull().default(0),
  description: text("description"),
});

export const insertHadithBookSchema = createInsertSchema(hadithBooks).omit({ id: true });
export type InsertHadithBook = z.infer<typeof insertHadithBookSchema>;
export type HadithBook = typeof hadithBooks.$inferSelect;

// Hadith Chapters Table (Kitabs within each book)
export const hadithChapters = pgTable("hadith_chapters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookId: varchar("book_id").notNull().references(() => hadithBooks.id),
  chapterNumber: integer("chapter_number").notNull(),
  titleArabic: text("title_arabic").notNull(),
  titleEnglish: text("title_english").notNull(),
  hadithCount: integer("hadith_count").notNull().default(0),
});

export const insertHadithChapterSchema = createInsertSchema(hadithChapters).omit({ id: true });
export type InsertHadithChapter = z.infer<typeof insertHadithChapterSchema>;
export type HadithChapter = typeof hadithChapters.$inferSelect;

// Hadith Table (Individual hadiths)
export const hadith = pgTable("hadith", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookId: varchar("book_id").references(() => hadithBooks.id), // Nullable for migration
  chapterId: varchar("chapter_id").references(() => hadithChapters.id), // Nullable for migration
  hadithNumber: integer("hadith_number"), // Nullable for migration
  textArabic: text("text_arabic").notNull(),
  translationEn: text("translation_en").notNull(),
  grade: hadithGradeEnum("grade").notNull(),
  narrator: text("narrator").notNull(),
  sourceUrl: text("source_url"),
  // Legacy fields for backward compatibility (will migrate to new structure)
  book: text("book"),
  chapter: text("chapter"),
});

export const insertHadithSchema = createInsertSchema(hadith).omit({ id: true });
export type InsertHadith = z.infer<typeof insertHadithSchema>;
export type Hadith = typeof hadith.$inferSelect;

// Bookmarks Table
export const bookmarks = pgTable("bookmarks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  ayahId: varchar("ayah_id").references(() => ayahs.id),
  hadithId: varchar("hadith_id").references(() => hadith.id),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({
  id: true,
  createdAt: true,
});
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type Bookmark = typeof bookmarks.$inferSelect;

// Events Table
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  organizer: text("organizer").notNull(),
  description: text("description"),
  attendees: integer("attendees").notNull().default(0),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
});
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// Event RSVPs Table
export const eventRsvps = pgTable("event_rsvps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull().references(() => events.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  status: text("status").notNull().default("attending"), // attending, maybe, not_attending
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEventRsvpSchema = createInsertSchema(eventRsvps).omit({
  id: true,
  createdAt: true,
});
export type InsertEventRsvp = z.infer<typeof insertEventRsvpSchema>;
export type EventRsvp = typeof eventRsvps.$inferSelect;

// Finance Articles Table
export const financeArticles = pgTable("finance_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  sources: text("sources").array(),
  authorId: varchar("author_id").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertFinanceArticleSchema = createInsertSchema(financeArticles).omit({
  id: true,
  createdAt: true,
});
export type InsertFinanceArticle = z.infer<typeof insertFinanceArticleSchema>;
export type FinanceArticle = typeof financeArticles.$inferSelect;

// Culture & Brotherhood Articles Table
export const cultureArticles = pgTable("culture_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  titleArabic: text("title_arabic"),
  category: text("category").notNull(), // "brotherhood", "culture", "heritage"
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  sources: text("sources").array(),
  authorId: varchar("author_id").references(() => users.id),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCultureArticleSchema = createInsertSchema(cultureArticles).omit({
  id: true,
  createdAt: true,
});
export type InsertCultureArticle = z.infer<typeof insertCultureArticleSchema>;
export type CultureArticle = typeof cultureArticles.$inferSelect;

// Fatwa Table
export const fatwa = pgTable("fatwa", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  scholarId: varchar("scholar_id").notNull().references(() => users.id),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  reference: text("reference"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertFatwaSchema = createInsertSchema(fatwa).omit({
  id: true,
  createdAt: true,
});
export type InsertFatwa = z.infer<typeof insertFatwaSchema>;
export type Fatwa = typeof fatwa.$inferSelect;

// Duas Table  
export const duas = pgTable("duas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(), // daily, morning, evening, protection, healing, occasions, etc.
  textArabic: text("text_arabic").notNull(),
  translationEn: text("translation_en").notNull(),
  transliteration: text("transliteration"),
  reference: text("reference"),
  benefits: text("benefits"), // Benefits/virtues of the dua
  occasions: text("occasions").array(), // When to recite this dua
  recommendations: text("recommendations"), // AI-powered or scholar recommendations
  featured: boolean("featured").default(false), // Show on homepage
});

export const insertDuaSchema = createInsertSchema(duas).omit({ id: true });
export type InsertDua = z.infer<typeof insertDuaSchema>;
export type Dua = typeof duas.$inferSelect;

// User Habits/Progress Table
export const habits = pgTable("habits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: habitTypeEnum("type").notNull(),
  target: integer("target").notNull(),
  progress: integer("progress").notNull().default(0),
  date: timestamp("date").notNull().defaultNow(),
});

export const insertHabitSchema = createInsertSchema(habits).omit({
  id: true,
  date: true,
});
export type InsertHabit = z.infer<typeof insertHabitSchema>;
export type Habit = typeof habits.$inferSelect;

// Prayer Times Table
export const prayerTimes = pgTable("prayer_times", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  location: text("location").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  fajr: text("fajr").notNull(),
  dhuhr: text("dhuhr").notNull(),
  asr: text("asr").notNull(),
  maghrib: text("maghrib").notNull(),
  isha: text("isha").notNull(),
  date: timestamp("date").notNull(),
});

export const insertPrayerTimeSchema = createInsertSchema(prayerTimes).omit({ id: true });
export type InsertPrayerTime = z.infer<typeof insertPrayerTimeSchema>;
export type PrayerTime = typeof prayerTimes.$inferSelect;

// Ayah Translations Table
export const ayahTranslations = pgTable("ayah_translations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ayahId: varchar("ayah_id").notNull().references(() => ayahs.id),
  language: languageEnum("language").notNull(),
  text: text("text").notNull(),
  translatorName: text("translator_name").notNull(),
});

export const insertAyahTranslationSchema = createInsertSchema(ayahTranslations).omit({ id: true });
export type InsertAyahTranslation = z.infer<typeof insertAyahTranslationSchema>;
export type AyahTranslation = typeof ayahTranslations.$inferSelect;

// Hadith Translations Table
export const hadithTranslations = pgTable("hadith_translations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hadithId: varchar("hadith_id").notNull().references(() => hadith.id),
  language: languageEnum("language").notNull(),
  text: text("text").notNull(),
  translatorName: text("translator_name").notNull(),
});

export const insertHadithTranslationSchema = createInsertSchema(hadithTranslations).omit({ id: true });
export type InsertHadithTranslation = z.infer<typeof insertHadithTranslationSchema>;
export type HadithTranslation = typeof hadithTranslations.$inferSelect;

// Reciters Table
export const reciters = pgTable("reciters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameArabic: text("name_arabic").notNull(),
  identifier: reciterEnum("identifier").notNull().unique(),
  bio: text("bio"),
  imageUrl: text("image_url"),
});

export const insertReciterSchema = createInsertSchema(reciters).omit({ id: true });
export type InsertReciter = z.infer<typeof insertReciterSchema>;
export type Reciter = typeof reciters.$inferSelect;

// Ayah Recitations Table
export const ayahRecitations = pgTable("ayah_recitations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ayahId: varchar("ayah_id").notNull().references(() => ayahs.id),
  reciterId: varchar("reciter_id").notNull().references(() => reciters.id),
  audioUrl: text("audio_url").notNull(),
  duration: integer("duration"),
});

export const insertAyahRecitationSchema = createInsertSchema(ayahRecitations).omit({ id: true });
export type InsertAyahRecitation = z.infer<typeof insertAyahRecitationSchema>;
export type AyahRecitation = typeof ayahRecitations.$inferSelect;

// Surah Line Formats Table
export const surahLineFormats = pgTable("surah_line_formats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  surahId: integer("surah_id").notNull().references(() => surahs.id),
  lineFormat: lineFormatEnum("line_format").notNull(),
  pageNumber: integer("page_number").notNull(),
  startAyah: integer("start_ayah").notNull(),
  endAyah: integer("end_ayah").notNull(),
});

export const insertSurahLineFormatSchema = createInsertSchema(surahLineFormats).omit({ id: true });
export type InsertSurahLineFormat = z.infer<typeof insertSurahLineFormatSchema>;
export type SurahLineFormat = typeof surahLineFormats.$inferSelect;

// Book Categories Enum
export const bookCategoryEnum = pgEnum("book_category", [
  "finance",
  "politics",
  "daily_life",
  "medicine",
  "culture",
  "education",
  "youth",
  "reference"
]);

// Featured Books Table
export const books = pgTable("books", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  titleArabic: text("title_arabic"),
  author: text("author").notNull(),
  authorArabic: text("author_arabic"),
  category: bookCategoryEnum("category").notNull(),
  description: text("description").notNull(),
  language: text("language").notNull(),
  coverImageUrl: text("cover_image_url"),
  pdfUrl: text("pdf_url"),
  purchaseUrl: text("purchase_url"),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBookSchema = createInsertSchema(books).omit({ id: true, createdAt: true });
export type InsertBook = z.infer<typeof insertBookSchema>;
export type Book = typeof books.$inferSelect;

// Section Enum for Knowledge Hub
export const sectionEnum = pgEnum("section", [
  "quran",
  "hadith",
  "finance",
  "daily_life",
  "politics",
  "medicine",
  "culture",
  "events"
]);

// Topics Table for Knowledge Hub
export const topics = pgTable("topics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameArabic: text("name_arabic"),
  section: sectionEnum("section").notNull(),
  summary: text("summary").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTopicSchema = createInsertSchema(topics).omit({ id: true, createdAt: true });
export type InsertTopic = z.infer<typeof insertTopicSchema>;
export type Topic = typeof topics.$inferSelect;

// Content Type Enum
export const contentTypeEnum = pgEnum("content_type", [
  "quran",
  "hadith",
  "book"
]);

// Topic Content Table - Links topics to Quran/Hadith/Books
export const topicContent = pgTable("topic_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  topicId: varchar("topic_id").notNull().references(() => topics.id),
  contentType: contentTypeEnum("content_type").notNull(),
  referenceId: varchar("reference_id").notNull(), // ayah_id, hadith_id, or book_id
  excerpt: text("excerpt"), // Quote or explanation from the source
  pageNumber: text("page_number"), // For books
  relevanceScore: integer("relevance_score").default(50), // For ordering (0-100)
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTopicContentSchema = createInsertSchema(topicContent).omit({ id: true, createdAt: true });
export type InsertTopicContent = z.infer<typeof insertTopicContentSchema>;
export type TopicContent = typeof topicContent.$inferSelect;

// Explicit types for topic content details (works on frontend & backend)
export type AyahDetails = {
  id: string;
  surahId: number;
  ayahNumber: number;
  textArabic: string;
  translationEn: string;
  audioUrl: string | null;
  surah: {
    id: number;
    name: string;
    nameArabic: string;
    revelationPlace: string;
    totalAyahs: number;
  };
};

export type HadithDetails = {
  id: string;
  book: string;
  chapter: string;
  textArabic: string;
  translationEn: string;
  grade: 'Sahih' | 'Hasan' | 'Daif' | 'Mawdu'; // Match database enum (capitalized)
  narrator: string | null;
  sourceUrl: string | null;
};

export type BookDetails = {
  id: string;
  title: string;
  author: string;
  description: string | null;
  category: string;
  purchaseUrl: string | null;
  coverImageUrl: string | null;
};

// Properly discriminated unions for enriched content
export type QuranContent = Omit<TopicContent, 'contentType'> & {
  contentType: 'quran';
  details: AyahDetails;
};

export type HadithContent = Omit<TopicContent, 'contentType'> & {
  contentType: 'hadith';
  details: HadithDetails;
};

export type BookContent = Omit<TopicContent, 'contentType'> & {
  contentType: 'book';
  details: BookDetails;
};

export type MissingContent = TopicContent & {
  details: null;
};

// Enriched Topic Content as discriminated union by contentType
export type EnrichedTopicContent = QuranContent | HadithContent | BookContent | MissingContent;

// Islamic Knowledge Base for AI Assistant
export const islamicKnowledge = pgTable("islamic_knowledge", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  topic: text("topic").notNull(), // e.g., "Prayer", "Fasting", "Zakat", "Halal/Haram"
  question: text("question").notNull(), // Common questions
  answer: text("answer").notNull(), // Detailed answer from authentic sources
  references: text("references").array(), // Quran verses, Hadith, Scholar quotes
  category: text("category").notNull(), // e.g., "Worship", "Transactions", "Ethics", "Beliefs"
  keywords: text("keywords").array(), // For better search
  verified: boolean("verified").notNull().default(true), // Scholarly verification
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertIslamicKnowledgeSchema = createInsertSchema(islamicKnowledge).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export type InsertIslamicKnowledge = z.infer<typeof insertIslamicKnowledgeSchema>;
export type IslamicKnowledge = typeof islamicKnowledge.$inferSelect;
