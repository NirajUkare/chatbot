const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY_1 });

async function generateInfantDietPlan(inputData) {
  try {
    const prompt = `
You are a pediatric nutrition guidance AI.

Create a personalized ONE-MONTH infant diet plan with a WEEKLY schedule
based on the input JSON below.

INPUT:
${JSON.stringify(inputData, null, 2)}

The response must ALWAYS cover:
- 1 month
- 4 weekly schedules (Week 1 to Week 4)

Respond with ONLY the most IMPORTANT and PRACTICAL guidance.
Keep everything short, clear, and parent-friendly.
Avoid explanations and long text.

Return ONLY valid JSON in the exact structure below.
Do not add markdown, symbols, or extra text.

{
  "planDuration": "1 Month",
  "textureGuidance": "",
  "foodsToAvoid": [],
  "weeklySchedule": [
    {
      "week": 1,
      "mealsPerDay": 0,
      "recommendedFoods": []
    },
    {
      "week": 2,
      "mealsPerDay": 0,
      "recommendedFoods": []
    },
    {
      "week": 3,
      "mealsPerDay": 0,
      "recommendedFoods": []
    },
    {
      "week": 4,
      "mealsPerDay": 0,
      "recommendedFoods": []
    }
  ],
  "keyTips": [],
  "importantNotes": []
}

Rules:
- Use short phrases only
- Focus on food types, not recipes
- Respect infant age, region, and diet preference
- No medical diagnosis
- Avoid repetition across weeks
- Do not mention calories or measurements

IMPORTANT INSTRUCTION (must be included in importantNotes):
“This guidance is educational and not a medical diagnosis. Avoid honey, whole nuts, excess salt, sugar, and choking hazards. Suggest pediatrician consultation if red flags appear.”
`;



    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 700 },
    });

    const candidate = response?.candidates?.[0];
    if (!candidate) throw new Error("No response from Gemini");

    let text = "";

    if (candidate.content?.parts) {
      text = candidate.content.parts.map(p => p.text).join("").trim();
    }

    return JSON.parse(text);
  } catch (err) {
    console.error("Infant diet planner error:", err);
    throw err;
  }
}

module.exports = { generateInfantDietPlan };
