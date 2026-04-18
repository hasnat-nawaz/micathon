const router = require("express").Router();
const { pool } = require("../db/pool");

// GET /api/leaderboard — top donors by total contributions
router.get("/", async (_req, res, next) => {
  try {
    const r = await pool.query(`
      SELECT d.id, d.name,
             COALESCE(SUM(don.amount), 0)::int AS total_donated,
             COUNT(don.id)::int AS donation_count
      FROM donors d
      LEFT JOIN donations don ON don.donor_id = d.id AND don.status = 'completed'
      GROUP BY d.id, d.name
      ORDER BY total_donated DESC, donation_count DESC
      LIMIT 50
    `);
    res.json(r.rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
