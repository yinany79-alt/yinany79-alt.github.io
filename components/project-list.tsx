import type { ProjectRecord } from "@/lib/content-types";

export function ProjectList({ projects, variant = "archive" }: { projects: ProjectRecord[]; variant?: "archive" | "home" }) {
  return <section className="record-list" data-variant={variant}>{projects.map((project) => <a className="record-row" href={`/projects/${project.slug}`} key={project.slug}><span className="record-index">{String(project.order).padStart(2, "0")}</span><span className="record-main"><small>{project.eyebrow}</small><strong>{project.title}</strong><span>{project.summary}</span>{variant === "home" && <><span className="record-role">我的职责 · {project.role}</span><span className="record-outcome">关键结果 · {project.outcomes[0]}</span><span className="record-tags">{project.tags.slice(0, 4).map((tag) => <i key={tag}>{tag}</i>)}</span></>}</span><span className="record-arrow" aria-hidden="true">↗</span></a>)}</section>;
}
