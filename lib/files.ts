import fs from "fs/promises";
import path from "path";
import os from "os";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";

export const UPLOAD_DIR = path.join(os.tmpdir(), "savemyconf-uploads");
export const ALLOWED_EXTENSIONS = new Set(["txt", "pdf", "docx"]);

export async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

export function getExtension(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return ext;
}

export function allowedFile(filename: string) {
  return ALLOWED_EXTENSIONS.has(getExtension(filename));
}

export async function saveIncomingFile(file: File) {
  await ensureUploadDir();
  const ext = getExtension(file.name);
  const storedName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
  const full = path.join(UPLOAD_DIR, storedName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(full, buffer);
  return { storedName, fullPath: full, ext };
}

export async function extractText(fullPath: string, ext: string) {
  try {
    if (ext === "txt") {
      const text = await fs.readFile(fullPath, "utf8");
      return text.slice(0, 50000);
    }

    if (ext === "pdf") {
      const buffer = await fs.readFile(fullPath);
      const result = await pdfParse(buffer);
      return (result.text || "").slice(0, 50000);
    }

    if (ext === "docx") {
      const buffer = await fs.readFile(fullPath);
      const result = await mammoth.extractRawText({ buffer });
      return (result.value || "").slice(0, 50000);
    }
  } catch {
    return "";
  }

  return "";
}
