const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pregnancyFoodRoutes = require("./routes/pregnancyFood.routes");
const infantDietRoutes = require("./routes/infantDiet.routes");
const infantRiskRoutes = require("./routes/infantRisk.routes");
const parentChatbotRoutes = require("./routes/parentChatbot.routes");
const morgan = require ("morgan");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/pregnancy", pregnancyFoodRoutes);
app.use("/api/infant", infantDietRoutes);
app.use("/api/infant", infantRiskRoutes);
app.use("/api/parent-chatbot", parentChatbotRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
