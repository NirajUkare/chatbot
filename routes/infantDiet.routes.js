const express = require("express");
const { generateInfantDietPlan } = require("../gemini/infantDietPlanner");

const router = express.Router();

router.post("/infant-diet-plan", async (req, res) => {
  try {
    const inputData = req.body;

    if (!inputData || Object.keys(inputData).length === 0) {
      return res.status(400).json({ error: "Input data is required" });
    }

    const plan = await generateInfantDietPlan(inputData);

    res.json({
      success: true,
      analysis: plan
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;
