import { db } from "./db";
import { duas } from "@shared/schema";

const DUAS_DATA = [
  // Morning Duas
  {
    category: "morning",
    textArabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    translationEn: "We have entered a new day and with it all the dominion which belongs to Allah. Praise is to Allah. There is no god but Allah alone, Who has no partner. To Allah belongs the dominion, and to Him is the praise and He is powerful over everything.",
    transliteration: "Asbahna wa-asbahal-mulku lillah walhamdu lillah la ilaha illal-lahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa Huwa 'ala kulli shay'in Qadir",
    reference: "Muslim 4:2088"
  },
  {
    category: "morning",
    textArabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
    translationEn: "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.",
    transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu, wa ilayka an-nushur",
    reference: "Tirmidhi 5:466"
  },
  // Evening Duas
  {
    category: "evening",
    textArabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
    translationEn: "We have entered the evening and with it all the dominion which belongs to Allah. Praise is to Allah. There is no god but Allah alone, Who has no partner.",
    transliteration: "Amsayna wa-amsal-mulku lillah walhamdu lillah la ilaha illal-lahu wahdahu la sharika lah",
    reference: "Muslim 4:2088"
  },
  // Protection (Ruqyah)
  {
    category: "protection",
    textArabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    translationEn: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
    transliteration: "A'udhu bikalimatil-lahit-tammati min sharri ma khalaq",
    reference: "Muslim 4:2080"
  },
  {
    category: "protection",
    textArabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    translationEn: "In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
    transliteration: "Bismillahil-ladhi la yadurru ma'as-mihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Alim",
    reference: "Abu Dawud 4:323"
  },
  // Healing (Manzil)
  {
    category: "healing",
    textArabic: "اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَأْسَ، اشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا",
    translationEn: "O Allah, Lord of mankind, remove the harm and heal, You are the Healer. There is no healing except Your healing, a healing which leaves no disease.",
    transliteration: "Allahumma Rabban-nas, adhhibil-ba's, ishfi Antash-Shafi, la shifa'a illa shifa'uka, shifaan la yughadiru saqama",
    reference: "Bukhari 7:5675"
  },
  // Travel
  {
    category: "travel",
    textArabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    translationEn: "Glory be to Him who has subjected this to us, and we could never have it (by our efforts). And verily, to Our Lord we indeed are to return!",
    transliteration: "Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin. Wa inna ila Rabbina lamunqalibun",
    reference: "Surah Az-Zukhruf 43:13-14"
  },
  // Food
  {
    category: "food",
    textArabic: "بِسْمِ اللَّهِ",
    translationEn: "In the name of Allah.",
    transliteration: "Bismillah",
    reference: "General Sunnah"
  },
  {
    category: "food",
    textArabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    translationEn: "Praise be to Allah Who has fed us and given us drink and made us Muslims.",
    transliteration: "Alhamdu lillahil-ladhi at'amana wa saqana wa ja'alana Muslimin",
    reference: "Abu Dawud 4:3850"
  },
  // Daily
  {
    category: "daily",
    textArabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    translationEn: "Glory be to Allah and praise Him.",
    transliteration: "Subhanallahi wa bihamdihi",
    reference: "Bukhari 7:6682"
  },
  {
    category: "daily",
    textArabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    translationEn: "There is no god but Allah alone, with no partner. His is the dominion and His is the praise, and He has power over all things.",
    transliteration: "La ilaha illallahu wahdahu la sharika lahu, lahul-mulku wa lahul-hamdu wa Huwa 'ala kulli shay'in Qadir",
    reference: "Bukhari 7:6404"
  },
  // Gratitude
  {
    category: "gratitude",
    textArabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    translationEn: "All praise is due to Allah, Lord of all the worlds.",
    transliteration: "Alhamdu lillahi Rabbil-'alamin",
    reference: "Quran 1:2"
  },
  // Knowledge
  {
    category: "knowledge",
    textArabic: "رَبِّ زِدْنِي عِلْمًا",
    translationEn: "My Lord, increase me in knowledge.",
    transliteration: "Rabbi zidni 'ilma",
    reference: "Quran 20:114"
  },
  // Sleep
  {
    category: "sleep",
    textArabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    translationEn: "In Your name O Allah, I die and I live.",
    transliteration: "Bismika Allahumma amutu wa ahya",
    reference: "Bukhari 7:6324"
  },
  // Occasions - Ramadan
  {
    category: "occasions",
    textArabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    translationEn: "O Allah, You are Pardoning and You love to pardon, so pardon me.",
    transliteration: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni",
    reference: "Tirmidhi 3:3513 (Laylatul Qadr)"
  },
  // Forgiveness
  {
    category: "forgiveness",
    textArabic: "رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
    translationEn: "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.",
    transliteration: "Rabbana zalamna anfusana wa in lam taghfir lana wa tarhamna lanakūnanna minal-khasireen",
    reference: "Quran 7:23"
  },
  // Prayer
  {
    category: "prayer",
    textArabic: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
    translationEn: "O Allah, help me to remember You, to give thanks to You, and to worship You in the best manner.",
    transliteration: "Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik",
    reference: "Abu Dawud 2:1522"
  }
];

async function seedDuas() {
  console.log("🌙 Seeding Duas...");
  
  try {
    for (const dua of DUAS_DATA) {
      await db.insert(duas).values(dua).onConflictDoNothing();
    }
    
    console.log("✅ Successfully seeded", DUAS_DATA.length, "duas");
    console.log("Categories:", [...new Set(DUAS_DATA.map(d => d.category))].join(", "));
  } catch (error) {
    console.error("❌ Error seeding duas:", error);
    throw error;
  }
}

seedDuas()
  .then(() => {
    console.log("🎉 Dua seeding completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Dua seeding failed:", error);
    process.exit(1);
  });
