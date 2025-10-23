import { db } from "./db";
import { surahs, ayahs, ayahTranslations, hadith, hadithTranslations } from "@shared/schema";

const ALQURAN_API = "https://api.alquran.cloud/v1";
const BATCH_SIZE = 100; // Insert in batches of 100

async function fastSeedQuran() {
  console.log("🕌 Starting fast Quran seed with batch inserts...");

  try {
    // Fetch all editions in parallel
    console.log("📡 Fetching all Quran editions in parallel...");
    const [arabicRes, englishRes, urduRes, hindiRes] = await Promise.all([
      fetch(`${ALQURAN_API}/quran/quran-uthmani`),
      fetch(`${ALQURAN_API}/quran/en.sahih`),
      fetch(`${ALQURAN_API}/quran/ur.ahmedali`),
      fetch(`${ALQURAN_API}/quran/hi.farooq`),
    ]);

    const [arabicData, englishData, urduData, hindiData] = await Promise.all([
      arabicRes.json(),
      englishRes.json(),
      urduRes.json(),
      hindiRes.json(),
    ]);

    console.log(`✅ Fetched ${arabicData.data.surahs.length} surahs with all translations`);

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await db.delete(ayahTranslations);
    await db.delete(ayahs);
    await db.delete(surahs);

    // Prepare surah data for batch insert
    console.log("📚 Preparing surahs for batch insert...");
    const surahData = arabicData.data.surahs.map((surah: any) => ({
      id: surah.number,
      name: surah.englishName,
      nameArabic: surah.name,
      revelationPlace: surah.revelationType,
      totalAyahs: surah.numberOfAyahs || surah.ayahs?.length || 0,
    }));

    // Batch insert surahs
    await db.insert(surahs).values(surahData);
    console.log(`✅ Inserted ${surahData.length} surahs`);

    // Prepare ayah and translation data
    console.log("📝 Preparing ayahs and translations...");
    const ayahBatch: any[] = [];
    const translationBatch: any[] = [];
    const ayahIdMap = new Map<string, string>(); // Map to store ayah IDs for translations

    for (let i = 0; i < arabicData.data.surahs.length; i++) {
      const arabicSurah = arabicData.data.surahs[i];
      const englishSurah = englishData.data.surahs[i];
      const urduSurah = urduData.data.surahs[i];
      const hindiSurah = hindiData.data.surahs[i];

      for (let j = 0; j < arabicSurah.ayahs.length; j++) {
        const arabicAyah = arabicSurah.ayahs[j];
        const englishAyah = englishSurah.ayahs[j];
        const urduAyah = urduSurah.ayahs[j];
        const hindiAyah = hindiSurah.ayahs[j];

        // Create a unique key for this ayah
        const ayahKey = `${arabicSurah.number}-${arabicAyah.numberInSurah}`;

        ayahBatch.push({
          surahId: arabicSurah.number,
          ayahNumber: arabicAyah.numberInSurah,
          textArabic: arabicAyah.text,
          translationEn: englishAyah.text,
          audioUrl: `https://everyayah.com/data/Alafasy_128kbps/${String(arabicSurah.number).padStart(3, '0')}${String(arabicAyah.numberInSurah).padStart(3, '0')}.mp3`,
        });

        // We'll need to get the inserted IDs later for translations
        ayahIdMap.set(ayahKey, ''); // Placeholder
      }
    }

    // Insert ayahs in batches
    console.log(`🚀 Inserting ${ayahBatch.length} ayahs in batches...`);
    let insertedCount = 0;

    for (let i = 0; i < ayahBatch.length; i += BATCH_SIZE) {
      const batch = ayahBatch.slice(i, i + BATCH_SIZE);
      const inserted = await db.insert(ayahs).values(batch).returning();

      // Map inserted IDs
      inserted.forEach((ayah: any) => {
        const key = `${ayah.surahId}-${ayah.ayahNumber}`;
        ayahIdMap.set(key, ayah.id);
      });

      insertedCount += batch.length;
      if (insertedCount % 500 === 0) {
        console.log(`  Progress: ${insertedCount}/${ayahBatch.length} ayahs inserted...`);
      }
    }
    console.log(`✅ Inserted ${insertedCount} ayahs`);

    // Now prepare translations with the actual ayah IDs
    console.log("🌍 Preparing translations...");
    for (let i = 0; i < arabicData.data.surahs.length; i++) {
      const arabicSurah = arabicData.data.surahs[i];
      const englishSurah = englishData.data.surahs[i];
      const urduSurah = urduData.data.surahs[i];
      const hindiSurah = hindiData.data.surahs[i];

      for (let j = 0; j < arabicSurah.ayahs.length; j++) {
        const englishAyah = englishSurah.ayahs[j];
        const urduAyah = urduSurah.ayahs[j];
        const hindiAyah = hindiSurah.ayahs[j];

        const ayahKey = `${arabicSurah.number}-${arabicSurah.ayahs[j].numberInSurah}`;
        const ayahId = ayahIdMap.get(ayahKey);

        if (ayahId) {
          translationBatch.push(
            {
              ayahId,
              language: 'en' as const,
              text: englishAyah.text,
              translatorName: 'Sahih International',
            },
            {
              ayahId,
              language: 'ur' as const,
              text: urduAyah.text,
              translatorName: 'Ahmed Ali',
            },
            {
              ayahId,
              language: 'hi' as const,
              text: hindiAyah.text,
              translatorName: 'Muhammad Farooq Khan',
            }
          );
        }
      }
    }

    // Insert translations in batches
    console.log(`🚀 Inserting ${translationBatch.length} translations in batches...`);
    insertedCount = 0;

    for (let i = 0; i < translationBatch.length; i += BATCH_SIZE) {
      const batch = translationBatch.slice(i, i + BATCH_SIZE);
      await db.insert(ayahTranslations).values(batch);
      insertedCount += batch.length;
      if (insertedCount % 1000 === 0) {
        console.log(`  Progress: ${insertedCount}/${translationBatch.length} translations inserted...`);
      }
    }
    console.log(`✅ Inserted ${insertedCount} translations`);

    console.log("🎉 Quran seed completed successfully!");
    return { surahs: surahData.length, ayahs: ayahBatch.length, translations: translationBatch.length };
  } catch (error) {
    console.error("❌ Error seeding Quran:", error);
    throw error;
  }
}

