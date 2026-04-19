const ImageKit = require("imagekit");
const path = require("path");
const crypto = require("crypto");

/**
 * All three must be set to upload need images to ImageKit instead of local disk.
 * Dashboard → Developer options → API keys (public + private) and URL endpoint.
 */
function imageKitConfigured() {
  const pub = process.env.IMAGEKIT_PUBLIC_KEY?.trim();
  const priv = process.env.IMAGEKIT_PRIVATE_KEY?.trim();
  const endpoint = process.env.IMAGEKIT_URL_ENDPOINT?.trim();
  return Boolean(pub && priv && endpoint);
}

let _client = null;

function getImageKitClient() {
  if (_client) return _client;
  if (!imageKitConfigured()) return null;
  let ep = process.env.IMAGEKIT_URL_ENDPOINT.trim();
  if (!ep.endsWith("/")) ep += "/";
  _client = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY.trim(),
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY.trim(),
    urlEndpoint: ep,
  });
  return _client;
}

/**
 * @param {Buffer} fileBuffer
 * @param {string} originalName
 * @param {string} mimetype
 * @param {Record<string, string>} extByMime
 * @returns {Promise<{ url: string, rollback: () => Promise<void> }>}
 */
async function uploadNeedImageToImageKit(fileBuffer, originalName, mimetype, extByMime) {
  const client = getImageKitClient();
  if (!client) {
    throw new Error("ImageKit is not configured (missing IMAGEKIT_* env vars)");
  }
  const ext = path.extname(originalName || "") || extByMime[mimetype] || ".png";
  const fileName = `need-${crypto.randomUUID()}${ext}`;
  /** ImageKit expects paths like `/my-folder/`; omit for root `/` to avoid malformed folder 500s. */
  const rawFolder = process.env.IMAGEKIT_FOLDER?.trim();
  let folder;
  if (rawFolder) {
    const inner = rawFolder.replace(/^\/+|\/+$/g, "");
    folder = inner ? `/${inner}/` : "/";
  }

  const uploadOpts = {
    file: fileBuffer,
    fileName,
    useUniqueFileName: true,
  };
  if (folder) uploadOpts.folder = folder;

  const res = await client.upload(uploadOpts);

  const fileId = res.fileId;
  return {
    url: res.url,
    rollback: async () => {
      try {
        await client.deleteFile(fileId);
      } catch (_) {
        /* ignore */
      }
    },
  };
}

module.exports = {
  imageKitConfigured,
  getImageKitClient,
  uploadNeedImageToImageKit,
};
