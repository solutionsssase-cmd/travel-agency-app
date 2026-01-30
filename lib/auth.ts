import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const ONE_DAY = 60 * 60 * 24;

function getSecret() {
  return process.env.ADMIN_SECRET || "dev_admin_secret_change_me";
}

function sign(value: string) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(value)
    .digest("hex");
}

export function createSession(email: string) {
  const payload = JSON.stringify({ email, exp: Date.now() + ONE_DAY * 1000 });
  const signature = sign(payload);
  const token = Buffer.from(`${payload}.${signature}`).toString("base64");
  cookies().set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_DAY
  });
}

export function clearSession() {
  cookies().set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}

export function isAuthenticated() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) {
    return false;
  }
  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const [payload, signature] = decoded.split(".");
    if (!payload || !signature) {
      return false;
    }
    if (sign(payload) !== signature) {
      return false;
    }
    const data = JSON.parse(payload) as { email: string; exp: number };
    return Date.now() < data.exp;
  } catch {
    return false;
  }
}

export function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL || "admin@wanderly.com",
    password: process.env.ADMIN_PASSWORD || "admin1234"
  };
}
