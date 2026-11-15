/**
 * Helper utilities for administrator authentication and authorization.
 * ADMIN_EMAIL is strictly read from process.env.ADMIN_EMAIL without hardcoded fallbacks.
 */

export function getAdminEmail() {
  const email = process.env.ADMIN_EMAIL;
  return email ? email.trim().toLowerCase() : "";
}

export function isAdminSession(session) {
  const adminEmail = getAdminEmail();
  if (!adminEmail) return false;

  const sessionEmail = session?.user?.email?.trim().toLowerCase();
  const sessionRole = session?.user?.role;

  return sessionRole === "admin" && sessionEmail === adminEmail;
}

