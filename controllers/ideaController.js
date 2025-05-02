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
    const user_id = 1; // ❗ тимчасово жорстко вказуємо

    await sequelize.query(
      `INSERT INTO ideas (user_id, ambassador_id, title, description, status)
       VALUES (:user_id, :ambassador_id, :title, :description, 'pending')`,
      {
        replacements: { user_id, ambassador_id, title, description },
        type: QueryTypes.INSERT
      }
    );

    res.status(201).json({ message: "Ідея успішно створена" });
  } catch (error) {
    console.error("[createIdea] ❌ Помилка створення:", error);
    res.status(500).json({ message: "Помилка при створенні ідеї", error: error.message });
  }
};

// ✅ Отримати ідеї користувача (тимчасово user_id = 1)
const getUserIdeas = async (req, res) => {
  try {
    const userId = 1; // ❗ тимчасовий user_id
    const ideas = await sequelize.query(
      "SELECT * FROM ideas WHERE user_id = :userId ORDER BY created_at DESC",
      {
        replacements: { userId },
        type: QueryTypes.SELECT
      }
    );
    res.status(200).json(ideas);
  } catch (error) {
    res.status(500).json({ message: "Помилка отримання ідей", error: error.message });
  }
};

// ✅ Ідеї певного амбасадора
const getIdeasByAmbassador = async (req, res) => {
  const { ambassadorId } = req.params;
  if (!ambassadorId) return res.status(400).json({ message: "Необхідно ID амбасадора" });

  try {
    const ideas = await sequelize.query(
      `SELECT i.*, u.first_name, u.last_name FROM ideas i
       LEFT JOIN users u ON i.user_id = u.id
       WHERE i.ambassador_id = :ambassadorId
       ORDER BY i.created_at DESC`,
      {
        replacements: { ambassadorId },
        type: QueryTypes.SELECT
      }
    );
    res.status(200).json(ideas);
  } catch (error) {
    res.status(500).json({ message: "Помилка отримання ідей", error: error.message });
  }
};

// ✅ Оновити статус ідеї
const updateIdeaStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!id || !status) return res.status(400).json({ message: "ID і статус обов'язкові" });

  try {
    await sequelize.query(
      `UPDATE ideas SET status = :status WHERE id = :id`,
      { replacements: { status, id }, type: QueryTypes.UPDATE }
    );
    res.status(200).json({ message: "Статус оновлено" });
  } catch (error) {
    res.status(500).json({ message: "Помилка оновлення статусу", error: error.message });
  }
};

// ✅ Список амбасадорів
const getAllAmbassadors = async (req, res) => {
  try {
    const data = await sequelize.query("SELECT * FROM ambassadors", {
      type: QueryTypes.SELECT
    });
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
