import { db } from "./db";
import { books } from "@shared/schema";

const AUTHENTIC_BOOKS = [
  // Islamic Finance & Economics
  {
    title: "Introduction to Islamic Finance",
    titleArabic: "مقدمة في التمويل الإسلامي",
    author: "Mufti Taqi Usmani",
    authorArabic: "مفتي تقي عثماني",
    category: "finance" as const,
    description: "Core modern reference for Sharia-compliant banking and Islamic financial principles. Essential reading for understanding halal investment, riba-free transactions, and ethical finance.",
    language: "English, Urdu",
    isFeatured: true,
    purchaseUrl: "https://www.amazon.com/Introduction-Islamic-Finance-Taqi-Usmani/dp/9699988005"
  },
  {
    title: "Kitab al-Kharaj",
    titleArabic: "كتاب الخراج",
    author: "Abu Yusuf",
    authorArabic: "أبو يوسف",
    category: "finance" as const,
    description: "One of the earliest works on Islamic taxation, finance, and governance. A classical foundation text by the student of Imam Abu Hanifa.",
    language: "Arabic, English",
    isFeatured: true,
  },
  {
    title: "Fiqh al-Muamalat",
    titleArabic: "فقه المعاملات",
    author: "Dr. Wahbah al-Zuhayli",
    authorArabic: "د. وهبة الزحيلي",
    category: "finance" as const,
    description: "Comprehensive guide to Islamic transactions, contracts, and business ethics according to Sharia principles.",
    language: "Arabic, English",
    isFeatured: false,
  },

  // Islamic Politics & Governance
  {
    title: "Al-Ahkam al-Sultaniyyah",
    titleArabic: "الأحكام السلطانية",
    author: "Imam al-Mawardi",
    authorArabic: "الإمام الماوردي",
    category: "politics" as const,
    description: "The Constitution of Islamic governance and state policy. A foundational text on political thought and administration in Islam.",
    language: "Arabic, English",
    isFeatured: true,
  },
  {
    title: "The Islamic Way of Life",
    titleArabic: "الإسلام كنظام حياة",
    author: "Abul A'la Maududi",
    authorArabic: "أبو الأعلى المودودي",
    category: "politics" as const,
    description: "Comprehensive framework for understanding Islam as a complete system covering all aspects of life including governance, economy, and society.",
    language: "English, Urdu",
    isFeatured: true,
  },
  {
    title: "The Reconstruction of Religious Thought in Islam",
    titleArabic: "إعادة بناء الفكر الديني في الإسلام",
    author: "Allama Muhammad Iqbal",
    authorArabic: "علامة محمد إقبال",
    category: "politics" as const,
    description: "Iqbal's philosophical masterpiece addressing the reconstruction of Islamic thought in the modern world.",
    language: "English, Urdu",
    isFeatured: true,
  },

  // Daily Life, Habits & Personal Development
  {
    title: "Riyad as-Saliheen",
    titleArabic: "رياض الصالحين",
    author: "Imam an-Nawawi",
    authorArabic: "الإمام النووي",
    category: "daily_life" as const,
    description: "The Gardens of the Righteous - essential collection of Hadith for daily etiquettes, worship, and good deeds. A must-read for every Muslim.",
    language: "Arabic, English, Urdu",
    isFeatured: true,
    purchaseUrl: "https://www.amazon.com/Riyad-us-Saliheen-2-Vol-Set/dp/9960740188"
  },
  {
    title: "Hisn al-Muslim (Fortress of the Muslim)",
    titleArabic: "حصن المسلم",
    author: "Sa'id bin Ali al-Qahtani",
    authorArabic: "سعيد بن علي القحطاني",
    category: "daily_life" as const,
    description: "Essential duas and remembrance for daily use. Pocket-sized guide to prophetic supplications for all occasions.",
    language: "Arabic, English, Urdu, Hindi",
    isFeatured: true,
  },
  {
    title: "Ihya Ulum al-Din",
    titleArabic: "إحياء علوم الدين",
    author: "Imam al-Ghazali",
    authorArabic: "الإمام الغزالي",
    category: "daily_life" as const,
    description: "Revival of Religious Sciences - timeless masterpiece on spiritual life, ethics, and the inner dimensions of Islamic practice.",
    language: "Arabic, English, Urdu",
    isFeatured: true,
  },
  {
    title: "Don't Be Sad",
    titleArabic: "لا تحزن",
    author: "Dr. Aaidh ibn Abdullah al-Qarni",
    authorArabic: "د. عائض القرني",
    category: "daily_life" as const,
    description: "Modern Islamic guide to overcoming grief, anxiety, and sadness through faith and positive thinking.",
    language: "Arabic, English, Urdu",
    isFeatured: true,
  },
  {
    title: "The Productive Muslim",
    author: "Mohammed Faris",
    category: "daily_life" as const,
    description: "Practical guide to productivity and time management based on Islamic principles and prophetic wisdom.",
    language: "English",
    isFeatured: false,
  },

  // Islamic Medicine (Tibb-e-Nabawi)
  {
    title: "At-Tibb an-Nabawi",
    titleArabic: "الطب النبوي",
    author: "Ibn al-Qayyim al-Jawziyyah",
    authorArabic: "ابن قيم الجوزية",
    category: "medicine" as const,
    description: "Prophetic Medicine - comprehensive guide to natural healing and remedies from the Sunnah. Essential reference for Tibb-e-Nabawi.",
    language: "Arabic, English, Urdu",
    isFeatured: true,
  },
  {
    title: "Medicine of the Prophet",
    titleArabic: "الطب النبوي",
    author: "Imam Jalaluddin al-Suyuti",
    authorArabic: "الإمام السيوطي",
    category: "medicine" as const,
    description: "Classical compilation of prophetic guidance on health, wellness, and natural remedies.",
    language: "Arabic, English",
    isFeatured: true,
  },
  {
    title: "Natural Remedies of the Prophet",
    author: "Dr. Ahmad H. Sakr",
    category: "medicine" as const,
    description: "Modern presentation of prophetic medicine with scientific analysis of natural remedies like honey, black seed, and dates.",
    language: "English",
    isFeatured: false,
  },

  // Brotherhood, Leadership & Society
  {
    title: "The Ideal Muslim",
    titleArabic: "المسلم المثالي",
    author: "Dr. Muhammad Ali al-Hashimi",
    authorArabic: "د. محمد علي الهاشمي",
    category: "culture" as const,
    description: "Comprehensive guide to the characteristics of an ideal Muslim in relation to Allah, family, and society.",
    language: "Arabic, English, Urdu",
    isFeatured: true,
  },
  {
    title: "In the Early Hours",
    author: "Khurram Murad",
    category: "culture" as const,
    description: "Reflections on spiritual and practical aspects of Muslim life, emphasizing the importance of early morning worship and productivity.",
    language: "English, Urdu",
    isFeatured: true,
  },
  {
    title: "Al-Adab al-Mufrad",
    titleArabic: "الأدب المفرد",
    author: "Imam al-Bukhari",
    authorArabic: "الإمام البخاري",
    category: "culture" as const,
    description: "Dedicated collection of authentic Hadith on manners, etiquette, and social behavior in Islam.",
    language: "Arabic, English, Urdu",
    isFeatured: true,
  },

  // Islamic Culture, Civilization & History
  {
    title: "Muqaddimah (Introduction to History)",
    titleArabic: "المقدمة",
    author: "Ibn Khaldun",
    authorArabic: "ابن خلدون",
    category: "culture" as const,
    description: "Groundbreaking work on sociology, history, and economics. Considered the birth of social sciences in Islamic civilization.",
    language: "Arabic, English, Urdu",
    isFeatured: true,
  },
  {
    title: "Al-Bidaya wa'n-Nihaya",
    titleArabic: "البداية والنهاية",
    author: "Ibn Kathir",
    authorArabic: "ابن كثير",
    category: "culture" as const,
    description: "The Beginning and the End - comprehensive Islamic history from creation to the Day of Judgment.",
    language: "Arabic, English, Urdu",
    isFeatured: true,
  },
  {
    title: "Lost Islamic History",
    author: "Firas Alkhateeb",
    category: "culture" as const,
    description: "Reclaiming Muslim civilization - accessible overview of 1,400 years of Islamic history often overlooked in Western education.",
    language: "English, Urdu",
    isFeatured: true,
  },
  {
    title: "The Road to Mecca",
    author: "Muhammad Asad",
    category: "culture" as const,
    description: "Autobiographical account of a European Jew's journey to Islam and travels through the Muslim world in the early 20th century.",
    language: "English, Urdu",
    isFeatured: false,
  },

  // Education & Reference
  {
    title: "Tafsir Ibn Kathir",
    titleArabic: "تفسير ابن كثير",
    author: "Ibn Kathir",
    authorArabic: "ابن كثير",
    category: "reference" as const,
    description: "Complete 10-volume Quranic commentary - one of the most respected classical tafsir works in Islamic scholarship.",
    language: "Arabic, English, Urdu",
    isFeatured: true,
  },
  {
    title: "40 Hadith of Imam Nawawi",
    titleArabic: "الأربعون النووية",
    author: "Imam an-Nawawi",
    authorArabic: "الإمام النووي",
    category: "reference" as const,
    description: "Concise collection of 40 essential Hadith covering fundamental Islamic ethics and principles.",
    language: "Arabic, English, Urdu, Hindi",
    isFeatured: true,
  },
  {
    title: "Fiqh al-Sunnah",
    titleArabic: "فقه السنة",
    author: "Sayyid Sabiq",
    authorArabic: "السيد سابق",
    category: "reference" as const,
    description: "Comprehensive guide to Islamic jurisprudence based on Quran and Sunnah, covering all aspects of worship and daily life.",
    language: "Arabic, English, Urdu",
    isFeatured: true,
  },
  {
    title: "Ar-Raheeq al-Makhtum (The Sealed Nectar)",
    titleArabic: "الرحيق المختوم",
    author: "Safiyyur Rahman Mubarakpuri",
    authorArabic: "صفي الرحمن المباركفوري",
    category: "reference" as const,
    description: "Biography of Prophet Muhammad ﷺ - award-winning Sirah that won first prize in a global competition.",
    language: "Arabic, English, Urdu",
    isFeatured: true,
  },

  // Youth & Motivation
  {
    title: "Enjoy Your Life",
    titleArabic: "استمتع بحياتك",
    author: "Dr. Muhammad bin Abd al-Rahman al-Arifi",
    authorArabic: "د. محمد العريفي",
    category: "youth" as const,
    description: "Art of interacting with people through prophetic examples and Islamic wisdom for modern youth.",
    language: "Arabic, English, Urdu",
    isFeatured: true,
  },
];

