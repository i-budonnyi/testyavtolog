const sequelize = require("../config/database");
const { QueryTypes } = require("sequelize");

// ✅ Отримати всі ідеї
const getAllIdeas = async (req, res) => {
  try {
    const ideas = await sequelize.query("SELECT * FROM ideas ORDER BY created_at DESC", {
      type: QueryTypes.SELECT
    });
    res.status(200).json(ideas);
  } catch (error) {
    res.status(500).json({ message: "Помилка отримання ідей", error: error.message });
  }
};

// ✅ Створити нову ідею без авторизації (тимчасово)
const createIdea = async (req, res) => {
  try {
    const { ambassador_id, title, description } = req.body;

    // Прибираємо перевірку на авторизацію
    // const user_id = req.user?.id;
    const user_id = 1; // 👉 тимчасово хардкод для тесту або заміни

    await sequelize.query(
      `INSERT INTO ideas (user_id, ambassador_id, title, description, status)
       VALUES (:user_id, :ambassador_id, :title, :description, 'pending')`,
      {
        replacements: { user_id, ambassador_id, title, description },
        type: QueryTypes.INSERT
      }
    );

    res.status(201).json({ message: "Ідея створена" });
  } catch (error) {
    console.error("[createIdea] ❌ Помилка створення ідеї:", error);
    res.status(500).json({ message: "Помилка створення", error: error.message });
  }
};


// інші функції залишити без змін
const getUserIdeas = async (req, res) => { /* ... */ };
const getIdeasByAmbassador = async (req, res) => { /* ... */ };
const updateIdeaStatus = async (req, res) => { /* ... */ };
const getAllAmbassadors = async (req, res) => { /* ... */ };

module.exports = {
  getAllIdeas,
  createIdea,
  getUserIdeas,
  updateIdeaStatus,
  getIdeasByAmbassador,
  getAllAmbassadors
  // ❌ НЕ експортуємо authenticateUser
};
