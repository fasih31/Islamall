// Blueprint reference: javascript_openai
import OpenAI from "openai";
import fs from "fs";
import path from "path";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Arabic Text-to-Speech with high-quality Arabic voice
export async function generateArabicSpeech(text: string): Promise<Buffer> {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1-hd",
    voice: "nova", // Nova has excellent Arabic pronunciation
    input: text,
    response_format: "mp3",
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  return buffer;
}

// OCR functionality using OpenAI Vision API
export async function extractTextFromImage(base64Image: string): Promise<{ 
  arabicText: string;
  englishText: string;
  fullText: string;
}> {
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: "You are an expert in Arabic text extraction (OCR). Extract all text from the image, preserving Arabic text exactly as written. Return the result in JSON format with 'arabicText' (Arabic only), 'englishText' (English/other languages), and 'fullText' (all text combined)."
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Extract all text from this image. Identify and separate Arabic text from other languages."
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`
            }
          }
        ],
      },
    ],
    response_format: { type: "json_object" },
    max_completion_tokens: 2048,
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");
  
  return {
    arabicText: result.arabicText || "",
    englishText: result.englishText || "",
    fullText: result.fullText || result.arabicText || result.englishText || "",
  };
}

// Validate Hadith authenticity based on 5 classical criteria
export async function validateHadith(
  hadithText: string,
  narrator?: string,
  source?: string
): Promise<{
  classification: "Sahih" | "Hasan" | "Da'if" | "Mawdu'" | "Unknown";
  analysis: string;
  criteria: {
    sanad: { score: number; notes: string };
    adalah: { score: number; notes: string };
    dabt: { score: number; notes: string };
    shudhudh: { score: number; notes: string };
    illah: { score: number; notes: string };
  };
}> {
  const criteriaPrompt = `
Evaluate this Hadith based on the five classical criteria of Hadith authentication:

Hadith Text (Arabic): ${hadithText}
${narrator ? `Narrator: ${narrator}` : ''}
${source ? `Source: ${source}` : ''}

Analyze based on these five criteria:

1. **Sanad (Chain of Narration)** - Is the chain unbroken and continuous?
2. **'Adālah (Integrity)** - Are the narrators trustworthy, Muslim, sane, and of good character?
3. **Ḍabṭ (Accuracy & Memory)** - Do the narrators have strong memory or accurate written records?
4. **'Adam al-Shudhūdh (No Contradiction)** - Does it contradict the Quran or stronger authentic Hadiths?
5. **'Adam al-'Illah (No Hidden Defect)** - Are there any hidden flaws in transmission?

Provide:
1. A classification: Sahih (Authentic), Hasan (Good), Da'if (Weak), or Mawdu' (Fabricated)
2. Detailed analysis explaining your classification
3. For each criterion, provide a score (0-10) and brief notes

Return in JSON format with: classification, analysis, and criteria object with sanad, adalah, dabt, shudhudh, illah (each with score and notes).
`;

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: "You are an expert Islamic scholar specializing in Hadith authentication ('Ilm al-Hadith). Analyze Hadiths based on classical criteria from scholars like Imam al-Bukhari, Imam Muslim, and Ibn Hajar al-'Asqalani. Be thorough, respectful, and academically rigorous."
      },
      {
        role: "user",
        content: criteriaPrompt
      }
    ],
    response_format: { type: "json_object" },
    max_completion_tokens: 3000,
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");
  
  return {
    classification: result.classification || "Unknown",
    analysis: result.analysis || "Unable to analyze the Hadith.",
    criteria: result.criteria || {
      sanad: { score: 0, notes: "Not evaluated" },
      adalah: { score: 0, notes: "Not evaluated" },
      dabt: { score: 0, notes: "Not evaluated" },
      shudhudh: { score: 0, notes: "Not evaluated" },
      illah: { score: 0, notes: "Not evaluated" },
    }
  };
}

// Analyze Quranic verse for deeper understanding
export async function analyzeQuranicVerse(arabicText: string, translation: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: "You are an Islamic scholar providing respectful and accurate Quranic analysis. Provide brief insights about the verse's context, meaning, and practical application."
      },
      {
        role: "user",
        content: `Analyze this Quranic verse:\n\nArabic: ${arabicText}\nTranslation: ${translation}\n\nProvide a brief analysis (2-3 paragraphs).`
      }
    ],
    max_completion_tokens: 500,
  });

  return response.choices[0].message.content || "";
}

// Save audio file to disk
export async function saveAudioFile(buffer: Buffer, filename: string): Promise<string> {
  const audioDir = path.join(process.cwd(), "uploads", "audio");
  
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  const filePath = path.join(audioDir, filename);
  fs.writeFileSync(filePath, buffer);
  
  return `/uploads/audio/${filename}`;
}
