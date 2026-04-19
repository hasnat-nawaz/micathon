const DEFAULT_NEED_IMAGE =
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800";

/**
 * Resolves `needs.image_url` for <img> / CSS url(): external URLs pass through;
 * local uploads (`/uploads/needs/...`) get an origin in production when the API is on another host.
 */
export function resolveNeedImageUrl(image_url) {
  if (!image_url) return DEFAULT_NEED_IMAGE;
  if (/^https?:\/\//i.test(image_url)) return image_url;
  if (image_url.startsWith("/uploads/")) {
    const explicit = import.meta.env.VITE_API_URL;
    if (import.meta.env.DEV && (!explicit || String(explicit).startsWith("/"))) {
      return image_url;
    }
    const apiBase =
      explicit || (import.meta.env.DEV ? "/api" : "http://localhost:5000/api");
    const origin = String(apiBase).replace(/\/?api\/?$/i, "").replace(/\/$/, "");
    return origin ? `${origin}${image_url}` : image_url;
  }
  return image_url;
}
