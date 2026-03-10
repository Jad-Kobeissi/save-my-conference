import { prisma } from "@/lib/prisma";

export async function buildContextText(userId: number, fileIds?: number[]) {
  const where = fileIds?.length
    ? { userId, id: { in: fileIds } }
    : { userId };

  const rows = await prisma.libraryFile.findMany({
    where,
    orderBy: { id: "desc" },
    take: fileIds?.length ? undefined : 5
  });

  return rows
    .filter((row) => row.extractedText)
    .map((row) => `Source File: ${row.originalName}\n${row.extractedText?.slice(0, 6000) || ""}`)
    .join("\n\n")
    .slice(0, 18000);
}
