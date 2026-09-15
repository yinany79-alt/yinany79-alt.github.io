import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const collections = ["projects", "posts"];
const required = {
  projects: ["title", "slug", "summary", "order"],
  posts: ["title", "slug", "summary", "publishedAt"],
};
const seen = new Set();
const placeholders = /(?:TODO|TBD|example\.com|your@email|placeholder)/i;

for (const collection of collections) {
  const folder = path.join(projectRoot, "content", collection);
  for (const name of fs.readdirSync(folder).filter((item) => item.endsWith(".mdx"))) {
    const source = fs.readFileSync(path.join(folder, name), "utf8");
    const frontmatter = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!frontmatter) throw new Error(`${collection}/${name}: 缺少有效 frontmatter`);
    const keys = new Set(frontmatter[1].split("\n").map((line) => line.split(":", 1)[0].trim()));
    for (const key of required[collection]) {
      if (!keys.has(key)) throw new Error(`${collection}/${name}: 缺少字段 ${key}`);
    }
    const slug = frontmatter[1].match(/^slug:\s*(.+)$/m)?.[1]?.trim();
    if (!slug || seen.has(slug)) throw new Error(`${collection}/${name}: slug 为空或重复`);
    seen.add(slug);
    if (placeholders.test(source)) throw new Error(`${collection}/${name}: 包含占位内容`);
  }
}

const pdf = path.join(projectRoot, "public", "resume", "yang-yinan-resume.pdf");
if (!fs.existsSync(pdf) || fs.readFileSync(pdf).subarray(0, 4).toString() !== "%PDF") {
  throw new Error("简历 PDF 缺失或格式无效");
}
console.log(`内容校验通过：${seen.size} 篇项目/文章，简历 PDF 有效。`);

