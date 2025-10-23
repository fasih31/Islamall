import { db } from "./db";
import { surahs, ayahs, ayahTranslations, hadith, hadithTranslations, tafsir } from "@shared/schema";

const QURAN_API = "https://api.alquran.cloud/v1";
const QURANENC_API = "https://api.quranenc.com/api/v1";

// Authentic translations from reputable scholars
const AUTHENTIC_TRANSLATIONS = [
  // English
  { id: "en.sahih", lang: "en", scholar: "Sahih International" },
  { id: "en.pickthall", lang: "en", scholar: "Mohammed Marmaduke Pickthall" },
  { id: "en.yusufali", lang: "en", scholar: "Abdullah Yusuf Ali" },
  { id: "en.hilali", lang: "en", scholar: "Hilali & Khan" },
  { id: "en.asad", lang: "en", scholar: "Muhammad Asad" },
  
  // Urdu
  { id: "ur.maududi", lang: "ur", scholar: "Abul Ala Maududi" },
  { id: "ur.ahmedali", lang: "ur", scholar: "Ahmed Ali" },
  { id: "ur.jalandhry", lang: "ur", scholar: "Fateh Muhammad Jalandhry" },
  
  // Hindi
  { id: "hi.farooq", lang: "hi", scholar: "Muhammad Farooq Khan" },
  { id: "hi.hindi", lang: "hi", scholar: "Imam Ghulam Razavi" },
  
  // Arabic (Tafsir/Commentary)
  { id: "ar.jalalayn", lang: "ar", scholar: "Tafsir al-Jalalayn" },
  { id: "ar.muyassar", lang: "ar", scholar: "Al-Tafsir al-Muyassar" },
];

// Authentic Hadith collections
const HADITH_COLLECTIONS = [
  { slug: "bukhari", name: "Sahih al-Bukhari", arabicName: "صحيح البخاري" },
  { slug: "muslim", name: "Sahih Muslim", arabicName: "صحيح مسلم" },
  { slug: "abudawud", name: "Sunan Abi Dawud", arabicName: "سنن أبي داود" },
  { slug: "tirmidhi", name: "Jami` at-Tirmidhi", arabicName: "جامع الترمذي" },
  { slug: "nasai", name: "Sunan an-Nasa'i", arabicName: "سنن النسائي" },
  { slug: "ibnmajah", name: "Sunan Ibn Majah", arabicName: "سنن ابن ماجه" },
];

// Popular reciters for audio
const RECITER = "ar.alafasy"; // Mishary Rashid Alafasy - popular reciter