async function seedBooks() {
  console.log("📚 Seeding Islamic books database...\n");

  try {
    // Clear existing books
    await db.delete(books);
    
    // Insert books in batches
    const BATCH_SIZE = 10;
    let count = 0;

    for (let i = 0; i < AUTHENTIC_BOOKS.length; i += BATCH_SIZE) {
      const batch = AUTHENTIC_BOOKS.slice(i, i + BATCH_SIZE);
      await db.insert(books).values(batch);
      count += batch.length;
      console.log(`  Inserted ${count}/${AUTHENTIC_BOOKS.length} books...`);
    }

    console.log(`\n✅ Successfully seeded ${count} authentic Islamic books!`);
    console.log("\n📊 Books by category:");
    
    const categories = {
      finance: AUTHENTIC_BOOKS.filter(b => b.category === "finance").length,
      politics: AUTHENTIC_BOOKS.filter(b => b.category === "politics").length,
      daily_life: AUTHENTIC_BOOKS.filter(b => b.category === "daily_life").length,
      medicine: AUTHENTIC_BOOKS.filter(b => b.category === "medicine").length,
      culture: AUTHENTIC_BOOKS.filter(b => b.category === "culture").length,
      reference: AUTHENTIC_BOOKS.filter(b => b.category === "reference").length,
      youth: AUTHENTIC_BOOKS.filter(b => b.category === "youth").length,
    };

    console.log(`  💰 Finance & Economics: ${categories.finance}`);
    console.log(`  🏛️  Politics & Governance: ${categories.politics}`);
    console.log(`  🌙 Daily Life & Habits: ${categories.daily_life}`);
    console.log(`  🩺 Islamic Medicine: ${categories.medicine}`);
    console.log(`  🕌 Culture & History: ${categories.culture}`);
    console.log(`  📖 Reference Works: ${categories.reference}`);
    console.log(`  ⭐ Youth & Motivation: ${categories.youth}`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding books:", error);
    process.exit(1);
  }
}

seedBooks();
