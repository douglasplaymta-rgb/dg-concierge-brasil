import { createHmac, timingSafeEqual } from "node:crypto";

export const adminCookieName = "dg_concierge_admin";
const sessionLifetimeSeconds = 60 * 60 * 24 * 7;

export function adminIsConfigured() {
  return typeof process.env.DG_ADMIN_PASSWORD === "string" && process.env.DG_ADMIN_PASSWORD.length >= 12;
}

export function passwordMatches(candidate: string) {
  if (!adminIsConfigured()) return false;
  const submitted = Buffer.from(candidate);
  const expected = Buffer.from(process.env.DG_ADMIN_PASSWORD!);
  return submitted.length === expected.length && timingSafeEqual(submitted, expected);
}

function sign(expiresAt: string) {
  return createHmac("sha256", process.env.DG_ADMIN_PASSWORD!).update(`dg-admin-session:${expiresAt}`).digest("hex");
}

export function createAdminSession() {
  const expiresAt = String(Math.floor(Date.now() / 1000) + sessionLifetimeSeconds);
  return `${expiresAt}.${sign(expiresAt)}`;
}

export function getAdminSession(request: Request) {
  const cookie = request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${adminCookieName}=`));
  return cookie ? decodeURIComponent(cookie.slice(adminCookieName.length + 1)) : "";
}

export function isAdminAuthenticated(request: Request) {
  if (!adminIsConfigured()) return false;
  const token = getAdminSession(request);
  if (!/^\d+\.[a-f0-9]{64}$/.test(token)) return false;
  const [expiresAt, signature] = token.split(".");
  const expiration = Number(expiresAt);
  if (expiration <= Date.now() / 1000 || expiration > Date.now() / 1000 + sessionLifetimeSeconds) return false;
  const submitted = Buffer.from(signature, "hex");
  const expected = Buffer.from(sign(expiresAt), "hex");
  return submitted.length === expected.length && timingSafeEqual(submitted, expected);
}

export const adminSessionMaxAge = sessionLifetimeSeconds;
