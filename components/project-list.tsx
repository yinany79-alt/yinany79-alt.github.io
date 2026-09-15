import Link from "next/link";
import type { ProjectRecord } from "@/lib/content-types";

export function ProjectList({ projects }: { projects: ProjectRecord[] }) {
  return <section className="record-list">{projects.map((project) => <Link className="record-row" href={`/projects/${project.slug}`} key={project.slug}><span className="record-index">{String(project.order).padStart(2, "0")}</span><span className="record-main"><small>{project.eyebrow}</small><strong>{project.title}</strong><span>{project.summary}</span></span><span className="record-arrow" aria-hidden="true">↗</span></Link>)}</section>;
}
