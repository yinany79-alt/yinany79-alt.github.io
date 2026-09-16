import "server-only";
import { z } from "zod";
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

const nonEmptyString = z.string().trim().min(1);
const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}, "Invalid calendar date");

const projectSchema = z.object({
  slug: slugSchema,
  title: nonEmptyString,
  eyebrow: nonEmptyString,
  summary: nonEmptyString,
  role: nonEmptyString,
  period: nonEmptyString,
  tags: z.array(nonEmptyString).min(1),
  outcomes: z.array(nonEmptyString).min(1),
  order: z.number().int().positive(),
});

const postSchema = z.object({
  slug: slugSchema,
  title: nonEmptyString,
  summary: nonEmptyString,
  topic: nonEmptyString,
  tags: z.array(nonEmptyString).min(1),
  publishedAt: isoDateSchema,
  readingMinutes: z.number().int().positive(),
  draft: z.boolean(),
});

function parseValue(value: string): string | number | boolean | string[] {
  const raw = value.trim();
  if (raw === "true") return true;
  if (raw === "false") return false;
  if (/^\d+$/.test(raw)) return Number(raw);
  if (raw.startsWith("[") && raw.endsWith("]")) {
    return raw.slice(1, -1).split(",").map((item) => item.trim().replace(/^['"]|['"]$/g, "")).filter(Boolean);
  }
  return raw.replace(/^['"]|['"]$/g, "");
}

function parseSource(source: string, sourceName: string) {
  const normalized = source.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`Invalid frontmatter: ${sourceName}`);
  const data: Record<string, string | number | boolean | string[]> = {};
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim();
    if (Object.hasOwn(data, key)) throw new Error(`Duplicate frontmatter key ${key}: ${sourceName}`);
    data[key] = parseValue(line.slice(separator + 1));
  }
  const body = match[2].trim();
  if (!body) throw new Error(`Empty content body: ${sourceName}`);
  return { data, body };
}

function assertSlugMatchesFile(file: string, slug: string) {
  const stem = file.split("/").at(-1)?.replace(/\.mdx$/, "");
  if (stem !== slug) throw new Error(`Slug ${slug} does not match filename ${stem}`);
}

export function getProjects(): ProjectRecord[] {
  const projects = Object.entries(projectSources).map(([file, source]) => {
    const { data, body } = parseSource(source, file);
    const record = projectSchema.parse(data);
    assertSlugMatchesFile(file, record.slug);
    return { ...record, body };
  });
  const orders = new Set(projects.map((project) => project.order));
  if (orders.size !== projects.length) throw new Error("Project order must be unique");
  return projects.sort((a, b) => a.order - b.order);
}

export function getProject(slug: string) { return getProjects().find((item) => item.slug === slug); }

export function getPosts(): PostRecord[] {
  return Object.entries(postSources).map(([file, source]) => {
    const { data, body } = parseSource(source, file);
    const record = postSchema.parse(data);
    assertSlugMatchesFile(file, record.slug);
    return { ...record, body };
  }).filter((item) => !item.draft).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPost(slug: string) { return getPosts().find((item) => item.slug === slug); }
