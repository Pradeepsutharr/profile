import "server-only";

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { ApiError } from "./errors";
import { query } from "./db";

const COOKIE_NAME = "portfolio_admin";

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 32) throw new ApiError(503, "JWT_SECRET must be at least 32 characters");
  return new TextEncoder().encode(value);
}

export async function createSession(account) {
  return new SignJWT({ role: "admin", email: account.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(account.id)
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret());
}

export async function getSession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.role !== "admin" || !payload.sub) return null;
    return { id: payload.sub, email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new ApiError(401, "Admin authentication is required");
  return session;
}

export async function authenticate(email, password) {
  const { rows } = await query(
    "SELECT id, email, password_hash FROM admin_accounts WHERE email = $1 AND is_active = true LIMIT 1",
    [email.toLowerCase().trim()],
  );
  const account = rows[0];
  if (!account || !(await bcrypt.compare(password, account.password_hash))) {
    throw new ApiError(401, "Email or password is incorrect");
  }
  return { id: account.id, email: account.email };
}

export const sessionCookie = (value) => ({
  name: COOKIE_NAME,
  value,
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 8,
});

export const clearedSessionCookie = { ...sessionCookie(""), maxAge: 0 };
