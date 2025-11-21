
import { loadPosts } from "./lib/server/files";
import fs from "fs";
import path from "path";

const postsDir = path.join(process.cwd(), "content/posts");

// Create invalid files for testing
// Ensure directory exists first (loadPosts does it, but we need it for write)
if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir, { recursive: true });

fs.writeFileSync(path.join(postsDir, "empty.md"), "");
fs.writeFileSync(path.join(postsDir, "bad-date.md"), "---\ntitle: Bad Date\ndate: invalid-date\n---\nContent");
fs.writeFileSync(path.join(postsDir, "no-title.md"), "---\ndate: 2024-01-01\n---\nContent");
fs.writeFileSync(path.join(postsDir, "bad-frontmatter.md"), "---\ntitle: Bad FM\ndate: 2024-01-01\n: invalid\n---\nContent");

console.log("--- Loading Posts (Expect filtering) ---");
const posts = loadPosts();
console.log(JSON.stringify(posts, null, 2));

// Cleanup
try {
  fs.unlinkSync(path.join(postsDir, "empty.md"));
  fs.unlinkSync(path.join(postsDir, "bad-date.md"));
  fs.unlinkSync(path.join(postsDir, "no-title.md"));
  fs.unlinkSync(path.join(postsDir, "bad-frontmatter.md"));
} catch (e) {
  console.error("Error cleaning up:", e);
}
