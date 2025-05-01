const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

// 🔹 Динамічно визначаємо правильний шлях до `blogController.js`
const controllerPath = path.join(__dirname, "../controllers/blogController");

// ❌ Перевіряємо, чи існує `blogController.js`
if (!fs.existsSync(controllerPath + ".js")) {
    console.error("\n❌ [ERROR] Файл blogController.js не знайдено!");
    console.error(`   📂 Очікуваний шлях: ${controllerPath}.js`);
    process.exit(1);
}

// ✅ Імпортуємо `blogController.js`
const blogController = require(controllerPath);

// 🔍 Логування для перевірки імпорту
console.log("\n[ROUTES] 🔍 Перевірка імпорту blogController:", blogController);

// ✅ Отримуємо контролери
const {
    // authenticateUser, ⬅️ ВИДАЛЕНО
    getAllEntries,
    createBlogEntry,
    deleteBlogEntry
} = blogController;

// ❌ Якщо якась функція `undefined`, зупиняємо сервер
if (
    typeof getAllEntries !== "function" ||
    typeof createBlogEntry !== "function" ||
    typeof deleteBlogEntry !== "function"
) {
    console.error("\n❌ [ERROR] Неможливо підключити маршрут blogRoutes.js:");
    console.error("   Один або більше контролерів `undefined`!");
    console.error(`   📂 Шлях до контролера: ${controllerPath}.js`);
    process.exit(1);
}

// 🔥 Підключаємо маршрути (без авторизації)
router.get("/entries", getAllEntries);
router.post("/create", createBlogEntry);
router.delete("/delete/:entryId", deleteBlogEntry);

console.log("\n✅ [ROUTES] Маршрути blogRoutes.js успішно підключені!\n");

module.exports = router;
