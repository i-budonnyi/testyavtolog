const express = require("express");
const router = express.Router();
const approvedProjectsController = require("../controllers/approvedProjectsController");
// const authenticat = require("../middleware/auth"); // 🔒 Видалено

// 📌 Отримати інформацію про конкретного PM за його ID
router.get("/pm/:pmId", approvedProjectsController.getProjectManagerById);

// 📌 Отримати всі фінальні рішення журі
router.get("/jury-decisions/final", approvedProjectsController.getFinalJuryDecisions);

module.exports = router;
