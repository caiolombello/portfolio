
import { loadPosts } from "./lib/server/files";

console.log("Loading posts...");
const posts = loadPosts();
console.log(JSON.stringify(posts, null, 2));
