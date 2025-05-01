const express = require("express");
const router = express.Router();
const ideaController = require("../controllers/ideaController");

console.log("[ideaRoutes] 📌 Ініціалізація маршрутів...");
console.log("[ideaRoutes] 📌 Експортовані функції контролера:", ideaController);

// 🔥 Перевіряємо, чи всі функції є в `ideaController`
const { 
    getAllIdeas, 
    createIdea, 
    updateIdeaStatus, 
    getAllAmbassadors, 
    // authenticateUser, ⬅️ ВИДАЛЕНО
    getUserIdeas,
    getIdeasByAmbassador 
} = ideaController;

if (!getAllIdeas || !createIdea || !updateIdeaStatus || !getAllAmbassadors || !getUserIdeas || !getIdeasByAmbassador) {
    console.error("[ideaRoutes] ❌ Помилка: Одна або більше функцій не імпортовані!");
    console.error({
        getAllIdeas,
        createIdea,
        updateIdeaStatus,
        getAllAmbassadors,
        getUserIdeas,
        getIdeasByAmbassador
    });
    throw new Error("❌ Маршрути не можуть бути підключені через відсутні функції контролера!");
}

// ✅ Отримання всіх ідей
router.get("/", getAllIdeas);

// ✅ Отримання ідей конкретного користувача
router.get("/user-ideas", getUserIdeas);

// ✅ Отримання ідей, де певного амбасадора було обрано іншими користувачами
router.get("/selected-ambassador-ideas/:ambassadorId", getIdeasByAmbassador);

// ✅ Створення ідеї
router.post("/", createIdea);

// ✅ Оновлення статусу ідеї
router.put("/:id", updateIdeaStatus);

// ✅ Отримання списку амбасадорів
router.get("/ambassadors", getAllAmbassadors);

console.log("[ideaRoutes] ✅ Маршрути успішно підключені.");
module.exports = router;
