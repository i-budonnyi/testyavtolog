const express = require("express");
const router = express.Router();
// const authenticate = require("../middleware/auth"); // 🔒 ВИДАЛЕНО
const applicationReturnsController = require("../controllers/applicationReturnsController");

// 🟡 Дебаг: перевіряємо імпортовані значення
console.log("🟡 applicationReturnsController:", applicationReturnsController);
console.log("🟡 Тип `returnApplication`:", typeof applicationReturnsController.returnApplication);
console.log("🟡 Тип `getReturnedApplicationsForUser`:", typeof applicationReturnsController.getReturnedApplicationsForUser);

// 🔥 Перевірка, чи контролер взагалі існує та має функції
if (!applicationReturnsController || typeof applicationReturnsController !== "object") {
    console.error("❌ Контролер `applicationReturnsController` не завантажився (undefined або пустий об'єкт)!");
    throw new Error("❌ Контролер `applicationReturnsController` не знайдено!");
}

if (!applicationReturnsController.returnApplication || typeof applicationReturnsController.returnApplication !== "function") {
    console.error("❌ Функція `returnApplication` не знайдена або не є функцією!");
    throw new Error("❌ `returnApplication` не є функцією!");
}

if (!applicationReturnsController.getReturnedApplicationsForUser || typeof applicationReturnsController.getReturnedApplicationsForUser !== "function") {
    console.error("❌ Функція `getReturnedApplicationsForUser` не знайдена або не є функцією!");
    throw new Error("❌ `getReturnedApplicationsForUser` не є функцією!");
}

// ✅ Повернення заявки секретарем
router.post("/return", applicationReturnsController.returnApplication);

// ✅ Користувач (автор заявки) отримує свої повернені заявки
router.get("/my-returns", applicationReturnsController.getReturnedApplicationsForUser);

console.log("🟢 Маршрут `applicationReturnsRoutes.js` успішно завантажено!");
module.exports = router;
