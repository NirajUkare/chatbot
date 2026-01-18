const express = require("express");
const { assessInfantRisk } = require("../gemini/infantRiskAssessment");

const router = express.Router();

router.post("/infant-risk-check", async (req, res) => {
  try {
    const inputData = req.body;

    if (!inputData || Object.keys(inputData).length === 0) {
      return res.status(400).json({
        error: "Input data is required"
      });
    }

    const assessment = await assessInfantRisk(inputData);

    res.json({
      success: true,
      analysis: assessment
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;
