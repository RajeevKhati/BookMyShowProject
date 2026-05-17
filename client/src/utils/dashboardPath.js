/** Default destination for profile / forbidden-route redirects by role */
export function getDashboardPath(role) {
  if (role === "admin") return "/admin";
  if (role === "partner") return "/partner";
  return "/profile";
}
