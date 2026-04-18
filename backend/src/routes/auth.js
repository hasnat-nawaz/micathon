const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { pool } = require("../db/pool");
const { sign } = require("../middleware/auth");

// POST /api/auth/signup
router.post("/signup", async (req, res, next) => {
  const client = await pool.connect();
  try {
    const {
      username,
      password,
      role,
      name,
      email,
      phone,
      // institution-only
      type,
      location,
      contact_email,
      contact_phone,
    } = req.body;

    if (!username || !password || !role || !name) {
      return res.status(400).json({ error: "username, password, role, name are required" });
    }
    if (!["donor", "institution"].includes(role)) {
      return res.status(400).json({ error: "role must be 'donor' or 'institution'" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    await client.query("BEGIN");

    const existing = await client.query("SELECT id FROM users WHERE username = $1", [username]);
    if (existing.rowCount > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Username already taken" });
    }

    const hash = await bcrypt.hash(password, 10);
    const userResult = await client.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role",
      [username, hash, role]
    );
    const user = userResult.rows[0];

    let profile;
    if (role === "donor") {
      const r = await client.query(
        "INSERT INTO donors (user_id, name, email, phone) VALUES ($1, $2, $3, $4) RETURNING *",
        [user.id, name, email || null, phone || null]
      );
      profile = r.rows[0];
    } else {
      const r = await client.query(
        `INSERT INTO institutions (user_id, name, type, location, contact_email, contact_phone)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [user.id, name, type || null, location || null, contact_email || email || null, contact_phone || phone || null]
      );
      profile = r.rows[0];
    }

    await client.query("COMMIT");

    const token = sign({ id: user.id, role: user.role, username: user.username });
    res.status(201).json({ token, user, profile });
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    next(err);
  } finally {
    client.release();
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username and password are required" });
    }
    const r = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (r.rowCount === 0) return res.status(401).json({ error: "Invalid credentials" });
    const user = r.rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    let profile = null;
    if (user.role === "donor") {
      const p = await pool.query("SELECT * FROM donors WHERE user_id = $1", [user.id]);
      profile = p.rows[0] || null;
    } else {
      const p = await pool.query("SELECT * FROM institutions WHERE user_id = $1", [user.id]);
      profile = p.rows[0] || null;
    }

    const token = sign({ id: user.id, role: user.role, username: user.username });
    res.json({
      token,
      user: { id: user.id, username: user.username, role: user.role },
      profile,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
