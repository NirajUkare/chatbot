const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function describeImage(imagePath) {
  try {
    const absolutePath = path.resolve(imagePath);
    const imageData = fs.readFileSync(absolutePath, { encoding: "base64" });

    const prompt = `You are an advanced image understanding AI.
Your task is to describe in detail what is happening in the given image.
Return only a concise, human-readable description.`;

    const imagePart = {
      inlineData: {
        data: imageData,
        mimeType: "image/jpeg",
      },
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }, imagePart] }],
      generationConfig: { maxOutputTokens: 300 },
    });

    const candidate = response?.candidates?.[0];
    if (!candidate) throw new Error("No candidates returned");

    let rawText = "";

    if (Array.isArray(candidate.content)) {
      rawText = candidate.content
        .map((c) => (c.parts ? c.parts.map((p) => p.text).join("\n") : c.text || ""))
        .join("\n")
        .trim();
    } else if (candidate.content?.parts) {
      rawText = candidate.content.parts.map((p) => p.text).join("\n").trim();
    } else if (candidate.content?.text) {
      rawText = candidate.content.text.trim();
    }

    if (!rawText) return "No description returned from Gemini";

    return rawText;
  } catch (err) {
    console.error("Error in describeImage:", err);
    return `Error: ${err.message}`;
  }
}



module.exports = { describeImage };