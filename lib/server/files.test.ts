import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { loadPostsFromDirectory } from "./files";

const temporaryDirectories: string[] = [];

function createPostsDirectory(): string {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-posts-"));
  temporaryDirectories.push(directory);
  return directory;
}

function writePost(
  directory: string,
  filename: string,
  {
    date = "2026-08-01",
    description = "A test post",
    published = true,
  }: { date?: string; description?: string | null; published?: boolean } = {},
) {
  fs.writeFileSync(
    path.join(directory, filename),
    `---
title: "Test post"
date: "${date}"
${description === null ? "" : `description: "${description}"`}
author: "Caio Barbieri"
category: "Kubernetes"
tags: ["Kubernetes"]
published: ${published}
---

## Content
`,
  );
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { force: true, recursive: true });
  }
});

describe("loadPostsFromDirectory", () => {
  it("does not publish a bilingual draft", () => {
    const directory = createPostsDirectory();
    writePost(directory, "draft.en.md", { published: false });
    writePost(directory, "draft.pt.md", { published: false });

    expect(loadPostsFromDirectory(directory)).toEqual([]);
  });

  it("rejects a published post without both translations", () => {
    const directory = createPostsDirectory();
    writePost(directory, "single-language.en.md");

    expect(() => loadPostsFromDirectory(directory)).toThrow(
      /single-language.*translation/i,
    );
  });

  it("rejects invalid publication dates", () => {
    const directory = createPostsDirectory();
    writePost(directory, "invalid-date.en.md", { date: "2026-02-31" });
    writePost(directory, "invalid-date.pt.md", { date: "2026-02-31" });

    expect(() => loadPostsFromDirectory(directory)).toThrow(/invalid blog date/i);
  });

  it("rejects post filenames without a supported locale", () => {
    const directory = createPostsDirectory();
    writePost(directory, "wrong.fr.md");

    expect(() => loadPostsFromDirectory(directory)).toThrow(
      /invalid post filename.*wrong\.fr\.md/i,
    );
  });

  it("rejects translations with inconsistent publication metadata", () => {
    const directory = createPostsDirectory();
    writePost(directory, "inconsistent.en.md", { date: "2026-08-01" });
    writePost(directory, "inconsistent.pt.md", { date: "2026-08-02" });

    expect(() => loadPostsFromDirectory(directory)).toThrow(
      /inconsistent.*publication metadata/i,
    );
  });

  it("rejects a published post with incomplete frontmatter", () => {
    const directory = createPostsDirectory();
    writePost(directory, "incomplete.en.md", { description: null });
    writePost(directory, "incomplete.pt.md", { description: null });

    expect(() => loadPostsFromDirectory(directory)).toThrow(
      /incomplete.*frontmatter/i,
    );
  });

  it("rejects translations with inconsistent publication state", () => {
    const directory = createPostsDirectory();
    writePost(directory, "mixed-state.en.md", { published: false });
    writePost(directory, "mixed-state.pt.md", { published: true });

    expect(() => loadPostsFromDirectory(directory)).toThrow(
      /mixed-state.*publication state/i,
    );
  });

  it("fails loudly when the posts directory is missing", () => {
    const parent = createPostsDirectory();
    const missingDirectory = path.join(parent, "missing");

    expect(() => loadPostsFromDirectory(missingDirectory)).toThrow(
      /posts directory.*missing/i,
    );
  });
});
