const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const sequelize = require("./config/db");
const UserModel = require("./models/users");
const UserRoleModel = require("./models/UserRoles");

const app = express();
const port = process.env.PORT || 10000;
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// ✅ Дозволені домени для CORS
app.use(cors({
  origin: [
    "http://localhost:8080",
    "https://serene-fairy-1a0577.netlify.app",
    "https://nearby-walrus-crucial.ngrok-free.app",
    "https://leanavtologistika.netlify.app",
    "https://testyavtolog.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// ✅ Встановлення кодування
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

// ✅ Логування вхідних запитів
app.use((req, res, next) => {
  const log = `[${new Date().toISOString()}] ${req.method} ${req.url} | IP: ${req.ip}`;
  console.log(log);
  fs.appendFile("server.log", log + "\n", (err) => {
    if (err) console.error("Помилка логування:", err.message);
  });
  next();
});

// ✅ Головна сторінка (живий API)
app.get("/", (req, res) => {
  res.status(200).send("✅ API живий! Для доступу використовуйте /api/... маршрути.");
});

// ✅ Middleware авторизації
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access token required" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// ✅ Профіль користувача
app.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    const user = await UserModel.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const userRole = await UserRoleModel.findOne({ where: { user_id: user.id } });

    res.status(200).json({
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        email: user.email,
        role: userRole ? userRole.role_id : null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// ✅ Автоматичне підключення всіх роутів з папки routes
const routesPath = path.join(__dirname, "routes");
fs.readdirSync(routesPath).forEach((file) => {
  if (file.endsWith(".js")) {
    try {
      const route = require(path.join(routesPath, file));
      if (route && Object.getPrototypeOf(route) === express.Router) {
        const routeName = file.replace(".js", "");
        app.use(`/api/${routeName}`, route);
        console.log(`[ROUTES] Підключено: /api/${routeName}`);
      } else {
        console.error(`[ERROR] ${file} не експортує express.Router`);
      }
    } catch (error) {
      console.error(`[ERROR] Не вдалося підключити ${file}:`, error.message);
    }
  }
});

// ✅ Логування вихідної відповіді
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (body) {
    console.log(`[RESPONSE] ${res.statusCode} →`, body);
    fs.appendFile(
      "server.log",
      `[${new Date().toISOString()}] RESPONSE ${res.statusCode}: ${JSON.stringify(body)}\n`,
      (err) => {
        if (err) console.error("Помилка запису логу:", err.message);
      }
    );
    originalSend.apply(res, arguments);
  };
  next();
});

// ✅ Синхронізація БД і запуск сервера
sequelize.sync()
  .then(() => {
    console.log("[DATABASE] Синхронізація успішна");
    app.listen(port, () => {
      console.log(`[SERVER] Сервер працює на порті ${port}`);
    });
  })
  .catch((err) => {
    console.error("[DATABASE] Помилка підключення:", err.message);
    process.exit(1);
  });
