require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const { pool } = require("./db/pool");
const { ensureNeedUploadsDir } = require("./lib/needImageUpload");

const authRoutes = require("./routes/auth");
const needsRoutes = require("./routes/needs");
const donationsRoutes = require("./routes/donations");
const institutionsRoutes = require("./routes/institutions");
const beneficiariesRoutes = require("./routes/beneficiaries");
const leaderboardRoutes = require("./routes/leaderboard");
const meRoutes = require("./routes/me");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

ensureNeedUploadsDir();
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/needs", needsRoutes);
app.use("/api/donations", donationsRoutes);
app.use("/api/institutions", institutionsRoutes);
app.use("/api/beneficiaries", beneficiariesRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/me", meRoutes);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("❌", err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;

pool
  .query("SELECT 1")
  .then(() => {
    console.log("✅ Connected to PostgreSQL");
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(
          `❌ Port ${PORT} is already in use. Stop the other process (e.g. \`ss -tlnp | grep ${PORT}\` then kill that PID) or set PORT=5001 in backend/.env`
        );
      } else {
        console.error("❌ Server listen error:", err);
      }
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to PostgreSQL:", err.message);
    process.exit(1);
  });
