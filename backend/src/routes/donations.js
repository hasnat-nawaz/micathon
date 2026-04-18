const router = require("express").Router();
const { pool } = require("../db/pool");
const { authRequired, requireRole } = require("../middleware/auth");

// POST /api/donations (donor)
router.post("/", authRequired, requireRole("donor"), async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { need_id, amount, method } = req.body;
    if (!need_id || !amount) return res.status(400).json({ error: "need_id and amount required" });
    if (Number(amount) <= 0) return res.status(400).json({ error: "amount must be positive" });

    await client.query("BEGIN");

    const donorR = await client.query("SELECT id FROM donors WHERE user_id = $1", [req.user.id]);
    if (donorR.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Donor profile not found" });
    }
    const donorId = donorR.rows[0].id;

    const needR = await client.query(
      "SELECT id, amount_required, amount_funded, status FROM needs WHERE id = $1 FOR UPDATE",
      [need_id]
    );
    if (needR.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Need not found" });
    }
    const need = needR.rows[0];
    if (need.status !== "pending") {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: `Need is ${need.status}, cannot donate` });
    }

    const remaining = need.amount_required - need.amount_funded;
    const acceptedAmount = Math.min(Number(amount), remaining);

    const donation = await client.query(
      `INSERT INTO donations (need_id, donor_id, amount, status, method)
       VALUES ($1, $2, $3, 'completed', $4) RETURNING *`,
      [need_id, donorId, acceptedAmount, method || "card"]
    );

    const newFunded = need.amount_funded + acceptedAmount;
    const newStatus = newFunded >= need.amount_required ? "funded" : "pending";
    const updated = await client.query(
      "UPDATE needs SET amount_funded = $1, status = $2 WHERE id = $3 RETURNING *",
      [newFunded, newStatus, need_id]
    );

    await client.query("COMMIT");
    res.status(201).json({ donation: donation.rows[0], need: updated.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    next(err);
  } finally {
    client.release();
  }
});

module.exports = router;
