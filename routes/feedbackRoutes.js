const express = require("express");
const router = express.Router();
const {
  addFeedbackMessage,
  getFeedbackMessages,
  selectIdeaForApplication,
} = require("../controllers/feedbackController");

// ✅ Додати новий коментар
router.post("/add", addFeedbackMessage);

// ✅ Отримати всі коментарі до ідеї
router.get("/list", getFeedbackMessages);

// ✅ Вибір ідеї для створення заявки
router.post("/select-idea", selectIdeaForApplication);

module.exports = router;
