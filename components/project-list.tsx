import type { ProjectRecord } from "@/lib/content-types";

export function ProjectList({ projects, variant = "archive" }: { projects: ProjectRecord[]; variant?: "archive" | "home" }) {
  return <section className="record-list" data-variant={variant}>{projects.map((project) => <a className="record-row" data-order={project.order} href={`/projects/${project.slug}`} key={project.slug}>
    <span className="record-index">{String(project.order).padStart(2, "0")}</span>
    <span className="record-main"><small>{project.eyebrow.split(" / ").at(-1)}</small><strong>{project.title}</strong><span>{project.summary}</span><span className="record-role">{project.role}</span><span className="record-tags">{project.tags.slice(0, 4).map((tag) => <i key={tag}>{tag}</i>)}</span></span>
    <span className="record-results"><small>阶段交付</small>{project.outcomes.slice(0, 2).map((item) => <span key={item}>{item}</span>)}<span className="record-explore">阅读项目 <span aria-hidden="true">↗</span></span></span>
  </a>)}</section>;
}
