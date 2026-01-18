const express = require("express");
const multer = require("multer");
const path = require("path");
const { analyzePregnancyFood } = require("../gemini/pregnancyFoodAdvisor");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/analyze-food", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const result = await analyzePregnancyFood(req.file.path);

    res.json({
    success: true,
    analysis: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;