async function importAuthenticQuranTranslations() {
  console.log("📖 Importing complete Quran with authentic scholarly translations...\n");

  try {
    // Step 1: Get Arabic Quran with audio
    console.log("1️⃣  Fetching Arabic Quran with audio...");
    const arabicRes = await fetch(`${QURAN_API}/quran/${RECITER}`);
    const arabicData = await arabicRes.json();
    const arabicSurahs = arabicData.data.surahs;
    console.log(`✅ Fetched ${arabicSurahs.length} surahs with audio\n`);

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await db.delete(ayahTranslations);
    await db.delete(ayahs);
    await db.delete(surahs);
    
    // Step 2: Insert Surahs
    console.log("2️⃣  Inserting Surahs...");
    const surahData = arabicSurahs.map((surah: any) => ({
      id: surah.number,
      name: surah.englishName,
      nameArabic: surah.name,
      revelationPlace: surah.revelationType,
      totalAyahs: surah.numberOfAyahs || surah.ayahs?.length || 0,
    }));
    await db.insert(surahs).values(surahData);
    console.log(`✅ Inserted ${surahData.length} surahs\n`);

    // Step 3: Fetch all translations in parallel
    console.log("3️⃣  Fetching authentic translations from scholars...");
    const translationPromises = AUTHENTIC_TRANSLATIONS.map(async (trans) => {
      try {
        const res = await fetch(`${QURAN_API}/quran/${trans.id}`);
        if (!res.ok) {
          console.log(`  ⚠️  Skipping ${trans.scholar} (${trans.id}) - not available`);
          return null;
        }
        const data = await res.json();
        return { ...trans, data: data.data.surahs };
      } catch (err) {
        console.log(`  ⚠️  Error fetching ${trans.scholar}`);
        return null;
      }
    });

    const translationsData = (await Promise.all(translationPromises)).filter(Boolean);
    console.log(`✅ Successfully fetched ${translationsData.length} translations\n`);

    // Step 4: Insert Ayahs and Translations with Audio
    console.log("4️⃣  Inserting ayahs with audio and translations (this will take a few minutes)...");
    let ayahCount = 0;
    let translationCount = 0;
    const BATCH_SIZE = 100;

    for (let surahIndex = 0; surahIndex < arabicSurahs.length; surahIndex++) {
      const arabicSurah = arabicSurahs[surahIndex];
      const ayahBatch: any[] = [];
      const translationBatch: any[] = [];
      const ayahIdMap = new Map<number, string>();

      // Insert ayahs for this surah with audio URLs
      for (const arabicAyah of arabicSurah.ayahs) {
        ayahBatch.push({
          surahId: arabicSurah.number,
          ayahNumber: arabicAyah.numberInSurah,
          textArabic: arabicAyah.text,
          translationEn: translationsData.find(t => t?.lang === 'en')?.data[surahIndex]?.ayahs[arabicAyah.numberInSurah - 1]?.text || '',
          audioUrl: arabicAyah.audio || arabicAyah.audioSecondary?.[0] || null,
        });
      }

      // Batch insert ayahs
      for (let i = 0; i < ayahBatch.length; i += BATCH_SIZE) {
        const batch = ayahBatch.slice(i, i + BATCH_SIZE);
        const inserted = await db.insert(ayahs).values(batch).returning();
        inserted.forEach((ayah: any) => {
          ayahIdMap.set(ayah.ayahNumber, ayah.id);
        });
        ayahCount += batch.length;
      }

      // Prepare translations for this surah
      for (const translation of translationsData) {
        if (!translation) continue;
        const transSurah = translation.data[surahIndex];
        if (!transSurah) continue;

        for (const transAyah of transSurah.ayahs) {
          const ayahId = ayahIdMap.get(transAyah.numberInSurah);
          if (ayahId && transAyah.text) {
            translationBatch.push({
              ayahId,
              language: translation.lang as "en" | "ur" | "hi" | "ar",
              text: transAyah.text,
              translatorName: translation.scholar,
            });
          }
        }
      }

      // Batch insert translations
      for (let i = 0; i < translationBatch.length; i += BATCH_SIZE) {
        const batch = translationBatch.slice(i, i + BATCH_SIZE);
        await db.insert(ayahTranslations).values(batch);
        translationCount += batch.length;
      }

      if ((surahIndex + 1) % 10 === 0) {
        console.log(`  Progress: ${surahIndex + 1}/${arabicSurahs.length} surahs processed...`);
      }
    }

    console.log(`\n✅ Import complete!`);
    console.log(`   📚 ${arabicSurahs.length} surahs`);
    console.log(`   📝 ${ayahCount} ayahs with audio`);
    console.log(`   🌍 ${translationCount} authentic translations`);
    
    return { surahs: arabicSurahs.length, ayahs: ayahCount, translations: translationCount };
  } catch (error) {
    console.error("❌ Error importing Quran:", error);
    throw error;
  }
}

