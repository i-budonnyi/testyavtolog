const express = require("express");
const router = express.Router();
const approvedProjectsController = require("../controllers/approvedProjectsController");
// const authenticat = require("../middleware/auth"); // 🔒 Прибрано

// 📌 Отримати поточного залогіненого PM
router.get("/pm/me", (req, res, next) => {
    req.params.pmId = req.user?.id || "anonymous"; // Без авторизації — fallback
    next();
}, approvedProjectsController.getProjectManagerById);

// 📌 Отримати інформацію про конкретного PM за його ID
router.get("/pm/:pmId", approvedProjectsController.getProjectManagerById);

// 📌 Отримати всі фінальні рішення журі
router.get("/jury-decisions/final", approvedProjectsController.getFinalJuryDecisions);

module.exports = router;
