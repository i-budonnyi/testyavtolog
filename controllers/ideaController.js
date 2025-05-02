const sequelize = require("../config/database"); // ✅ Підключення до БД
const { QueryTypes } = require("sequelize");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// ✅ Middleware для перевірки JWT
const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.error("[authenticateUser] ❌ Відсутній токен авторизації.");
        return res.status(401).json({ message: "Необхідно авторизуватися" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("[authenticateUser] ✅ Токен розшифровано:", decoded);

        if (!decoded.id) {
            console.error("[authenticateUser] ❌ Токен не містить ID користувача.");
            return res.status(401).json({ message: "Некоректний токен" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error("[authenticateUser] ❌ Невірний токен:", error);
        return res.status(403).json({ message: "Невірний або протермінований токен" });
    }
};

// ✅ Отримати всі ідеї
const getAllIdeas = async (req, res) => {
    try {
        const ideas = await sequelize.query(
            `SELECT * FROM ideas ORDER BY created_at DESC`,
            { type: QueryTypes.SELECT }
        );
        res.status(200).json(ideas);
    } catch (error) {
        res.status(500).json({ message: "Помилка отримання ідей", error: error.message });
    }
};

// ✅ Отримати всі ідеї користувача
const getUserIdeas = async (req, res) => {
    try {
        if (!req.user?.id) return res.status(401).json({ message: "Авторизація потрібна." });

        const userId = req.user.id;
        const ideas = await sequelize.query(
            `SELECT * FROM ideas WHERE user_id = :userId ORDER BY created_at DESC`,
            { replacements: { userId }, type: QueryTypes.SELECT }
        );

        if (!ideas.length) return res.status(404).json({ message: "У вас ще немає поданих ідей." });
        res.status(200).json(ideas);
    } catch (error) {
        res.status(500).json({ message: "Помилка отримання ідей", error: error.message });
    }
};

// ✅ Отримати всі ідеї, прив’язані до амбасадора
const getIdeasByAmbassador = async (req, res) => {
    try {
        const { ambassadorId } = req.params;
        if (!ambassadorId) return res.status(400).json({ message: "ID амбасадора обов'язковий." });

        const ideas = await sequelize.query(
            `SELECT i.*, u.first_name, u.last_name, u.email
             FROM ideas i
             LEFT JOIN users u ON i.user_id = u.id
             WHERE i.ambassador_id = :ambassadorId
             ORDER BY i.created_at DESC`,
            { replacements: { ambassadorId }, type: QueryTypes.SELECT }
        );

        if (!ideas.length) return res.status(404).json({ message: "Немає ідей із цим амбасадором." });
        res.status(200).json(ideas);
    } catch (error) {
        res.status(500).json({ message: "Помилка", error: error.message });
    }
};

// ✅ Додати коментар до ідеї
const addCommentToIdea = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        const userId = req.user?.id;

        if (!userId) return res.status(401).json({ message: "Потрібна авторизація." });
        if (!comment?.trim()) return res.status(400).json({ message: "Коментар не може бути порожнім." });

        await sequelize.query(
            `INSERT INTO comments (idea_id, user_id, comment_text) VALUES (:id, :userId, :comment)`,
            { replacements: { id, userId, comment }, type: QueryTypes.INSERT }
        );

        res.status(201).json({ message: "Коментар додано" });
    } catch (error) {
        res.status(500).json({ message: "Помилка", error: error.message });
    }
};

// ✅ Створити нову ідею (без авторизації — тимчасово)
const createIdea = async (req, res) => {
    try {
        const { ambassador_id, title, description } = req.body;

        // ⛔ Замість req.user — тимчасово user_id = 1
        const user_id = 1;

        if (!ambassador_id || !title || !description)
            return res.status(400).json({ message: "Усі поля обов’язкові." });

        await sequelize.query(
            `INSERT INTO ideas (user_id, ambassador_id, title, description, status)
             VALUES (:user_id, :ambassador_id, :title, :description, 'pending')`,
            { replacements: { user_id, ambassador_id, title, description }, type: QueryTypes.INSERT }
        );

        res.status(201).json({ message: "Ідея подана успішно" });
    } catch (error) {
        res.status(500).json({ message: "Помилка подання ідеї", error: error.message });
    }
};

// ✅ Оновити статус ідеї
const updateIdeaStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!id || !status) return res.status(400).json({ message: "ID і статус обов'язкові." });

        await sequelize.query(
            `UPDATE ideas SET status = :status WHERE id = :id`,
            { replacements: { status, id }, type: QueryTypes.UPDATE }
        );

        res.status(200).json({ message: "Статус оновлено" });
    } catch (error) {
        res.status(500).json({ message: "Помилка", error: error.message });
    }
};

// ✅ Отримати список амбасадорів (тимчасова заглушка)
const getAllAmbassadors = async (req, res) => {
    try {
        const ambassadors = await sequelize.query(
            `SELECT * FROM ambassadors`,
            { type: QueryTypes.SELECT }
        );
        res.status(200).json(ambassadors);
    } catch (error) {
        res.status(500).json({ message: "Помилка отримання амбасадорів", error });
    }
};

// ✅ Експорт функцій
module.exports = {
    getAllIdeas,
    createIdea,
    getUserIdeas,
    updateIdeaStatus,
    addCommentToIdea,
    getAllAmbassadors,
    authenticateUser,
    getIdeasByAmbassador
};