async function importAuthenticHadiths() {
  console.log("\n📿 Importing ALL authentic Hadith collections with scholarly translations...\n");

  try {
    // Clear existing
    await db.delete(hadithTranslations);
    await db.delete(hadith);

    let totalHadiths = 0;

    for (const collection of HADITH_COLLECTIONS) {
      console.log(`📖 Importing ${collection.name}...`);
      
      try {
        // Fetch Arabic hadiths - NO LIMIT, get ALL
        const arabicUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-${collection.slug}.json`;
        const arabicRes = await fetch(arabicUrl);
        
        if (!arabicRes.ok) {
          console.log(`  ⚠️  Skipping - not available`);
          continue;
        }

        const arabicData = await arabicRes.json();
        const arabicHadiths = arabicData.hadiths || []; // Get ALL hadiths, no slice

        // Fetch English translation
        const englishUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-${collection.slug}.json`;
        const englishRes = await fetch(englishUrl);
        const englishData = englishRes.ok ? await englishRes.json() : null;
        const englishHadiths = englishData?.hadiths || [];

        // Fetch Urdu translation if available
        const urduUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/urd-${collection.slug}.json`;
        const urduRes = await fetch(urduUrl);
        const urduData = urduRes.ok ? await urduRes.json() : null;
        const urduHadiths = urduData?.hadiths || [];

        console.log(`  📊 Found ${arabicHadiths.length} hadiths in ${collection.name}`);

        const batch: any[] = [];
        const BATCH_SIZE = 100;

        for (let i = 0; i < arabicHadiths.length; i++) {
          const arabicHadith = arabicHadiths[i];
          const englishHadith = englishHadiths[i];
          const urduHadith = urduHadiths[i];

          // Determine grade
          let grade: "Sahih" | "Hasan" | "Daif" = "Sahih";
          if (collection.slug === "bukhari" || collection.slug === "muslim") {
            grade = "Sahih";
          } else if (collection.slug === "tirmidhi") {
            grade = "Hasan";
          }

          batch.push({
            book: collection.arabicName,
            chapter: arabicHadith.chapterName || arabicHadith.chapter || "General",
            textArabic: arabicHadith.text || "",
            translationEn: englishHadith?.text || arabicHadith.text || "",
            grade,
            narrator: arabicHadith.attribution || "Sahabi",
            sourceUrl: `https://sunnah.com/${collection.slug}/${arabicHadith.hadithNumber || i + 1}`,
          });

          // Insert in batches
          if (batch.length >= BATCH_SIZE) {
            await db.insert(hadith).values(batch);
            totalHadiths += batch.length;
            batch.length = 0; // Clear batch
          }
        }

        // Insert remaining batch
        if (batch.length > 0) {
          await db.insert(hadith).values(batch);
          totalHadiths += batch.length;
        }

        console.log(`  ✅ Imported ${arabicHadiths.length} hadiths from ${collection.name}`);
      } catch (err) {
        console.error(`  ❌ Error with ${collection.name}:`, err);
      }
    }

    console.log(`\n✅ Hadith import complete! Total: ${totalHadiths} hadiths`);
    return { count: totalHadiths };
  } catch (error) {
    console.error("❌ Error importing Hadiths:", error);
    throw error;
  }
}

async function main() {
  console.log("🚀 Starting import of authentic Islamic texts...\n");
  console.log("━".repeat(60));
  const startTime = Date.now();

  try {
    const quranResult = await importAuthenticQuranTranslations();
    const hadithResult = await importAuthenticHadiths();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log("\n" + "━".repeat(60));
    console.log("🎉 Import completed successfully!");
    console.log(`⏱️  Time taken: ${duration} seconds`);
    console.log("\n📊 Summary:");
    console.log(`   📚 Quran: ${quranResult.surahs} surahs, ${quranResult.ayahs} ayahs`);
    console.log(`   🎵 Audio: Authentic recitation by Mishary Rashid Alafasy`);
    console.log(`   🌍 Translations: ${quranResult.translations} from authentic scholars`);
    console.log(`   📿 Hadiths: ${hadithResult.count} from all major collections`);
    console.log("━".repeat(60));
    
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Import failed:", error);
    process.exit(1);
  }
}

export { main };
