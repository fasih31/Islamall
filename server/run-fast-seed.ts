
import { db } from "./db";
import { surahs, ayahs, hadith } from "@shared/schema";

// Minimal authentic Quran data (first 3 surahs for quick testing)
const QURAN_DATA = [
  {
    id: 1,
    name: "Al-Fatihah",
    nameArabic: "الفاتحة",
    revelationPlace: "Makkah",
    totalAyahs: 7,
    ayahs: [
      { text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
      { text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", translation: "All praise is due to Allah, Lord of the worlds." },
      { text: "الرَّحْمَٰنِ الرَّحِيمِ", translation: "The Entirely Merciful, the Especially Merciful." },
      { text: "مَالِكِ يَوْمِ الدِّينِ", translation: "Sovereign of the Day of Recompense." },
      { text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", translation: "It is You we worship and You we ask for help." },
      { text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", translation: "Guide us to the straight path." },
      { text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", translation: "The path of those upon whom You have bestowed favor, not of those who have earned [Your] anger or of those who are astray." }
    ]
  },
  {
    id: 2,
    name: "Al-Baqarah",
    nameArabic: "البقرة",
    revelationPlace: "Madinah",
    totalAyahs: 10,
    ayahs: [
      { text: "الم", translation: "Alif, Lam, Meem." },
      { text: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ", translation: "This is the Book about which there is no doubt, a guidance for those conscious of Allah." },
      { text: "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ", translation: "Who believe in the unseen, establish prayer, and spend out of what We have provided for them." },
      { text: "وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ", translation: "And who believe in what has been revealed to you, [O Muhammad], and what was revealed before you, and of the Hereafter they are certain [in faith]." },
      { text: "أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ", translation: "Those are upon [right] guidance from their Lord, and it is those who are the successful." },
      { text: "إِنَّ الَّذِينَ كَفَرُوا سَوَاءٌ عَلَيْهِم أَأَنذَرْتَهُمْ أَمْ لَمْ تُنذِرْهُمْ لَا يُؤْمِنُونَ", translation: "Indeed, those who disbelieve - it is all the same for them whether you warn them or do not warn them - they will not believe." },
      { text: "خَتَمَ اللَّهُ عَلَىٰ قُلُوبِهِمْ وَعَلَىٰ سَمْعِهِمْ ۖ وَعَلَىٰ أَبْصَارِهِمْ غِشَاوَةٌ ۖ وَلَهُمْ عَذَابٌ عَظِيمٌ", translation: "Allah has set a seal upon their hearts and upon their hearing, and over their vision is a veil. And for them is a great punishment." },
      { text: "وَمِنَ النَّاسِ مَن يَقُولُ آمَنَّا بِاللَّهِ وَبِالْيَوْمِ الْآخِرِ وَمَا هُم بِمُؤْمِنِينَ", translation: "And of the people are some who say, 'We believe in Allah and the Last Day,' but they are not believers." },
      { text: "يُخَادِعُونَ اللَّهَ وَالَّذِينَ آمَنُوا وَمَا يَخْدَعُونَ إِلَّا أَنفُسَهُمْ وَمَا يَشْعُرُونَ", translation: "They [think to] deceive Allah and those who believe, but they deceive not except themselves and perceive [it] not." },
      { text: "فِي قُلُوبِهِم مَّرَضٌ فَزَادَهُمُ اللَّهُ مَرَضًا ۖ وَلَهُمْ عَذَابٌ أَلِيمٌ بِمَا كَانُوا يَكْذِبُونَ", translation: "In their hearts is disease, so Allah has increased their disease; and for them is a painful punishment because they [habitually] used to lie." }
    ]
  },
  {
    id: 112,
    name: "Al-Ikhlas",
    nameArabic: "الإخلاص",
    revelationPlace: "Makkah",
    totalAyahs: 4,
    ayahs: [
      { text: "قُلْ هُوَ اللَّهُ أَحَدٌ", translation: "Say, 'He is Allah, [who is] One.'" },
      { text: "اللَّهُ الصَّمَدُ", translation: "Allah, the Eternal Refuge." },
      { text: "لَمْ يَلِدْ وَلَمْ يُولَدْ", translation: "He neither begets nor is born." },
      { text: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", translation: "Nor is there to Him any equivalent." }
    ]
  }
];

// Expanded authentic Hadith data
const HADITH_DATA = [
  {
    book: "Sahih al-Bukhari",
    chapter: "Book of Faith",
    textArabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
    translationEn: "Actions are according to intentions, and everyone will get what was intended.",
    grade: "Sahih" as const,
    narrator: "Umar ibn al-Khattab",
  },
  {
    book: "Sahih Muslim",
    chapter: "Book of Faith",
    textArabic: "الإِيمَانُ بِضْعٌ وَسَبْعُونَ شُعْبَةً",
    translationEn: "Faith has over seventy branches, the best of which is saying 'There is no god but Allah,' and the least of which is removing harmful objects from the road.",
    grade: "Sahih" as const,
    narrator: "Abu Huraira",
  },
  {
    book: "Sahih al-Bukhari",
    chapter: "Book of Knowledge",
    textArabic: "مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ",
    translationEn: "If Allah wants good for someone, He gives them understanding of the religion.",
    grade: "Sahih" as const,
    narrator: "Muawiyah",
  },
  {
    book: "Sahih Muslim",
    chapter: "Book of Manners",
    textArabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    translationEn: "Whoever believes in Allah and the Last Day should speak good or remain silent.",
    grade: "Sahih" as const,
    narrator: "Abu Hurairah",
  },
  {
    book: "Sahih al-Bukhari",
    chapter: "Book of Prayer",
    textArabic: "الصَّلَاةُ عِمَادُ الدِّينِ",
    translationEn: "Prayer is the pillar of religion.",
    grade: "Sahih" as const,
    narrator: "Ibn Umar",
  },
  {
    book: "Sahih Muslim",
    chapter: "Book of Charity",
    textArabic: "الصَّدَقَةُ تُطْفِئُ الْخَطِيئَةَ كَمَا يُطْفِئُ الْمَاءُ النَّارَ",
    translationEn: "Charity extinguishes sin as water extinguishes fire.",
    grade: "Sahih" as const,
    narrator: "Ka'b ibn Ujrah",
  },
  {
    book: "Sahih al-Bukhari",
    chapter: "Book of Manners",
    textArabic: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    translationEn: "A Muslim is one from whose tongue and hand other Muslims are safe.",
    grade: "Sahih" as const,
    narrator: "Abdullah ibn Amr",
  },
  {
    book: "Sahih Muslim",
    chapter: "Book of Righteousness",
    textArabic: "الْبِرُّ حُسْنُ الْخُلُقِ",
    translationEn: "Righteousness is good character.",
    grade: "Sahih" as const,
    narrator: "Nawwas ibn Sam'an",
  }
];

async function fastSeed() {
  console.log("🌱 Starting fast seed...");

  try {
    // Clear existing data
    console.log("🗑️  Clearing existing Quran data...");
    await db.delete(ayahs);
    await db.delete(surahs);
    console.log("✅ Cleared existing Quran data");

    // Insert Surahs and Ayahs with proper audio URLs
    for (const surahData of QURAN_DATA) {
      await db.insert(surahs).values({
        id: surahData.id,
        name: surahData.name,
        nameArabic: surahData.nameArabic,
        revelationPlace: surahData.revelationPlace,
        totalAyahs: surahData.totalAyahs,
      });

      for (let i = 0; i < surahData.ayahs.length; i++) {
        const ayahData = surahData.ayahs[i];
        const paddedSurah = String(surahData.id).padStart(3, '0');
        const paddedAyah = String(i + 1).padStart(3, '0');
        
        // Use reliable audio source
        const audioUrl = `https://everyayah.com/data/Alafasy_128kbps/${paddedSurah}${paddedAyah}.mp3`;
        
        await db.insert(ayahs).values({
          surahId: surahData.id,
          ayahNumber: i + 1,
          textArabic: ayahData.text,
          translationEn: ayahData.translation,
          audioUrl: audioUrl,
        });
        
        console.log(`  ✅ Ayah ${i + 1}: ${audioUrl}`);
      }
      console.log(`✅ Inserted Surah ${surahData.name} with ${surahData.ayahs.length} ayahs`);
    }

    // Clear and insert Hadith data
    console.log("🗑️  Clearing existing Hadith data...");
    await db.delete(hadith);
    console.log("✅ Cleared existing Hadith data");

    for (const hadithData of HADITH_DATA) {
      await db.insert(hadith).values(hadithData);
    }
    console.log(`✅ Inserted ${HADITH_DATA.length} hadiths`);

    console.log("✅ Fast seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}

fastSeed()
  .then(() => {
    console.log("🎉 Database seeded!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  });
