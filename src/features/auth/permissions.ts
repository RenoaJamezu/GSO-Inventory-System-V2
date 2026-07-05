import type { CurrentUser } from "./types";

export function isAdmin(user?: CurrentUser | null) {
  return user?.role === "ADMIN";
}

export function isStaff(user?: CurrentUser | null) {
  return user?.role === "STAFF";
}

export function isViewer(user?: CurrentUser | null) {
  return user?.role === "VIEWER";
}
