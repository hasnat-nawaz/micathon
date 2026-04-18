const router = require("express").Router();
const { pool } = require("../db/pool");
const { authRequired, requireRole } = require("../middleware/auth");

// GET /api/needs?tag=&status=&institution_id=
router.get("/", async (req, res, next) => {
  try {
    const { tag, status, institution_id } = req.query;
    const conditions = [];
    const params = [];
    if (tag) {
      params.push(tag);
      conditions.push(`n.tag = $${params.length}`);
    }
    if (status) {
      params.push(status);
      conditions.push(`n.status = $${params.length}`);
    }
    if (institution_id) {
      params.push(institution_id);
      conditions.push(`n.institution_id = $${params.length}`);
    }
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const sql = `
      SELECT n.*,
             i.name AS institution_name, i.location AS institution_location, i.type AS institution_type,
             b.name AS beneficiary_name, b.reference_code AS beneficiary_reference_code
      FROM needs n
      LEFT JOIN institutions i ON i.id = n.institution_id
      LEFT JOIN beneficiaries b ON b.id = n.beneficiary_id
      ${where}
      ORDER BY n.priority DESC, n.created_at DESC
    `;
    const r = await pool.query(sql, params);
    res.json(r.rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/needs/:id
router.get("/:id", async (req, res, next) => {
  try {
    const r = await pool.query(
      `SELECT n.*,
              i.name AS institution_name, i.location AS institution_location,
              i.type AS institution_type, i.contact_email AS institution_email,
              i.contact_phone AS institution_phone, i.is_verified AS institution_verified,
              b.name AS beneficiary_name, b.reference_code AS beneficiary_reference_code
       FROM needs n
       LEFT JOIN institutions i ON i.id = n.institution_id
       LEFT JOIN beneficiaries b ON b.id = n.beneficiary_id
       WHERE n.id = $1`,
      [req.params.id]
    );
    if (r.rowCount === 0) return res.status(404).json({ error: "Need not found" });
    res.json(r.rows[0]);
  } catch (err) {
    next(err);
  }
});

// helper: get institution_id for current user
async function institutionIdForUser(userId) {
  const r = await pool.query("SELECT id FROM institutions WHERE user_id = $1", [userId]);
  return r.rows[0]?.id;
}

// POST /api/needs (institution)
router.post("/", authRequired, requireRole("institution"), async (req, res, next) => {
  try {
    const instId = await institutionIdForUser(req.user.id);
    if (!instId) return res.status(400).json({ error: "Institution profile not found" });

    const {
      title, description, amount_required, tag, priority,
      image_url, beneficiary_id,
    } = req.body;

    if (!title || !amount_required) {
      return res.status(400).json({ error: "title and amount_required are required" });
    }
    if (Number(amount_required) <= 0) {
      return res.status(400).json({ error: "amount_required must be positive" });
    }

    const r = await pool.query(
      `INSERT INTO needs (institution_id, beneficiary_id, title, description,
                          amount_required, tag, priority, image_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [instId, beneficiary_id || null, title, description || null,
       amount_required, tag || null, priority || 1, image_url || null]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/needs/:id (institution — own needs only)
router.patch("/:id", authRequired, requireRole("institution"), async (req, res, next) => {
  try {
    const instId = await institutionIdForUser(req.user.id);
    const own = await pool.query(
      "SELECT id FROM needs WHERE id = $1 AND institution_id = $2",
      [req.params.id, instId]
    );
    if (own.rowCount === 0) return res.status(404).json({ error: "Need not found" });

    const allowed = ["title", "description", "amount_required", "tag", "priority", "image_url", "beneficiary_id"];
    const sets = [];
    const params = [];
    for (const key of allowed) {
      if (key in req.body) {
        params.push(req.body[key]);
        sets.push(`${key} = $${params.length}`);
      }
    }
    if (sets.length === 0) return res.status(400).json({ error: "No valid fields to update" });

    params.push(req.params.id);
    const r = await pool.query(
      `UPDATE needs SET ${sets.join(", ")} WHERE id = $${params.length} RETURNING *`,
      params
    );
    res.json(r.rows[0]);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/needs/:id/status
router.patch("/:id/status", authRequired, requireRole("institution"), async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["pending", "funded", "closed"].includes(status)) {
      return res.status(400).json({ error: "status must be pending|funded|closed" });
    }
    const instId = await institutionIdForUser(req.user.id);
    const r = await pool.query(
      "UPDATE needs SET status = $1 WHERE id = $2 AND institution_id = $3 RETURNING *",
      [status, req.params.id, instId]
    );
    if (r.rowCount === 0) return res.status(404).json({ error: "Need not found" });
    res.json(r.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
