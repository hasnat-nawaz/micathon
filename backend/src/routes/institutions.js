const router = require("express").Router();
const { pool } = require("../db/pool");

// GET /api/institutions/:id
router.get("/:id", async (req, res, next) => {
  try {
    const inst = await pool.query("SELECT * FROM institutions WHERE id = $1", [req.params.id]);
    if (inst.rowCount === 0) return res.status(404).json({ error: "Institution not found" });

    const needs = await pool.query(
      "SELECT * FROM needs WHERE institution_id = $1 ORDER BY created_at DESC",
      [req.params.id]
    );
    const stats = await pool.query(
      `SELECT
         COUNT(*)::int AS total_needs,
         COALESCE(SUM(amount_funded),0)::int AS total_raised,
         COUNT(*) FILTER (WHERE status = 'funded')::int AS funded_count
       FROM needs WHERE institution_id = $1`,
      [req.params.id]
    );
    res.json({ ...inst.rows[0], needs: needs.rows, stats: stats.rows[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
