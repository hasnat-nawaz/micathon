/** User-facing message for failed API calls (network vs HTTP error). */
export function getApiErrorMessage(err, fallback = "Something went wrong") {
  if (err?.response?.data?.error) return err.response.data.error;
  const code = err?.code;
  const msg = err?.message || "";
  if (
    code === "ERR_NETWORK" ||
    code === "ECONNREFUSED" ||
    msg === "Network Error" ||
    !err?.response
  ) {
    return "Cannot reach the server. Start the backend: from the project root run npm run dev (or npm run dev --prefix backend). It must listen on port 5000. Check DATABASE_URL in backend/.env.";
  }
  return fallback;
}
