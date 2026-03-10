import { prisma } from "@/lib/prisma";

export async function logAction(userId: number | null, action: string, details = "") {
  await prisma.activityLog.create({
    data: {
      userId,
      action,
      details: details || null
    }
  });
}
