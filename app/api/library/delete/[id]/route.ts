import { requireUser } from "@/lib/auth"
import { logAction } from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await requireUser()
    const { id } = await params;

    const numId = Number(id)
    if (isNaN(numId)) {
        return new Response("Invalid ID", { status: 400 })
    }

    try {
        const file = await prisma.libraryFile.findUnique({ where: { id: numId } })
        if (!file) {
            return new Response("File not found", { status: 404 })
        }

        await prisma.libraryFile.delete({ where: { id: numId } })

        await logAction(user.id, "delete_library", `File ${file.originalName} deleted`)
    } catch (error: any) {
        console.log(error);
        return new Response(error, { status: 500 })
    }

    redirect("/dashboard")
}