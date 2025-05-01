const express = require("express");
const router = express.Router();
const agendaController = require("../controllers/agendaController");
// const authenticate = require("../middleware/auth"); // 🔒 Прибрано

// ✅ Створення порядку денного
router.post("/create", agendaController.createAgenda);

// ✅ Отримання всіх записів порядку денного
router.get("/", agendaController.getAllAgendas);

// ✅ Отримання конкретного порядку денного за ID
router.get("/:id", agendaController.getAgendaById);

module.exports = router;
