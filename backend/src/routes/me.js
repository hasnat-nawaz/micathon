const router = require("express").Router();
const { pool } = require("../db/pool");
const { authRequired } = require("../middleware/auth");

// GET /api/me — current user's profile + stats
router.get("/", authRequired, async (req, res, next) => {
  try {
    const userR = await pool.query(
      "SELECT id, username, role, created_at FROM users WHERE id = $1",
      [req.user.id]
    );
    if (userR.rowCount === 0) return res.status(404).json({ error: "User not found" });
    const user = userR.rows[0];

    if (user.role === "donor") {
      const profileR = await pool.query("SELECT * FROM donors WHERE user_id = $1", [user.id]);
      const profile = profileR.rows[0];
      const stats = await pool.query(
        `SELECT COALESCE(SUM(amount),0)::int AS total_donated,
                COUNT(*)::int AS donation_count
         FROM donations WHERE donor_id = $1 AND status = 'completed'`,
        [profile.id]
      );
      const recent = await pool.query(
        `SELECT d.*, n.title AS need_title, n.image_url, i.name AS institution_name
         FROM donations d
         LEFT JOIN needs n ON n.id = d.need_id
         LEFT JOIN institutions i ON i.id = n.institution_id
         WHERE d.donor_id = $1
         ORDER BY d.created_at DESC LIMIT 20`,
        [profile.id]
      );
      return res.json({ user, profile, stats: stats.rows[0], donations: recent.rows });
    } else {
      const profileR = await pool.query("SELECT * FROM institutions WHERE user_id = $1", [user.id]);
      const profile = profileR.rows[0];
      const stats = await pool.query(
        `SELECT
           COUNT(*)::int AS total_needs,
           COUNT(*) FILTER (WHERE status='pending')::int AS pending_needs,
           COUNT(*) FILTER (WHERE status='funded')::int AS funded_needs,
           COUNT(*) FILTER (WHERE status='closed')::int AS closed_needs,
           COALESCE(SUM(amount_funded),0)::int AS total_raised
         FROM needs WHERE institution_id = $1`,
        [profile.id]
      );
      return res.json({ user, profile, stats: stats.rows[0] });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
