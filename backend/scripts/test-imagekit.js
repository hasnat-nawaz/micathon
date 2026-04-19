/**
 * One-off check: loads backend/.env, uploads a 1×1 PNG via the same path as need images, then deletes it.
 * Run: cd backend && node scripts/test-imagekit.js
 */
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const { imageKitConfigured } = require("../src/lib/imagekitNeedUpload");
const { persistNeedImage } = require("../src/lib/needImageUpload");

// Minimal valid 1×1 PNG
const PNG_1X1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64"
);

async function main() {
  if (!imageKitConfigured()) {
    console.error(
      "Missing ImageKit env: set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT in backend/.env"
    );
    process.exit(1);
  }

  const { getImageKitClient } = require("../src/lib/imagekitNeedUpload");
  try {
    const ik = getImageKitClient();
    await ik.listFiles({ path: "/", limit: 1 });
    console.log("API keys OK (listFiles succeeded).");
  } catch (err) {
    const status = err?.$ResponseMetadata?.statusCode;
    const detail = err?.message || err?.help || String(err);
    console.error(
      "listFiles failed — check IMAGEKIT_PRIVATE_KEY and account (HTTP " + (status || "?") + "):",
      detail
    );
    process.exit(1);
  }

  const file = {
    buffer: PNG_1X1,
    originalname: "equivalence-engine-upload-test.png",
    mimetype: "image/png",
  };

  try {
    const { url, rollback } = await persistNeedImage(file);
    console.log("Upload OK. Stored URL (truncated):", url.slice(0, 60) + (url.length > 60 ? "…" : ""));
    await rollback();
    console.log("Cleanup OK (removed test asset).");
  } catch (err) {
    const status = err?.$ResponseMetadata?.statusCode;
    const detail = err?.message || err?.help || err?.response?.data || err;
    console.error("Upload failed" + (status ? ` (HTTP ${status})` : "") + ":", detail);
    process.exit(1);
  }
}

main();
