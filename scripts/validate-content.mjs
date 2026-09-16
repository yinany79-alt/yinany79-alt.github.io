import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const collections = ["projects", "posts"];
const required = {
  projects: ["title", "slug", "summary", "order"],
  posts: ["title", "slug", "summary", "publishedAt", "topic", "readingMinutes", "tags", "draft"],
};
const placeholders = /(?:TODO|TBD|example\.com|your@email|placeholder)/i;
let validatedCount = 0;

for (const collection of collections) {
  const seen = new Set();
  const orders = new Set();
  const folder = path.join(projectRoot, "content", collection);
  for (const name of fs.readdirSync(folder).filter((item) => item.endsWith(".mdx"))) {
    const source = fs.readFileSync(path.join(folder, name), "utf8");
    const frontmatter = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!frontmatter) throw new Error(`${collection}/${name}: 缺少有效 frontmatter`);
    const keyList = frontmatter[1].split("\n").map((line) => line.split(":", 1)[0].trim()).filter(Boolean);
    const keys = new Set(keyList);
    if (keys.size !== keyList.length) throw new Error(`${collection}/${name}: frontmatter 字段重复`);
    for (const key of required[collection]) {
      if (!keys.has(key)) throw new Error(`${collection}/${name}: 缺少字段 ${key}`);
    }
    const slug = frontmatter[1].match(/^slug:\s*(.+)$/m)?.[1]?.trim();
    const stem = name.replace(/\.mdx$/, "");
    if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug !== stem || seen.has(slug)) {
      throw new Error(`${collection}/${name}: slug 非法、与文件名不一致或重复`);
    }
    seen.add(slug);
    if (collection === "posts") {
      const date = frontmatter[1].match(/^publishedAt:\s*(.+)$/m)?.[1]?.trim();
      const tags = frontmatter[1].match(/^tags:\s*\[(.*)\]$/m)?.[1]?.trim();
      const readingMinutes = Number(frontmatter[1].match(/^readingMinutes:\s*(.+)$/m)?.[1]?.trim());
      const draft = frontmatter[1].match(/^draft:\s*(.+)$/m)?.[1]?.trim();
      const parsedDate = date ? new Date(`${date}T00:00:00Z`) : null;
      if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !parsedDate || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) {
        throw new Error(`${collection}/${name}: publishedAt 必须是 YYYY-MM-DD`);
      }
      if (!tags) throw new Error(`${collection}/${name}: tags 必须是非空数组`);
      if (!Number.isInteger(readingMinutes) || readingMinutes <= 0) throw new Error(`${collection}/${name}: readingMinutes 必须是正整数`);
      if (draft !== "true" && draft !== "false") throw new Error(`${collection}/${name}: draft 必须是 true 或 false`);
    } else {
      const order = Number(frontmatter[1].match(/^order:\s*(.+)$/m)?.[1]?.trim());
      if (!Number.isInteger(order) || order <= 0 || orders.has(order)) throw new Error(`${collection}/${name}: order 必须是唯一正整数`);
      orders.add(order);
    }
    if (!frontmatter[2].trim()) throw new Error(`${collection}/${name}: 正文不能为空`);
    if (placeholders.test(source)) throw new Error(`${collection}/${name}: 包含占位内容`);
    validatedCount += 1;
  }
}

const pdf = path.join(projectRoot, "public", "resume", "yang-yinan-resume.pdf");
if (!fs.existsSync(pdf) || fs.readFileSync(pdf).subarray(0, 4).toString() !== "%PDF") {
  throw new Error("简历 PDF 缺失或格式无效");
}
console.log(`内容校验通过：${validatedCount} 篇项目/文章，简历 PDF 有效。`);
