const express = require("express");
const router = express.Router();
const ideaController = require("../controllers/ideaController");

console.log("[ideaRoutes] 📌 Ініціалізація маршрутів...");

const {
  getAllIdeas,
  createIdea,
  updateIdeaStatus,
  getAllAmbassadors,
  getUserIdeas,
  getIdeasByAmbassador
} = ideaController;

// Перевірка наявності функцій
if (
  !getAllIdeas ||
  !createIdea ||
  !updateIdeaStatus ||
  !getAllAmbassadors ||
  !getUserIdeas ||
  !getIdeasByAmbassador
) {
  console.error("[ideaRoutes] ❌ Відсутні функції контролера:", {
    getAllIdeas,
    createIdea,
    updateIdeaStatus,
    getAllAmbassadors,
    getUserIdeas,
    getIdeasByAmbassador
  });
  throw new Error("❌ Неможливо ініціалізувати маршрути: не всі функції доступні.");
}

// 🔹 Отримати всі ідеї
router.get("/", getAllIdeas);

// 🔹 Отримати ідеї певного користувача
router.get("/user-ideas", getUserIdeas);

// 🔹 Отримати ідеї, де певного амбасадора обрано іншими
router.get("/selected-ambassador-ideas/:ambassadorId", getIdeasByAmbassador);

// 🔹 Створити ідею (БЕЗ авторизації)
router.post("/", createIdea);

// 🔹 Оновити статус ідеї
router.put("/:id", updateIdeaStatus);

// 🔹 Отримати список амбасадорів
router.get("/ambassadors", getAllAmbassadors);

console.log("[ideaRoutes] ✅ Маршрути підключені успішно.");
module.exports = router;
