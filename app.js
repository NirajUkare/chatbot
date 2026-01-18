// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();

// const pregnancyFoodRoutes = require("./routes/pregnancyFood.routes");
// const infantDietRoutes = require("./routes/infantDiet.routes");
// const infantRiskRoutes = require("./routes/infantRisk.routes");
// const parentChatbotRoutes = require("./routes/parentChatbot.routes");
// const morgan = require ("morgan");

// const app = express();

// app.use(cors());
// app.use(morgan("dev"));
// app.use(express.json());

// app.use("/api/pregnancy", pregnancyFoodRoutes);
// app.use("/api/infant", infantDietRoutes);
// app.use("/api/infant", infantRiskRoutes);
// app.use("/api/parent-chatbot", parentChatbotRoutes);


// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const morgan = require("morgan");
const axios = require("axios");
require("dotenv").config();

const pregnancyFoodRoutes = require("./routes/pregnancyFood.routes");
const infantDietRoutes = require("./routes/infantDiet.routes");
const infantRiskRoutes = require("./routes/infantRisk.routes");
const parentChatbotRoutes = require("./routes/parentChatbot.routes");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/pregnancy", pregnancyFoodRoutes);
app.use("/api/infant", infantDietRoutes);
app.use("/api/infant", infantRiskRoutes);
app.use("/api/parent-chatbot", parentChatbotRoutes);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

cron.schedule(
  "*/10 * * * *",
  async () => {
    try {
      console.log("⏱ Pinging server to prevent sleep");
      await axios.get(process.env.RENDER_URL + "/health");
      console.log("✅ Server ping successful");
    } catch (error) {
      console.error("❌ Server ping failed", error.message);
    }
  },
  {
    timezone: "Asia/Kolkata",
  }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
