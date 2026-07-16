import { readFile, readdir } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const docs = join(root, "book/online-book/src");
const markdownFiles = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (entry.name.endsWith(".md")) markdownFiles.push(path);
  }
}

await walk(docs);
const routes = new Set(
  markdownFiles.map(
    (file) =>
      `/${relative(docs, file)
        .replace(/\\/g, "/")
        .replace(/(?:index)?\.md$/, "")}`,
  ),
);
routes.add("/");
const failures = [];

for (const file of markdownFiles) {
  const source = await readFile(file, "utf8");
  for (const match of source.matchAll(
    /\[[^\]]*\]\((\/[^)#?\s]+)(?:#[^)]+)?\)/g,
  )) {
    const target = match[1].replace(/\/$/, "") || "/";
    if (!routes.has(target))
      failures.push(`${relative(root, file)} -> ${target}`);
  }
}

if (failures.length) {
  console.error(`Broken internal links:\n${failures.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(`Checked ${markdownFiles.length} Markdown files.`);
}
