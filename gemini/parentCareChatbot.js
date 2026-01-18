const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY_3 });

async function parentCareChatbot(userMessage) {
  try {
    const prompt = `
You are a supportive and empathetic AI chatbot for parents.

Parents may ask questions related to:
- Pregnancy (pre-birth)
- Infant care (post-birth)
- General parental concerns

First, identify the context automatically:
- PreBirth
- PostBirth
- General

Then respond in a calm, reassuring, and practical manner.

Return ONLY valid JSON in the following structure.
Do not add markdown or extra text.

{
  "reply": "",
  "careContext": "PreBirth | PostBirth | General",
  "tone": "Reassuring | Informational | Cautionary",
  "importantNotes": []
}

Rules:
- Do NOT provide medical diagnosis
- If symptoms seem serious, gently suggest consulting a doctor
- Avoid alarming language
- Keep responses short, warm, and parent-friendly

IMPORTANT INSTRUCTION (must be included in importantNotes):
“This system provides educational guidance only and does not replace professional medical advice.”
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `${prompt}\n\nParent question:\n"${userMessage}"` }]
        }
      ],
      generationConfig: { maxOutputTokens: 400 }
    });

    const candidate = response?.candidates?.[0];
    if (!candidate) throw new Error("No response from Gemini");

    let text = "";
    if (candidate.content?.parts) {
      text = candidate.content.parts.map(p => p.text).join("").trim();
    }

    return JSON.parse(text);
  } catch (err) {
    console.error("Parent chatbot error:", err);
    throw err;
  }
}

module.exports = { parentCareChatbot };
