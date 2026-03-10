import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function ensureAdminSeed() {
  try {
    const email = process.env.ADMIN_EMAIL || "ns.saridar@gmail.com";
    const password = process.env.ADMIN_PASSWORD || "admin12345";

    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) return existing;

    return await prisma.user.create({
      data: {
        name: "Nicolas Saridar",
        email,
        passwordHash: await hashPassword(password),
        plan: "premium",
        role: "admin",
        isActive: true
      }
    });
  } catch (error) {
    console.warn("Skipping admin seed, database unreachable (this is normal during build).");
    return null;
  }
}
