const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
// const authMiddleware = require("../middleware/authMiddleware"); // 🔒 Видалено

// ✅ Створення нової заявки
router.post("/", applicationController.createApplication);

// ✅ Отримання всіх заявок
router.get("/", applicationController.getAllApplications);

// ✅ Отримання конкретної заявки за ID
router.get("/:id", applicationController.getApplicationById);

// ✅ Оновлення заявки
router.put("/:id", applicationController.updateApplication);

// ✅ Оновлення заявки з рішенням журі
router.put("/:id/jury", applicationController.updateApplicationByJury);

// ✅ Видалення заявки
router.delete("/:id", applicationController.deleteApplication);

module.exports = router;
