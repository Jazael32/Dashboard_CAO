import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
const COOKIE_NAME = "session";
const DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

export async function decrypt(token?: string) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return payload as { userId: number };
  } catch {
    return null;
  }
}

export async function createSession(userId: number) {
  const expires = new Date(Date.now() + DURATION_MS);
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(secret);

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires,
    path: "/",
  });
}

export async function getSession() {
  return decrypt((await cookies()).get(COOKIE_NAME)?.value);
}

export async function deleteSession() {
  (await cookies()).delete(COOKIE_NAME);
}