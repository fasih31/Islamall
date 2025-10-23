// Script to seed database with initial Islamic content
import { db } from "./db";
import { 
  surahs, ayahs, hadith, financeArticles, duas,
  reciters, ayahTranslations, hadithTranslations, ayahRecitations
} from "@shared/schema";

async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  try {
    // Seed Surahs (First 5 surahs as example)
    console.log("📖 Seeding Surahs...");
    const surahsData = [
      {
        id: 1,
        name: "Al-Fatihah (The Opening)",
        nameArabic: "الفاتحة",
        revelationPlace: "Mecca",
        totalAyahs: 7,
      },
      {
        id: 2,
        name: "Al-Baqarah (The Cow)",
        nameArabic: "البقرة",
        revelationPlace: "Medina",
        totalAyahs: 286,
      },
      {
        id: 3,
        name: "Ali 'Imran (Family of Imran)",
        nameArabic: "آل عمران",
        revelationPlace: "Medina",
        totalAyahs: 200,
      },
      {
        id: 4,
        name: "An-Nisa (The Women)",
        nameArabic: "النساء",
        revelationPlace: "Medina",
        totalAyahs: 176,
      },
      {
        id: 5,
        name: "Al-Ma'idah (The Table Spread)",
        nameArabic: "المائدة",
        revelationPlace: "Medina",
        totalAyahs: 120,
      },
    ];

    await db.insert(surahs).values(surahsData).onConflictDoNothing();

    // Seed Ayahs (Surah Al-Fatihah as example)
    console.log("📝 Seeding Ayahs...");
    const ayahsData = [
      {
        surahId: 1,
        ayahNumber: 1,
        textArabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        translationEn: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
      },
      {
        surahId: 1,
        ayahNumber: 2,
        textArabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        translationEn: "[All] praise is [due] to Allah, Lord of the worlds -",
      },
      {
        surahId: 1,
        ayahNumber: 3,
        textArabic: "الرَّحْمَٰنِ الرَّحِيمِ",
        translationEn: "The Entirely Merciful, the Especially Merciful,",
      },
      {
        surahId: 1,
        ayahNumber: 4,
        textArabic: "مَالِكِ يَوْمِ الدِّينِ",
        translationEn: "Sovereign of the Day of Recompense.",
      },
      {
        surahId: 1,
        ayahNumber: 5,
        textArabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        translationEn: "It is You we worship and You we ask for help.",
      },
      {
        surahId: 1,
        ayahNumber: 6,
        textArabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        translationEn: "Guide us to the straight path -",
      },
      {
        surahId: 1,
        ayahNumber: 7,
        textArabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        translationEn: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.",
      },
    ];

    await db.insert(ayahs).values(ayahsData).onConflictDoNothing();

    // Seed Hadith
    console.log("📚 Seeding Hadith...");
    const hadithData = [
      {
        book: "Sahih Bukhari",
        chapter: "Book of Faith",
        textArabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
        translationEn: "Actions are judged by intentions, so each man will have what he intended.",
        narrator: "Umar ibn Al-Khattab",
        grade: "Sahih" as const,
      },
      {
        book: "Sahih Muslim",
        chapter: "Book of Manners",
        textArabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
        translationEn: "Whoever believes in Allah and the Last Day should speak good or remain silent.",
        narrator: "Abu Hurairah",
        grade: "Sahih" as const,
      },
      {
        book: "Sahih Bukhari",
        chapter: "Book of Faith",
        textArabic: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
        translationEn: "A Muslim is the one from whose tongue and hand the Muslims are safe.",
        narrator: "Abdullah ibn Amr",
        grade: "Sahih" as const,
      },
    ];

    await db.insert(hadith).values(hadithData).onConflictDoNothing();

    // Seed Finance Articles
    console.log("💰 Seeding Finance Articles...");
    const financeData = [
      {
        id: "finance-1",
        title: "Understanding Zakat: The Third Pillar of Islam",
        category: "Zakat",
        content: "Zakat is one of the Five Pillars of Islam and represents the obligation to give a portion of one's wealth to those in need. It is calculated at 2.5% of one's surplus wealth held for a lunar year. This includes cash, gold, silver, business assets, and investments. Zakat purifies wealth and helps establish social equity in the Muslim community.",
      },
      {
        id: "finance-2",
        title: "Halal Investment Principles",
        category: "Investment",
        content: "Islamic finance prohibits investments in businesses involved in alcohol, gambling, pork products, conventional banking, and other haram activities. Halal investments focus on ethical business practices, avoiding interest (riba), and sharing profits and losses fairly. Popular halal investment options include Islamic mutual funds, sukuk (Islamic bonds), and Sharia-compliant stocks.",
      },
      {
        id: "finance-3",
        title: "Islamic Banking vs Conventional Banking",
        category: "Banking",
        content: "Islamic banking operates on the principles of profit-sharing and risk-sharing, avoiding interest (riba). Instead of charging interest on loans, Islamic banks use contracts like Murabaha (cost-plus financing), Musharaka (partnership), and Ijarah (leasing). The focus is on asset-backed financing and ethical investments that comply with Sharia law.",
      },
    ];

    await db.insert(financeArticles).values(financeData).onConflictDoNothing();

    // Seed Duas
    console.log("🤲 Seeding Duas...");
    const duasData = [
      {
        category: "Morning",
        textArabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
        translationEn: "We have entered a new day and with it all dominion is Allah's.",
        transliteration: "Asbahna wa asbahal mulku lillah",
      },
      {
        category: "Evening",
        textArabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ",
        translationEn: "We have entered the evening and with it all dominion is Allah's.",
        transliteration: "Amsayna wa amsal mulku lillah",
      },
      {
        category: "Before Eating",
        textArabic: "بِسْمِ اللهِ",
        translationEn: "In the name of Allah",
        transliteration: "Bismillah",
      },
      {
        category: "After Eating",
        textArabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا",
        translationEn: "All praise is due to Allah who gave us food and drink.",
        transliteration: "Alhamdulillahil-lathee at'amana wa saqana",
      },
      {
        category: "Travel",
        textArabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا",
        translationEn: "Glory to Him Who has subjected this to us, and we could never have accomplished this by ourselves.",
        transliteration: "Subhanal-lathee sakhkhara lana hadha",
      },
    ];

    await db.insert(duas).values(duasData).onConflictDoNothing();

    // Seed Reciters
    console.log("🎙️ Seeding Reciters...");
    const recitersData = [
      {
        name: "Mishary Rashid Alafasy",
        nameArabic: "مشاري بن راشد العفاسي",
        identifier: "mishary_rashid" as const,
        bio: "Kuwaiti Quran reciter, imam, and preacher known for his beautiful recitation",
      },
      {
        name: "Abdul Basit Abdul Samad",
        nameArabic: "عبد الباسط عبد الصمد",
        identifier: "abdul_basit" as const,
        bio: "Egyptian Quran reciter, considered one of the greatest reciters in history",
      },
      {
        name: "Abdulrahman Al-Sudais",
        nameArabic: "عبد الرحمن السديس",
        identifier: "abdulrahman_sudais" as const,
        bio: "Saudi Imam of the Grand Mosque in Mecca, known for his melodious recitation",
      },
      {
        name: "Saad Al-Ghamdi",
        nameArabic: "سعد الغامدي",
        identifier: "saad_al_ghamdi" as const,
        bio: "Saudi Quran reciter with a distinctive and emotional voice",
      },
      {
        name: "Maher Al-Muaiqly",
        nameArabic: "ماهر المعيقلي",
        identifier: "maher_al_muaiqly" as const,
        bio: "Saudi Imam of the Grand Mosque in Mecca with a beautiful recitation",
      },
    ];

    await db.insert(reciters).values(recitersData).onConflictDoNothing();

    // Get the seeded ayahs to add translations
    console.log("🌐 Seeding Ayah Translations...");
    const seededAyahs = await db.select().from(ayahs);
    
    const ayahTranslationsData = [];
    for (const ayah of seededAyahs.slice(0, 7)) {
      const urduTranslations: Record<number, string> = {
        1: "اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے",
        2: "تمام تعریفیں اللہ ہی کے لیے ہیں جو تمام جہانوں کا پروردگار ہے",
        3: "بڑا مہربان نہایت رحم والا",
        4: "روزِ جزا کا مالک",
        5: "ہم تیری ہی عبادت کرتے ہیں اور تجھ ہی سے مدد مانگتے ہیں",
        6: "ہمیں سیدھے راستے کی ہدایت دے",
        7: "اُن لوگوں کے راستے کی جن پر تو نے انعام فرمایا، جن پر غضب نازل نہیں ہوا اور نہ وہ گمراہ ہوئے",
      };

      const hindiTranslations: Record<number, string> = {
        1: "अल्लाह के नाम से जो बड़ा मेहरबान और रहीम है",
        2: "सारी तारीफें अल्लाह के लिए हैं जो तमाम जहानों का रब है",
        3: "बड़ा मेहरबान, रहीम",
        4: "रोज़-ए-जज़ा का मालिक",
        5: "हम तेरी ही इबादत करते हैं और तुझी से मदद मांगते हैं",
        6: "हमें सीधे रास्ते की हिदायत दे",
        7: "उन लोगों के रास्ते की जिन पर तूने इनाम किया, जिन पर गज़ब नाज़िल नहीं हुआ और न वो गुमराह हुए",
      };

      if (urduTranslations[ayah.ayahNumber]) {
        ayahTranslationsData.push({
          ayahId: ayah.id,
          language: "ur" as const,
          text: urduTranslations[ayah.ayahNumber],
          translatorName: "Maulana Fateh Muhammad Jalandhari",
        });
      }

      if (hindiTranslations[ayah.ayahNumber]) {
        ayahTranslationsData.push({
          ayahId: ayah.id,
          language: "hi" as const,
          text: hindiTranslations[ayah.ayahNumber],
          translatorName: "Maulana Farooq Khan & Ahmed Raza Khan",
        });
      }
    }

    if (ayahTranslationsData.length > 0) {
      await db.insert(ayahTranslations).values(ayahTranslationsData).onConflictDoNothing();
    }

    // Seed Hadith Translations
    console.log("📚 Seeding Hadith Translations...");
    const seededHadith = await db.select().from(hadith);
    
    const hadithTranslationsData = [];
    for (const h of seededHadith.slice(0, 3)) {
      const urduMap: Record<string, string> = {
        "من كان يؤمن بالله واليوم الآخر فليقل خيرا أو ليصمت": "جو شخص اللہ اور آخرت کے دن پر ایمان رکھتا ہے وہ اچھی بات کہے یا خاموش رہے",
        "المسلم من سلم المسلمون من لسانه ويده": "مسلمان وہ ہے جس کی زبان اور ہاتھ سے دوسرے مسلمان محفوظ رہیں",
        "Whoever believes": "جو شخص اللہ اور آخرت کے دن پر ایمان رکھتا ہے",
      };

      const hindiMap: Record<string, string> = {
        "من كان يؤمن بالله واليوم الآخر فليقل خيرا أو ليصمت": "जो व्यक्ति अल्लाह और आखिरत के दिन पर ईमान रखता है वह अच्छी बात कहे या चुप रहे",
        "المسلم من سلم المسلمون من لسانه ويده": "मुस्लिम वह है जिसकी जुबान और हाथ से दूसरे मुस्लिम महफूज़ रहें",
        "Whoever believes": "जो व्यक्ति अल्लाह और आखिरत के दिन पर ईमान रखता है",
      };

      const urduText = urduMap[h.textArabic] || urduMap["Whoever believes"];
      const hindiText = hindiMap[h.textArabic] || hindiMap["Whoever believes"];

      hadithTranslationsData.push({
        hadithId: h.id,
        language: "ur" as const,
        text: urduText,
        translatorName: "Maulana Muhammad Dawood Raaz",
      });

      hadithTranslationsData.push({
        hadithId: h.id,
        language: "hi" as const,
        text: hindiText,
        translatorName: "Maulana Waheed Zaman",
      });
    }

    if (hadithTranslationsData.length > 0) {
      await db.insert(hadithTranslations).values(hadithTranslationsData).onConflictDoNothing();
    }

    console.log("✅ Database seeding completed successfully!");
    console.log(`
    Seeded:
    - ${surahsData.length} Surahs
    - ${ayahsData.length} Ayahs (Surah Al-Fatihah)
    - ${ayahTranslationsData.length} Ayah Translations (Urdu, Hindi)
    - ${hadithData.length} Hadith
    - ${hadithTranslationsData.length} Hadith Translations (Urdu, Hindi)
    - ${recitersData.length} Reciters
    - ${financeData.length} Finance Articles
    - ${duasData.length} Duas
    `);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
