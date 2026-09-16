import { notFound } from "next/navigation";
import { ContentShell } from "@/components/content-shell";
import { MarkdownContent } from "@/components/markdown-content";
import { getProject, getProjects } from "@/lib/content";

export function generateStaticParams() { return getProjects().map(({ slug }) => ({ slug })); }

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return <ContentShell section={`重点项目 · ${String(project.order).padStart(2, "0")}`} title={project.title} intro={project.summary}><div className="project-meta"><div><small>我的职责</small><span>{project.role}</span></div><div><small>项目周期</small><span>{project.period}</span></div></div><div className="tag-line">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><section className="outcome-strip">{project.outcomes.map((item) => <div key={item}>{item}</div>)}</section><MarkdownContent source={project.body} /></ContentShell>;
}
