import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { ensureDirectory } from "@/lib/ensure-directory";
import { logger } from "@/lib/logger";

// Função simplificada para carregar do sistema de arquivos
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
    console.error(`Erro ao carregar arquivo ${filename}:`, error);
    return null;
  }
}

// Dados padrão para usar como fallback
const defaultProfileData = {
  name: "Caio Barbieri",
  title: "DevOps Engineer",
  email: "caio@lombello.com",
  location: "São Paulo, Brasil",
  bio: "DevOps Engineer com experiência em Cloud Native, Kubernetes e automação de infraestrutura.",
  avatar: "/placeholder.svg?height=300&width=300",
  social: [
    {
      name: "GitHub",
      url: "https://github.com/caiolombelllo",
      icon: "github",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/caiolvbarbieri",
      icon: "linkedin",
    },
  ],
};

export async function GET() {
  try {
    // Tenta carregar do sistema de arquivos local
    const profileData = await loadFromFile("profile.json");

    // Se encontrou dados, retorna-os
    if (profileData) {
      return NextResponse.json(profileData);
    }

    // Caso contrário, retorna dados padrão
    logger.info("profile", "Usando dados padrão para o perfil");
    return NextResponse.json(defaultProfileData);
  } catch (error) {
    logger.error("profile", "Erro ao processar a requisição de perfil:", error as Error);
    // Em caso de erro, retorna dados padrão com status 200 em vez de 500
    return NextResponse.json(defaultProfileData);
  }
}
