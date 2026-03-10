import { prisma } from "@/lib/prisma";

export async function incrementUsage(userId: number, field: "usageQuiz" | "usageCrisis" | "usageDebate" | "usageSpeech") {
  await prisma.user.update({
    where: { id: userId },
    data: {
      [field]: {
        increment: 1
      }
    }
  });
}

export function premiumAllowed(user: {
  role: string;
  plan: string;
  usageQuiz: number;
  usageCrisis: number;
  usageDebate: number;
  usageSpeech: number;
}, feature: "quiz" | "crisis" | "debate" | "speech") {
  if (user.role === "admin" || user.plan === "premium") {
    return { ok: true, message: "" };
  }

  const limits = {
    quiz: ["usageQuiz", 3],
    crisis: ["usageCrisis", 2],
    debate: ["usageDebate", 2],
    speech: ["usageSpeech", 3]
  } as const;

  const [key, limit] = limits[feature];
  if (user[key] >= limit) {
    return { ok: false, message: `Free plan limit reached for ${feature}. Ask admin for premium.` };
  }

  return { ok: true, message: "" };
}
