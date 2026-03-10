import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser();
  const { id } = await params;

  const file = await prisma.libraryFile.findFirst({
    where: {
      id: Number(id),
      userId: user.id
    }
  });

  if (!file) {
    return new NextResponse("Not found", { status: 404 });
  }

  const full = path.join(process.cwd(), "uploads", file.storedName);

  try {
    const data = await fs.readFile(full);
    return new NextResponse(data, {
      headers: {
        "Content-Disposition": `attachment; filename="${file.originalName}"`,
        "Content-Type": "application/octet-stream"
      }
    });
  } catch {
    const text = file.extractedText || "";
    return new NextResponse(text, {
      headers: {
        "Content-Disposition": `attachment; filename="${file.originalName}.txt"`,
        "Content-Type": "text/plain; charset=utf-8"
      }
    });
  }
}
