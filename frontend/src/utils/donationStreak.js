/** Local calendar date key YYYY-MM-DD */
function dateKey(iso) {
  const t = new Date(iso);
  const y = t.getFullYear();
  const m = String(t.getMonth() + 1).padStart(2, "0");
  const d = String(t.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Consecutive days with ≥1 completed donation, anchored from today (or yesterday if none today). */
export function computeDonationStreak(donations) {
  if (!donations?.length) return 0;
  const dates = new Set(donations.map((x) => dateKey(x.created_at)));
  let streak = 0;
  const check = new Date();
  check.setHours(0, 0, 0, 0);
  const key = (dt) => {
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const d = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };
  if (!dates.has(key(check))) {
    check.setDate(check.getDate() - 1);
  }
  while (dates.has(key(check))) {
    streak += 1;
    check.setDate(check.getDate() - 1);
  }
  return streak;
}
