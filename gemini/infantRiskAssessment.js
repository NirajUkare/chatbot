const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY_2 });

async function assessInfantRisk(inputData) {
  try {
    const prompt = `
You are a pediatric risk triage guidance AI.

Analyze the infant health input below.

INPUT:
${JSON.stringify(inputData, null, 2)}

Classify the condition into ONLY ONE of the following:
- "Risky" (requires medical consultation / emergency care)
- "Not Risky" (can be managed with home care and monitoring)

Return ONLY valid JSON in the exact structure below.
Do not include markdown or extra text.

{
  "riskStatus": "Risky | Not Risky",
  "summary": "",
  "possibleCauses": [],
  "recommendedAction": "",
  "homeCareRemedies": [],
  "warningSignsToMonitor": [],
  "nearbyHospitals": [
    {
      "name": "",
      "latitude": 0,
      "longitude": 0
    }
  ],
  "importantNotes": []
}

Rules:
- If ANY red_flags are true → Risky
- If breathing difficulty, seizures, blue lips, dehydration, persistent high fever → Risky
- If Risky → 
  - homeCareRemedies MUST be empty
  - nearbyHospitals MUST contain at least 2 facilities near the given location
- If Not Risky →
  - nearbyHospitals MUST be empty
  - homeCareRemedies may be provided if allow_home_remedies is true
- Use approximate coordinates based on city/pincode if needed
- Be calm, clear, and safety-first
- No medical diagnosis

IMPORTANT INSTRUCTION (must be included in importantNotes):
“This system provides educational guidance only and does not replace professional medical advice.”
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 900 }
    });

    const candidate = response?.candidates?.[0];
    if (!candidate) throw new Error("No response from Gemini");

    let text = "";
    if (candidate.content?.parts) {
      text = candidate.content.parts.map(p => p.text).join("").trim();
    }

    return JSON.parse(text);
  } catch (err) {
    console.error("Infant risk assessment error:", err);
    throw err;
  }
}

module.exports = { assessInfantRisk };
