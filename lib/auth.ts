import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "smc_session";

export async function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function verifyPassword(password: string, hash: string) {
  const next = await hashPassword(password);
  return next === hash;
}

export async function getCurrentUser() {
  const store = await cookies();
  const id = store.get(COOKIE_NAME)?.value;
  if (!id) return null;

  const numId = Number(id);
  if (isNaN(numId)) return null;

  const user = await prisma.user.findUnique({
    where: { id: numId }
  });

  if (!user || !user.isActive) return null;
  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/dashboard");
  return user;
}

export async function setUserSession(userId: number) {
  const store = await cookies();
  store.set(COOKIE_NAME, String(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/"
  });
}

export async function clearUserSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
