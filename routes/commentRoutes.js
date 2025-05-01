const express = require("express");
const {
  // authenticateUser, ⬅️ ВИДАЛЕНО
  getCommentsByEntry,
  addComment,
  deleteComment,
} = require("../controllers/commentController");

const router = express.Router();

// ✅ Отримати всі коментарі для конкретного запису (блогу або ідеї)
router.get("/:entry_id", getCommentsByEntry);

// ✅ Додати коментар до блогу чи ідеї
router.post("/add", addComment);

// ✅ Видалити коментар (тільки автор може видаляти свої коментарі)
router.delete("/:id", deleteComment);

module.exports = router;
