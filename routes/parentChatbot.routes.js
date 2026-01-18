const express = require("express");
const { parentCareChatbot } = require("../gemini/parentCareChatbot");

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const reply = await parentCareChatbot(message);

    res.json({
      success: true,
      response: reply
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;
