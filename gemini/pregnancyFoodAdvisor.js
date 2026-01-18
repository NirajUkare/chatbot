const fs = require("fs");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY_4 });

async function analyzePregnancyFood(imagePath) {
  try {
    const absolutePath = path.resolve(imagePath);
    const imageData = fs.readFileSync(absolutePath, { encoding: "base64" });

    const prompt = `
You are a maternal nutrition expert AI.

Analyze the food shown in the image.

Return ONLY valid JSON in the exact structure below.
Do not add markdown, bullet symbols, or extra text.

{
  "foodIdentified": "",
  "pregnancySafety": {
    "status": "Yes | No | Limited",
    "recommendedTrimester": ""
  },
  "healthBenefits": [],
  "potentialRisks": [],
  "healthierAlternatives": [],
  "dietAdvice": [],
  "riskLevel": "Low | Medium | High"
}

Rules:
- Keep advice medically cautious
- Do not give medical diagnosis
- Use simple, reassuring language
`;


    const imagePart = {
      inlineData: {
        data: imageData,
        mimeType: "image/jpeg",
      },
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }, imagePart] }],
      generationConfig: { maxOutputTokens: 400 },
    });

    const candidate = response?.candidates?.[0];
    if (!candidate) throw new Error("No response from Gemini");

    let text = "";

    if (candidate.content?.parts) {
    text = candidate.content.parts.map(p => p.text).join("").trim();
    }

    const analysisJson = JSON.parse(text);

    return analysisJson;
  } catch (err) {
    console.error("Pregnancy food analysis error:", err);
    throw err;
  }
}

module.exports = { analyzePregnancyFood };
