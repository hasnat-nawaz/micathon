/** Category tag styling: urgency / theme colors */
export function needCategoryTagClass(tag) {
  if (!tag) return "tag tag-gray";
  const t = String(tag).toLowerCase();
  const map = {
    urgent: "tag tag-urgent",
    food: "tag tag-food",
    education: "tag tag-edu",
    health: "tag tag-health",
    emergency: "tag tag-emergency",
    general: "tag tag-general-cat",
  };
  return map[t] || "tag tag-gray";
}
