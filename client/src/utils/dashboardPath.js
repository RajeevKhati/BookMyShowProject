/** Default destination after forbidden-route redirects (workspace or account home). */
export function getDashboardPath(role) {
  if (role === "admin") return "/admin";
  if (role === "partner") return "/partner";
  return "/profile";
}

/** Staff workspace URL, or null for standard customers. */
export function getStaffWorkspacePath(role) {
  if (role === "admin") return "/admin";
  if (role === "partner") return "/partner";
  return null;
}
