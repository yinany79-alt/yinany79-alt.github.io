import "server-only";
import type { PostRecord, ProjectRecord } from "./content-types";

const projectSources = import.meta.glob("../content/projects/*.mdx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const postSources = import.meta.glob("../content/posts/*.mdx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function parseValue(value: string): string | number | boolean | string[] {
  const raw = value.trim();
  if (raw === "true") return true;
  if (raw === "false") return false;
  if (/^\d+$/.test(raw)) return Number(raw);
  if (raw.startsWith("[") && raw.endsWith("]")) return raw.slice(1, -1).split(",").map((item) => item.trim()).filter(Boolean);
  return raw.replace(/^['"]|['"]$/g, "");
}

function parseSource(source: string, sourceName: string) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`Invalid frontmatter: ${sourceName}`);
  const data: Record<string, string | number | boolean | string[]> = {};
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    data[line.slice(0, separator).trim()] = parseValue(line.slice(separator + 1));
  }
  return { data, body: match[2].trim() };
}

export function getProjects(): ProjectRecord[] {
  return Object.entries(projectSources).map(([file, source]) => {
    const { data, body } = parseSource(source, file);
    return { ...data, body } as ProjectRecord;
  }).sort((a, b) => a.order - b.order);
}

export function getProject(slug: string) { return getProjects().find((item) => item.slug === slug); }

export function getPosts(): PostRecord[] {
  return Object.entries(postSources).map(([file, source]) => {
    const { data, body } = parseSource(source, file);
    return { ...data, body } as PostRecord;
  }).filter((item) => !item.draft).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPost(slug: string) { return getPosts().find((item) => item.slug === slug); }
