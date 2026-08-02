import fs from "node:fs";
import path from "node:path";
import { buildResumeModels } from "./model";

function readJson(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readJsonDirectory(directoryPath: string): unknown[] {
  return fs
    .readdirSync(directoryPath)
    .filter((fileName) => fileName.endsWith(".json"))
    .sort()
    .map((fileName) => readJson(path.join(directoryPath, fileName)));
}

export function loadResumeModels(rootDirectory = process.cwd()) {
  const contentDirectory = path.join(rootDirectory, "content");
  const skillsData = readJson(
    path.join(contentDirectory, "skills", "skills.json"),
  ) as { skills_list?: unknown };

  return buildResumeModels({
    profile: readJson(path.join(contentDirectory, "profile", "profile.json")),
    experiences: readJsonDirectory(path.join(contentDirectory, "experience")),
    education: readJsonDirectory(path.join(contentDirectory, "education")),
    skills: skillsData.skills_list,
  });
}
