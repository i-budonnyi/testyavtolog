const express = require("express");
const router = express.Router();
const rolesController = require("../controllers/rolesController");
const ambassadorController = require("../controllers/ambassadorController");

console.log("[userRolesRoutes] 📌 Ініціалізація маршрутів...");

router.get("/profile", async (req, res) => {
    try {
        console.log(`[userRolesRoutes] 🟢 Отримано запит GET /profile від IP: ${req.ip}`);

        // 🟡 Тимчасово використовуємо userId = 1
        const userId = 1;
        console.log(`[userRolesRoutes] 🔎 Заглушка userId: ${userId}`);

        const userProfile = await rolesController.getUserRole(userId);
        if (!userProfile) {
            console.warn(`[userRolesRoutes] ❌ Користувача не знайдено! ID=${userId}`);
            return res.status(404).json({ message: "Користувач не знайдений" });
        }

        let ambassadorData = {};
        if (userProfile.role === "ambassador") {
            console.log(`[userRolesRoutes] 🔍 Шукаємо дані амбасадора...`);
            ambassadorData = await ambassadorController.getLoggedAmbassador(userId) || {};
        }

        res.status(200).json({
            firstName: userProfile.first_name || "Невідоме ім'я",
            lastName: userProfile.last_name || "Невідоме прізвище",
            role: userProfile.role || "Користувач",
            email: userProfile.email || "Немає email",
            phone: ambassadorData.phone || "Немає телефону",
            position: ambassadorData.position || "",
            profilePicture: userProfile.profile_picture || ""
        });
    } catch (error) {
        console.error("[userRolesRoutes] ❌ Помилка отримання профілю:", error);
        res.status(500).json({ message: "Помилка отримання профілю", error: error.message });
    }
});

console.log("[userRolesRoutes] ✅ Маршрути userRoles підключені.");
module.exports = router;
