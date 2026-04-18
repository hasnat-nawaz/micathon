const router = require("express").Router();
const { pool } = require("../db/pool");
const { authRequired, requireRole } = require("../middleware/auth");

async function institutionIdForUser(userId) {
  const r = await pool.query("SELECT id FROM institutions WHERE user_id = $1", [userId]);
  return r.rows[0]?.id;
}

// GET /api/beneficiaries — own institution's beneficiaries
router.get("/", authRequired, requireRole("institution"), async (req, res, next) => {
  try {
    const instId = await institutionIdForUser(req.user.id);
    const r = await pool.query(
      "SELECT * FROM beneficiaries WHERE institution_id = $1 ORDER BY created_at DESC",
      [instId]
    );
    res.json(r.rows);
  } catch (err) {
    next(err);
  }
});

// POST /api/beneficiaries
router.post("/", authRequired, requireRole("institution"), async (req, res, next) => {
  try {
    const instId = await institutionIdForUser(req.user.id);
    const { name, reference_code } = req.body;
    if (!name) return res.status(400).json({ error: "name is required" });
    const r = await pool.query(
      "INSERT INTO beneficiaries (institution_id, name, reference_code) VALUES ($1, $2, $3) RETURNING *",
      [instId, name, reference_code || null]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
