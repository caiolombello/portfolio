import fs from "fs/promises";

export async function ensureDirectory(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch (error) {
    // Diretório não existe, vamos criá-lo
    await fs.mkdir(dirPath, { recursive: true });
  }
}
