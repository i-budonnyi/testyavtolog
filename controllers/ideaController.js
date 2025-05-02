const sequelize = require("../config/database");
const { QueryTypes } = require("sequelize");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// ✅ Middleware авторизації
const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Необхідно авторизуватися" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.id) {
      return res.status(401).json({ message: "Некоректний токен" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Невірний або протермінований токен" });
  }
};

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

// ✅ Отримати ідеї користувача
const getUserIdeas = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Авторизація обов’язкова" });
    const ideas = await sequelize.query("SELECT * FROM ideas WHERE user_id = :userId ORDER BY created_at DESC", {
      replacements: { userId },
      type: QueryTypes.SELECT
    });
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
      `SELECT i.*, u.first_name, u.last_name FROM ideas i LEFT JOIN users u ON i.user_id = u.id
       WHERE i.ambassador_id = :ambassadorId ORDER BY i.created_at DESC`,
      { replacements: { ambassadorId }, type: QueryTypes.SELECT }
    );
    res.status(200).json(ideas);
  } catch (error) {
    res.status(500).json({ message: "Помилка отримання ідей", error: error.message });
  }
};

// ✅ Додати нову ідею
const createIdea = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) return res.status(401).json({ message: "Авторизація обов’язкова" });

    const { ambassador_id, title, description } = req.body;
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

// ✅ Оновити статус
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

// ✅ Список амбасадорів (без моделей)
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
  getUserIdeas,
  createIdea,
  updateIdeaStatus,
  getIdeasByAmbassador,
  getAllAmbassadors,
  authenticateUser
};
