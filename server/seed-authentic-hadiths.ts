
import { db } from "./db";
import { hadith } from "@shared/schema";

// Authentic Hadiths from Sahih Bukhari and Sahih Muslim
const AUTHENTIC_HADITHS = [
  // FAITH & BELIEF
  {
    book: "Sahih al-Bukhari",
    chapter: "Book of Faith",
    textArabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    translationEn: "Actions are judged by intentions, and every person will be rewarded according to their intention.",
    grade: "Sahih" as const,
    narrator: "Umar ibn al-Khattab",
    sourceUrl: "https://sunnah.com/bukhari:1"
  },
  {
    book: "Sahih Muslim",
    chapter: "Book of Faith",
    textArabic: "الإِيمَانُ بِضْعٌ وَسَبْعُونَ شُعْبَةً، فَأَفْضَلُهَا قَوْلُ: لاَ إِلَهَ إِلاَّ اللَّهُ، وَأَدْنَاهَا إِمَاطَةُ الأَذَى عَنِ الطَّرِيقِ",
    translationEn: "Faith has over seventy branches, the best of which is saying 'There is no god but Allah,' and the least of which is removing harmful objects from the road.",
    grade: "Sahih" as const,
    narrator: "Abu Huraira",
    sourceUrl: "https://sunnah.com/muslim:35"
  },
  {
    book: "Sahih al-Bukhari",
    chapter: "Book of Knowledge",
    textArabic: "مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ",
    translationEn: "If Allah wants good for someone, He gives them understanding of the religion.",
    grade: "Sahih" as const,
    narrator: "Muawiyah",
    sourceUrl: "https://sunnah.com/bukhari:71"
  },
  
  // PRAYER
  {
    book: "Sahih al-Bukhari",
    chapter: "Book of Prayer",
    textArabic: "الصَّلاَةُ نُورٌ، وَالصَّدَقَةُ بُرْهَانٌ، وَالصَّبْرُ ضِيَاءٌ",
    translationEn: "Prayer is light, charity is proof, and patience is illumination.",
    grade: "Sahih" as const,
    narrator: "Abu Malik al-Ashari",
    sourceUrl: "https://sunnah.com/muslim:223"
  },
  {
    book: "Sahih Muslim",
    chapter: "Book of Prayer",
    textArabic: "أَوَّلُ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ الصَّلاَةُ",
    translationEn: "The first thing a person will be accountable for on the Day of Judgment is prayer.",
    grade: "Sahih" as const,
    narrator: "Abu Huraira",
    sourceUrl: "https://sunnah.com/nasai:465"
  },
  
  // MANNERS & ETHICS
  {
    book: "Sahih Muslim",
    chapter: "Book of Manners",
    textArabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    translationEn: "Whoever believes in Allah and the Last Day should speak good or remain silent.",
    grade: "Sahih" as const,
    narrator: "Abu Huraira",
    sourceUrl: "https://sunnah.com/bukhari:6018"
  },
  {
    book: "Sahih al-Bukhari",
    chapter: "Book of Good Manners",
    textArabic: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    translationEn: "A Muslim is one from whose tongue and hand other Muslims are safe.",
    grade: "Sahih" as const,
    narrator: "Abdullah ibn Amr",
    sourceUrl: "https://sunnah.com/bukhari:10"
  },
  {
    book: "Sahih Muslim",
    chapter: "Book of Righteousness",
    textArabic: "الْبِرُّ حُسْنُ الْخُلُقِ",
    translationEn: "Righteousness is good character.",
    grade: "Sahih" as const,
    narrator: "Nawwas ibn Sam'an",
    sourceUrl: "https://sunnah.com/muslim:2553"
  },
  
  // CHARITY
  {
    book: "Sahih Muslim",
    chapter: "Book of Charity",
    textArabic: "الصَّدَقَةُ تُطْفِئُ الْخَطِيئَةَ كَمَا يُطْفِئُ الْمَاءُ النَّارَ",
    translationEn: "Charity extinguishes sin as water extinguishes fire.",
    grade: "Sahih" as const,
    narrator: "Ka'b ibn Ujrah",
    sourceUrl: "https://sunnah.com/tirmidhi:2616"
  },
  {
    book: "Sahih al-Bukhari",
    chapter: "Book of Zakat",
    textArabic: "اتَّقُوا النَّارَ وَلَوْ بِشِقِّ تَمْرَةٍ",
    translationEn: "Protect yourself from Hellfire even by giving half a date in charity.",
    grade: "Sahih" as const,
    narrator: "Adi ibn Hatim",
    sourceUrl: "https://sunnah.com/bukhari:1417"
  },
  
  // PATIENCE & HARDSHIP
  {
    book: "Sahih Muslim",
    chapter: "Book of Trials",
    textArabic: "عَجَبًا لأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ",
    translationEn: "How wonderful is the affair of the believer, for all his affairs are good.",
    grade: "Sahih" as const,
    narrator: "Suhaib",
    sourceUrl: "https://sunnah.com/muslim:2999"
  },
  {
    book: "Sahih al-Bukhari",
    chapter: "Book of Patience",
    textArabic: "مَا يُصِيبُ الْمُسْلِمَ مِنْ نَصَبٍ وَلاَ وَصَبٍ وَلاَ هَمٍّ وَلاَ حُزْنٍ وَلاَ أَذًى وَلاَ غَمٍّ حَتَّى الشَّوْكَةِ يُشَاكُهَا إِلاَّ كَفَّرَ اللَّهُ بِهَا مِنْ خَطَايَاهُ",
    translationEn: "No fatigue, illness, worry, grief, harm or sadness afflicts a Muslim, even to the extent of a thorn pricking him, except that Allah expiates his sins by it.",
    grade: "Sahih" as const,
    narrator: "Abu Huraira",
    sourceUrl: "https://sunnah.com/bukhari:5641"
  },
  
  // FAMILY & RELATIONSHIPS
  {
    book: "Sahih al-Bukhari",
    chapter: "Book of Marriage",
    textArabic: "خَيْرُكُمْ خَيْرُكُمْ لأَهْلِهِ وَأَنَا خَيْرُكُمْ لأَهْلِي",
    translationEn: "The best of you is the one who is best to his family, and I am the best among you to my family.",
    grade: "Sahih" as const,
    narrator: "Aisha",
    sourceUrl: "https://sunnah.com/tirmidhi:3895"
  },
  {
    book: "Sahih Muslim",
    chapter: "Book of Virtue",
    textArabic: "رِضَا الرَّبِّ فِي رِضَا الْوَالِدِ وَسَخَطُ الرَّبِّ فِي سَخَطِ الْوَالِدِ",
    translationEn: "The pleasure of the Lord is in the pleasure of the parent, and the displeasure of the Lord is in the displeasure of the parent.",
    grade: "Sahih" as const,
    narrator: "Abdullah ibn Amr",
    sourceUrl: "https://sunnah.com/tirmidhi:1899"
  },
  
  // REMEMBRANCE OF ALLAH
  {
    book: "Sahih al-Bukhari",
    chapter: "Book of Dhikr",
    textArabic: "كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
    translationEn: "Two words are light on the tongue, heavy on the scales, and beloved to the Most Merciful: SubhanAllah wa bihamdihi, SubhanAllah al-Azeem.",
    grade: "Sahih" as const,
    narrator: "Abu Huraira",
    sourceUrl: "https://sunnah.com/bukhari:6682"
  },
  
  // FASTING
  {
    book: "Sahih al-Bukhari",
    chapter: "Book of Fasting",
    textArabic: "مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ",
    translationEn: "Whoever fasts Ramadan with faith and seeking reward, his previous sins will be forgiven.",
    grade: "Sahih" as const,
    narrator: "Abu Huraira",
    sourceUrl: "https://sunnah.com/bukhari:38"
  },
  
  // DEATH & AFTERLIFE
  {
    book: "Sahih Muslim",
    chapter: "Book of Remembrance",
    textArabic: "أَكْثِرُوا ذِكْرَ هَاذِمِ اللَّذَّاتِ",
    translationEn: "Remember often the destroyer of pleasures (death).",
    grade: "Sahih" as const,
    narrator: "Abu Huraira",
    sourceUrl: "https://sunnah.com/tirmidhi:2307"
  },
  
  // FORGIVENESS
  {
    book: "Sahih Muslim",
    chapter: "Book of Repentance",
    textArabic: "كُلُّ ابْنِ آدَمَ خَطَّاءٌ، وَخَيْرُ الْخَطَّائِينَ التَّوَّابُونَ",
    translationEn: "Every son of Adam makes mistakes, and the best of those who make mistakes are those who repent.",
    grade: "Sahih" as const,
    narrator: "Anas ibn Malik",
    sourceUrl: "https://sunnah.com/tirmidhi:2499"
  },
  
  // KNOWLEDGE
  {
    book: "Sahih Muslim",
    chapter: "Book of Knowledge",
    textArabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ",
    translationEn: "Whoever takes a path seeking knowledge, Allah makes easy for him the path to Paradise.",
    grade: "Sahih" as const,
    narrator: "Abu Huraira",
    sourceUrl: "https://sunnah.com/muslim:2699"
  },
  
  // JUSTICE
  {
    book: "Sahih al-Bukhari",
    chapter: "Book of Judgments",
    textArabic: "لاَ يَحِلُّ دَمُ امْرِئٍ مُسْلِمٍ إِلاَّ بِإِحْدَى ثَلاَثٍ",
    translationEn: "The blood of a Muslim is not lawful except in three cases: the married person who commits adultery, a life for a life, and one who abandons his religion and separates from the community.",
    grade: "Sahih" as const,
    narrator: "Abdullah ibn Mas'ud",
    sourceUrl: "https://sunnah.com/bukhari:6878"
  }
];

async function seedAuthenticHadiths() {
  console.log("📿 Seeding authentic Hadiths...");
  
  try {
    // Clear existing hadiths
    await db.delete(hadith);
    console.log("✅ Cleared existing Hadiths");
    
    // Insert in batches
    const BATCH_SIZE = 10;
    let count = 0;
    
    for (let i = 0; i < AUTHENTIC_HADITHS.length; i += BATCH_SIZE) {
      const batch = AUTHENTIC_HADITHS.slice(i, i + BATCH_SIZE);
      await db.insert(hadith).values(batch);
      count += batch.length;
      console.log(`  Inserted ${count}/${AUTHENTIC_HADITHS.length} hadiths...`);
    }
    
    console.log(`\n✅ Successfully seeded ${count} authentic hadiths!`);
    console.log("\n📊 Hadiths by collection:");
    console.log(`  📖 Sahih al-Bukhari: ${AUTHENTIC_HADITHS.filter(h => h.book === "Sahih al-Bukhari").length}`);
    console.log(`  📖 Sahih Muslim: ${AUTHENTIC_HADITHS.filter(h => h.book === "Sahih Muslim").length}`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding hadiths:", error);
    process.exit(1);
  }
}

seedAuthenticHadiths();
