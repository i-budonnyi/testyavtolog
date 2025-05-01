const express = require("express");
const router = express.Router();
const problemsController = require("../controllers/problemsController");

// const { authenticateUser } = problemsController; // 🔒 Видалено перевірку авторизації

// ✅ Отримати всі проблеми
router.get("/", problemsController.getAllProblems);

// ✅ Отримати проблеми конкретного користувача
router.get("/user-problems", problemsController.getUserProblems);

// ✅ Створити нову проблему
router.post("/", problemsController.createProblem);

// ✅ Видалити проблему
router.delete("/:id", problemsController.deleteProblem);

// ✅ Отримати всіх амбасадорів
router.get("/ambassadors", problemsController.getAllAmbassadors);

module.exports = router;
