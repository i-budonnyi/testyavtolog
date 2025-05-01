const express = require("express");
const userController = require("../controllers/userController"); // імпортуємо як об'єкт
// const authMiddleware = require("../middleware/auth"); // ❌ Прибрано

const router = express.Router();

// ✅ Профіль тепер доступний без авторизації
router.get("/profile", userController.getUserProfile);

// ✅ Вихід (можна лишити публічним, якщо токени не перевіряються)
router.post("/logout", userController.logout);

module.exports = router;
