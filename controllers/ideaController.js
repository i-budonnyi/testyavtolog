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

// ✅ Створити нову ідею (без авторизації, user_id = 1)
const createIdea = async (req, res) => {
  try {
    const { ambassador_id, title, description } = req.body;
    const user_id = 1;

    if (!ambassador_id || !title || !description) {
      return res.status(400).json({ message: "Усі поля обов’язкові: title, description, ambassador_id" });
    }

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
    res.status(500).json({ message: "Помилка створення", error: error.message });
  }
};

// ✅ Ідеї користувача (поки лишаємо, якщо авторизація включиться)
const getUserIdeas = async (req, res) => {
  // реалізація стара
};

// ✅ Ідеї певного амбасадора
const getIdeasByAmbassador = async (req, res) => {
  // реалізація стара
};

// ✅ Оновлення статусу
const updateIdeaStatus = async (req, res) => {
  // реалізація стара
};

// ✅ Список амбасадорів
const getAllAmbassadors = async (req, res) => {
  try {
    const data = await sequelize.query("SELECT * FROM ambassadors", { type: QueryTypes.SELECT });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Помилка отримання амбасадорів", error });
  }
};

module.exports = {
  getAllIdeas,
  createIdea,
  getUserIdeas,
  updateIdeaStatus,
  getIdeasByAmbassador,
  getAllAmbassadors
};