async function fastSeedHadiths() {
  console.log("📿 Starting Hadith seed...");

  try {
    // Using hardcoded sample hadiths from well-known collections
    const sampleHadiths = [
      {
        book: 'Sahih al-Bukhari',
        chapter: 'Revelation',
        textArabic: 'إنما الأعمال بالنيات',
        translationEn: 'Actions are according to intentions, and everyone will get what was intended.',
        grade: 'Sahih' as const,
        narrator: 'Umar ibn al-Khattab',
        sourceUrl: 'https://sunnah.com/bukhari/1',
      },
      {
        book: 'Sahih Muslim',
        chapter: 'Faith',
        textArabic: 'من كان يؤمن بالله واليوم الآخر فليقل خيرا أو ليصمت',
        translationEn: 'Whoever believes in Allah and the Last Day should speak good or remain silent.',
        grade: 'Sahih' as const,
        narrator: 'Abu Hurairah',
        sourceUrl: 'https://sunnah.com/muslim/1',
      },
      {
        book: 'Sahih al-Bukhari',
        chapter: 'Knowledge',
        textArabic: 'طلب العلم فريضة على كل مسلم',
        translationEn: 'Seeking knowledge is an obligation upon every Muslim.',
        grade: 'Sahih' as const,
        narrator: 'Anas ibn Malik',
        sourceUrl: 'https://sunnah.com/bukhari/3',
      },
      {
        book: 'Sahih Muslim',
        chapter: 'Prayer',
        textArabic: 'الصلاة خير موضوع',
        translationEn: 'Prayer is the best act.',
        grade: 'Sahih' as const,
        narrator: 'Abdullah ibn Amr',
        sourceUrl: 'https://sunnah.com/muslim/5',
      },
      {
        book: 'Sunan Abu Dawud',
        chapter: 'Purification',
        textArabic: 'الطهور شطر الإيمان',
        translationEn: 'Cleanliness is half of faith.',
        grade: 'Sahih' as const,
        narrator: 'Abu Malik al-Ashari',
        sourceUrl: 'https://sunnah.com/abudawud',
      },
    ];

    // Clear existing (translations first due to foreign key constraint)
    console.log("🗑️  Clearing existing Hadith data...");
    await db.delete(hadithTranslations);
    await db.delete(hadith);

    // Insert sample hadiths
    await db.insert(hadith).values(sampleHadiths);
    console.log(`✅ Inserted ${sampleHadiths.length} sample hadiths`);

    console.log("🎉 Hadith seed completed!");
    return { count: sampleHadiths.length };
  } catch (error) {
    console.error("❌ Error seeding Hadiths:", error);
    throw error;
  }
}

async function main() {
  console.log("🚀 Starting FAST database seeding...\n");
  const startTime = Date.now();

  try {
    const quranResult = await fastSeedQuran();
    console.log(`\n📊 Quran: ${quranResult.surahs} surahs, ${quranResult.ayahs} ayahs, ${quranResult.translations} translations`);

    const hadithResult = await fastSeedHadiths();
    console.log(`\n📊 Hadiths: ${hadithResult.count} hadiths`);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✨ Complete seeding finished in ${duration} seconds!`);
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  }
}

export { main };