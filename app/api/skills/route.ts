import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import type { Skill } from "@/types/skill";
import { logger } from "@/lib/logger";
import { ensureDirectory } from "@/lib/ensure-directory";

// Dados padrão para as skills
const defaultSkills: Skill[] = [
  {
    id: "1",
    name: "JavaScript",
    level: "Avançado",
    category: "Frontend",
  },
  {
    id: "2",
    name: "React",
    level: "Experiente",
    category: "Frontend",
  },
  {
    id: "3",
    name: "Node.js",
    level: "Proficiente",
    category: "Backend",
  },
  {
    id: "4",
    name: "TypeScript",
    level: "Experiente",
    category: "Frontend",
  },
  {
    id: "5",
    name: "Next.js",
    level: "Proficiente",
    category: "Frontend",
  },
];

async function loadFromFile(filename: string) {
  try {
    const dataDir = path.join(process.cwd(), "data");
    await ensureDirectory(dataDir);

    const filePath = path.join(dataDir, filename);

    try {
      const fileData = await fs.readFile(filePath, "utf8");
      return JSON.parse(fileData);
    } catch (readError) {
      // Se o arquivo não existir, retorna null sem erro
      if ((readError as NodeJS.ErrnoException).code === "ENOENT") {
        return null;
      }
      throw readError;
    }
  } catch (error) {
    logger.error("skills-api", `Erro ao carregar arquivo ${filename}:`, error as Error);
    return null;
  }
}

export async function GET() {
  logger.info("skills-api", "Processing skills request");

  try {
    // Tentar carregar as skills do sistema de arquivos
    const skills = await loadFromFile("skills.json");

    if (skills) {
      logger.info("skills-api", "Skills carregadas com sucesso");
      return NextResponse.json(skills);
    }

    // Se não encontrar, retorna as skills padrão
    logger.info("skills-api", "Usando skills padrão");
    return NextResponse.json(defaultSkills);
  } catch (error) {
    logger.error("skills-api", "Failed to load skills", error as Error);
    return NextResponse.json(defaultSkills);
  }
}
