const fs = require("fs");
const fsp = require("fs").promises;
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const { imageKitConfigured, uploadNeedImageToImageKit } = require("./imagekitNeedUpload");

/** Absolute dir: <repo>/backend/uploads/needs (fallback when ImageKit env is not set) */
const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads", "needs");

const ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
]);

const EXT_BY_MIME = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
};

function ensureNeedUploadsDir() {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/** Keep file in RAM (max 2 MB); push to ImageKit or disk after validation. */
const uploadNeedImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype) && EXT_BY_MIME[file.mimetype]) {
      cb(null, true);
    } else {
      cb(new Error("Only PNG, JPEG, WebP, or SVG images are allowed"));
    }
  },
});

/**
 * After Multer: upload to ImageKit when configured, else write under /uploads/needs/.
 * @returns {Promise<{ url: string, rollback: () => Promise<void> }>}
 */
async function persistNeedImage(file) {
  if (!file?.buffer) {
    throw new Error("Invalid upload file");
  }
  if (imageKitConfigured()) {
    return uploadNeedImageToImageKit(file.buffer, file.originalname, file.mimetype, EXT_BY_MIME);
  }
  ensureNeedUploadsDir();
  const ext = EXT_BY_MIME[file.mimetype];
  const name = `${crypto.randomUUID()}${ext}`;
  const full = path.join(UPLOAD_DIR, name);
  await fsp.writeFile(full, file.buffer);
  const publicPath = `/uploads/needs/${name}`;
  return {
    url: publicPath,
    rollback: async () => {
      await deleteNeedImageFileIfSafe(publicPath);
    },
  };
}

/**
 * Safe delete for files we created under /uploads/needs/<uuid>.<ext>
 */
async function deleteNeedImageFileIfSafe(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return;
  if (!imageUrl.startsWith("/uploads/needs/")) return;
  const base = path.basename(imageUrl);
  if (!/^[0-9a-f-]{36}\.(png|jpe?g|webp|svg)$/i.test(base)) return;
  const full = path.join(UPLOAD_DIR, base);
  await fsp.unlink(full).catch(() => {});
}

function isMultipart(req) {
  return String(req.headers["content-type"] || "").includes("multipart/form-data");
}

module.exports = {
  UPLOAD_DIR,
  ensureNeedUploadsDir,
  uploadNeedImage,
  persistNeedImage,
  deleteNeedImageFileIfSafe,
  isMultipart,
};
