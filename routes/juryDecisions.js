const express = require("express");
const router = express.Router();
const { 
    getApprovedJuryDecisions, 
    getRejectedJuryDecisions, 
    getReviewAllowedJuryDecisions, 
    getNeedsRevisionJuryDecisions 
} = require("../controllers/juryDecisionsController");
// const authenticat = require("../middleware/auth"); // ⬅️ Більше не потрібен

// ✅ Отримати схвалені рішення журі
router.get("/jury-decisions/approved", getApprovedJuryDecisions);

// ✅ Отримати відхилені рішення журі
router.get("/jury-decisions/rejected", getRejectedJuryDecisions);

// ✅ Отримати рішення, що дозволені для перегляду
router.get("/jury-decisions/review-allowed", getReviewAllowedJuryDecisions);

// ✅ Отримати рішення, що потребують доопрацювання
router.get("/jury-decisions/needs-revision", getNeedsRevisionJuryDecisions);

module.exports = router;
