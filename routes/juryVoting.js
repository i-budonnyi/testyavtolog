const express = require("express");
const router = express.Router();
const JuryVotingController = require("../controllers/JuryVotingController");
// const auth = require("../middleware/auth"); // ⬅️ Більше не потрібен

// ✅ Роут для голосування (без авторизації)
router.post("/vote", JuryVotingController.vote);

console.log("🟢 Маршрут `juryVotingRoutes.js` успішно підключено!");
module.exports = router;
