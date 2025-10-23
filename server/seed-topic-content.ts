import { db } from "./db";
import { topicContent, type InsertTopicContent } from "@shared/schema";
import { sql } from "drizzle-orm";

async function seedTopicContent() {
  console.log("🌱 Seeding topic content links...");
  
  try {
    // Get topic IDs
    const topics = await db.execute(sql`SELECT id, slug FROM topics`);
    const topicMap = new Map(topics.rows.map((t: any) => [t.slug, t.id]));
    
    const contentLinks: InsertTopicContent[] = [];

    // 1. RIBA (INTEREST) - Finance Topic
    const ribaId = topicMap.get('riba-interest');
    if (ribaId) {
      // Quran verses about Riba (Surah Al-Baqarah 2:275-279)
      const ribaVerses = await db.execute(sql`
        SELECT id FROM ayahs WHERE surah_id = 2 AND ayah_number BETWEEN 275 AND 279
      `);
      ribaVerses.rows.forEach((ayah: any) => {
        contentLinks.push({
          topicId: ribaId,
          contentType: 'quran',
          referenceId: ayah.id,
        });
      });
      
      // Hadiths about interest/usury
      const ribaHadiths = await db.execute(sql`
        SELECT id FROM hadith WHERE translation_en ILIKE '%riba%' OR translation_en ILIKE '%usury%' OR translation_en ILIKE '%interest%' LIMIT 3
      `);
      ribaHadiths.rows.forEach((hadith: any) => {
        contentLinks.push({
          topicId: ribaId,
          contentType: 'hadith',
          referenceId: hadith.id,
        });
      });
      
      // Finance books
      const financeBooks = await db.execute(sql`
        SELECT id FROM books WHERE category = 'finance' LIMIT 3
      `);
      financeBooks.rows.forEach((book: any) => {
        contentLinks.push({
          topicId: ribaId,
          contentType: 'book',
          referenceId: book.id,
        });
      });
    }

    // 2. ZAKAT - Finance Topic
    const zakatId = topicMap.get('zakat');
    if (zakatId) {
      // Quran verses about Zakat
      const zakatVerses = await db.execute(sql`
        SELECT id FROM ayahs WHERE surah_id = 2 AND ayah_number IN (43, 110, 267, 271, 273) 
        OR surah_id = 9 AND ayah_number = 103 
        OR surah_id = 24 AND ayah_number = 56
        LIMIT 5
      `);
      zakatVerses.rows.forEach((ayah: any) => {
        contentLinks.push({
          topicId: zakatId,
          contentType: 'quran',
          referenceId: ayah.id,
        });
      });
      
      // Hadiths about Zakat
      const zakatHadiths = await db.execute(sql`
        SELECT id FROM hadith WHERE translation_en ILIKE '%zakat%' OR translation_en ILIKE '%charity%' LIMIT 3
      `);
      zakatHadiths.rows.forEach((hadith: any) => {
        contentLinks.push({
          topicId: zakatId,
          contentType: 'hadith',
          referenceId: hadith.id,
        });
      });
      
      // Finance books
      const zakatBooks = await db.execute(sql`
        SELECT id FROM books WHERE category = 'finance' LIMIT 3
      `);
      zakatBooks.rows.forEach((book: any) => {
        contentLinks.push({
          topicId: zakatId,
          contentType: 'book',
          referenceId: book.id,
        });
      });
    }

    // 3. HALAL TRADE & BUSINESS - Finance Topic
    const halalTradeId = topicMap.get('halal-trade-business');
    if (halalTradeId) {
      // Quran verses about trade
      const tradeVerses = await db.execute(sql`
        SELECT id FROM ayahs WHERE surah_id = 4 AND ayah_number = 29 
        OR surah_id = 2 AND ayah_number = 282
        OR surah_id = 62 AND ayah_number = 10
        LIMIT 3
      `);
      tradeVerses.rows.forEach((ayah: any) => {
        contentLinks.push({
          topicId: halalTradeId,
          contentType: 'quran',
          referenceId: ayah.id,
        });
      });
      
      // Finance books
      const tradeBooks = await db.execute(sql`
        SELECT id FROM books WHERE category = 'finance' LIMIT 3
      `);
      tradeBooks.rows.forEach((book: any) => {
        contentLinks.push({
          topicId: halalTradeId,
          contentType: 'book',
          referenceId: book.id,
        });
      });
    }

    // 4. SALAH (PRAYER) - Daily Life Topic
    const salahId = topicMap.get('salah-prayer');
    if (salahId) {
      // Quran verses about prayer
      const prayerVerses = await db.execute(sql`
        SELECT id FROM ayahs WHERE surah_id = 2 AND ayah_number IN (45, 153, 238, 239)
        OR surah_id = 4 AND ayah_number = 103
        OR surah_id = 29 AND ayah_number = 45
        LIMIT 5
      `);
      prayerVerses.rows.forEach((ayah: any) => {
        contentLinks.push({
          topicId: salahId,
          contentType: 'quran',
          referenceId: ayah.id,
        });
      });
      
      // Hadiths about prayer
      const prayerHadiths = await db.execute(sql`
        SELECT id FROM hadith WHERE translation_en ILIKE '%prayer%' OR translation_en ILIKE '%salah%' LIMIT 3
      `);
      prayerHadiths.rows.forEach((hadith: any) => {
        contentLinks.push({
          topicId: salahId,
          contentType: 'hadith',
          referenceId: hadith.id,
        });
      });
      
      // Daily life books
      const dailyLifeBooks = await db.execute(sql`
        SELECT id FROM books WHERE category = 'daily_life' LIMIT 3
      `);
      dailyLifeBooks.rows.forEach((book: any) => {
        contentLinks.push({
          topicId: salahId,
          contentType: 'book',
          referenceId: book.id,
        });
      });
    }

    // 5. FASTING (SAWM) - Daily Life Topic
    const fastingId = topicMap.get('fasting-sawm');
    if (fastingId) {
      // Quran verses about fasting
      const fastingVerses = await db.execute(sql`
        SELECT id FROM ayahs WHERE surah_id = 2 AND ayah_number BETWEEN 183 AND 185
        LIMIT 3
      `);
      fastingVerses.rows.forEach((ayah: any) => {
        contentLinks.push({
          topicId: fastingId,
          contentType: 'quran',
          referenceId: ayah.id,
        });
      });
      
      // Hadiths about fasting
      const fastingHadiths = await db.execute(sql`
        SELECT id FROM hadith WHERE translation_en ILIKE '%fasting%' OR translation_en ILIKE '%ramadan%' LIMIT 3
      `);
      fastingHadiths.rows.forEach((hadith: any) => {
        contentLinks.push({
          topicId: fastingId,
          contentType: 'hadith',
          referenceId: hadith.id,
        });
      });
      
      // Daily life books
      const fastingBooks = await db.execute(sql`
        SELECT id FROM books WHERE category = 'daily_life' LIMIT 2
      `);
      fastingBooks.rows.forEach((book: any) => {
        contentLinks.push({
          topicId: fastingId,
          contentType: 'book',
          referenceId: book.id,
        });
      });
    }

    // 6. ISLAMIC MANNERS (ADAB) - Daily Life Topic
    const mannersId = topicMap.get('islamic-manners-adab');
    if (mannersId) {
      // Hadiths about manners
      const mannersHadiths = await db.execute(sql`
        SELECT id FROM hadith WHERE translation_en ILIKE '%manners%' OR translation_en ILIKE '%kindness%' OR translation_en ILIKE '%etiquette%' LIMIT 3
      `);
      mannersHadiths.rows.forEach((hadith: any) => {
        contentLinks.push({
          topicId: mannersId,
          contentType: 'hadith',
          referenceId: hadith.id,
        });
      });
      
      // Daily life books
      const mannersBooks = await db.execute(sql`
        SELECT id FROM books WHERE category = 'daily_life' LIMIT 3
      `);
      mannersBooks.rows.forEach((book: any) => {
        contentLinks.push({
          topicId: mannersId,
          contentType: 'book',
          referenceId: book.id,
        });
      });
    }

    // 7. SHURA (CONSULTATION) - Politics Topic
    const shuraId = topicMap.get('shura-consultation');
    if (shuraId) {
      // Quran verses about consultation
      const shuraVerses = await db.execute(sql`
        SELECT id FROM ayahs WHERE surah_id = 42 AND ayah_number = 38 
        OR surah_id = 3 AND ayah_number = 159
        LIMIT 2
      `);
      shuraVerses.rows.forEach((ayah: any) => {
        contentLinks.push({
          topicId: shuraId,
          contentType: 'quran',
          referenceId: ayah.id,
        });
      });
      
      // Politics books
      const politicsBooks = await db.execute(sql`
        SELECT id FROM books WHERE category = 'politics' LIMIT 3
      `);
      politicsBooks.rows.forEach((book: any) => {
        contentLinks.push({
          topicId: shuraId,
          contentType: 'book',
          referenceId: book.id,
        });
      });
    }

    // 8. JUSTICE IN GOVERNANCE - Politics Topic
    const justiceId = topicMap.get('justice-governance');
    if (justiceId) {
      // Quran verses about justice
      const justiceVerses = await db.execute(sql`
        SELECT id FROM ayahs WHERE surah_id = 4 AND ayah_number = 58 
        OR surah_id = 5 AND ayah_number = 8
        OR surah_id = 16 AND ayah_number = 90
        LIMIT 3
      `);
      justiceVerses.rows.forEach((ayah: any) => {
        contentLinks.push({
          topicId: justiceId,
          contentType: 'quran',
          referenceId: ayah.id,
        });
      });
      
      // Hadiths about justice
      const justiceHadiths = await db.execute(sql`
        SELECT id FROM hadith WHERE translation_en ILIKE '%justice%' OR translation_en ILIKE '%just%' OR translation_en ILIKE '%fair%' LIMIT 3
      `);
      justiceHadiths.rows.forEach((hadith: any) => {
        contentLinks.push({
          topicId: justiceId,
          contentType: 'hadith',
          referenceId: hadith.id,
        });
      });
      
      // Politics books
      const justiceBooks = await db.execute(sql`
        SELECT id FROM books WHERE category = 'politics' LIMIT 3
      `);
      justiceBooks.rows.forEach((book: any) => {
        contentLinks.push({
          topicId: justiceId,
          contentType: 'book',
          referenceId: book.id,
        });
      });
    }

    // 9. CUPPING (HIJAMA) - Medicine Topic
    const cuppingId = topicMap.get('cupping-hijama');
    if (cuppingId) {
      // Hadiths about cupping
      const cuppingHadiths = await db.execute(sql`
        SELECT id FROM hadith WHERE translation_en ILIKE '%cupping%' OR translation_en ILIKE '%hijama%' LIMIT 3
      `);
      cuppingHadiths.rows.forEach((hadith: any) => {
        contentLinks.push({
          topicId: cuppingId,
          contentType: 'hadith',
          referenceId: hadith.id,
        });
      });
      
      // Medicine books
      const medicineBooks = await db.execute(sql`
        SELECT id FROM books WHERE category = 'medicine' LIMIT 3
      `);
      medicineBooks.rows.forEach((book: any) => {
        contentLinks.push({
          topicId: cuppingId,
          contentType: 'book',
          referenceId: book.id,
        });
      });
    }

    // 10. BLACK SEED - Medicine Topic
    const blackSeedId = topicMap.get('black-seed');
    if (blackSeedId) {
      // Hadiths about black seed
      const blackSeedHadiths = await db.execute(sql`
        SELECT id FROM hadith WHERE translation_en ILIKE '%black seed%' OR translation_en ILIKE '%habbat%' LIMIT 3
      `);
      blackSeedHadiths.rows.forEach((hadith: any) => {
        contentLinks.push({
          topicId: blackSeedId,
          contentType: 'hadith',
          referenceId: hadith.id,
        });
      });
      
      // Medicine books
      const blackSeedBooks = await db.execute(sql`
        SELECT id FROM books WHERE category = 'medicine' LIMIT 3
      `);
      blackSeedBooks.rows.forEach((book: any) => {
        contentLinks.push({
          topicId: blackSeedId,
          contentType: 'book',
          referenceId: book.id,
        });
      });
    }

    // Insert all content links
    console.log(`\n📝 Inserting ${contentLinks.length} topic content links...`);
    
    for (const link of contentLinks) {
      await db.insert(topicContent).values(link).onConflictDoNothing();
    }
    
    console.log("\n✅ Topic content seeding completed!");
    console.log(`Total content links created: ${contentLinks.length}`);
    
  } catch (error) {
    console.error("❌ Error seeding topic content:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedTopicContent()
    .then(() => {
      console.log("🎉 Topic content seeding complete!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Topic content seeding failed:", error);
      process.exit(1);
    });
}

export { seedTopicContent };
