import { db } from "./db";
import { topics, topicContent, type InsertTopic, type InsertTopicContent } from "@shared/schema";

const sampleTopics: InsertTopic[] = [
  // Islamic Finance Topics
  {
    name: "Riba (Interest)",
    nameArabic: "الربا",
    section: "finance",
    summary: "Understanding the prohibition of interest in Islam, its types (riba al-nasiah and riba al-fadl), and halal alternatives for financial transactions.",
    slug: "riba-interest",
  },
  {
    name: "Zakat",
    nameArabic: "الزكاة",
    section: "finance",
    summary: "The third pillar of Islam - understanding calculation, distribution, and spiritual significance of obligatory charity on wealth.",
    slug: "zakat",
  },
  {
    name: "Halal Trade & Business",
    nameArabic: "التجارة الحلال",
    section: "finance",
    summary: "Guidelines for conducting permissible business transactions, contracts, and trade according to Sharia principles.",
    slug: "halal-trade-business",
  },
  
  // Daily Life Topics
  {
    name: "Salah (Prayer)",
    nameArabic: "الصلاة",
    section: "daily_life",
    summary: "The five daily prayers, their timings, conditions, and spiritual significance in a Muslim's daily life.",
    slug: "salah-prayer",
  },
  {
    name: "Fasting (Sawm)",
    nameArabic: "الصيام",
    section: "daily_life",
    summary: "Ramadan fasting, voluntary fasts, their rulings, benefits, and spiritual dimensions.",
    slug: "fasting-sawm",
  },
  {
    name: "Islamic Manners (Adab)",
    nameArabic: "الأدب الإسلامي",
    section: "daily_life",
    summary: "Prophetic etiquette and manners in dealing with people, eating, sleeping, and everyday interactions.",
    slug: "islamic-manners-adab",
  },
  
  // Politics & Governance Topics
  {
    name: "Shura (Consultation)",
    nameArabic: "الشورى",
    section: "politics",
    summary: "The Islamic principle of mutual consultation in governance and decision-making.",
    slug: "shura-consultation",
  },
  {
    name: "Justice in Governance",
    nameArabic: "العدل في الحكم",
    section: "politics",
    summary: "Islamic principles of establishing justice, equity, and accountability in leadership and governance.",
    slug: "justice-governance",
  },
  
  // Prophetic Medicine Topics
  {
    name: "Cupping (Hijama)",
    nameArabic: "الحجامة",
    section: "medicine",
    summary: "The Prophetic practice of cupping therapy, its benefits, timings, and medical wisdom.",
    slug: "cupping-hijama",
  },
  {
    name: "Black Seed (Habbatus Sauda)",
    nameArabic: "الحبة السوداء",
    section: "medicine",
    summary: "The healing properties of black seed as mentioned in Prophetic medicine and modern research.",
    slug: "black-seed",
  },
];

async function seedTopics() {
  console.log("🌱 Seeding topics...");
  
  try {
    // Insert topics
    for (const topic of sampleTopics) {
      await db.insert(topics).values(topic).onConflictDoNothing();
      console.log(`✅ Created topic: ${topic.name}`);
    }
    
    console.log("\n✅ Topics seeding completed!");
    console.log(`Total topics created: ${sampleTopics.length}`);
    
  } catch (error) {
    console.error("❌ Error seeding topics:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedTopics()
    .then(() => {
      console.log("🎉 Seeding complete!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    });
}

export { seedTopics };
