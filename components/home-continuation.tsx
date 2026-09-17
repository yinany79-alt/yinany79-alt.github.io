import { experiences, siteProfile, workstreams } from "@/content/site";
import { getPosts, getProjects } from "@/lib/content";
import { CurrentWork } from "./current-work";
import { ExperienceList } from "./experience-list";
import { PostList } from "./post-list";
import { ProjectList } from "./project-list";
import { Reveal } from "./reveal";

export function HomeContinuation() {
  const projects = getProjects();
  const posts = getPosts();
  return <div className="home-continuation" id="archive"><Reveal><CurrentWork items={workstreams} /></Reveal><Reveal delay={50}><section className="home-section" aria-labelledby="featured-projects-title"><div className="section-heading"><h2 id="featured-projects-title">重点项目</h2><a href="/projects">查看全部 ↗</a></div><div className="home-projects"><ProjectList projects={projects.slice(0, 3)} variant="home" /></div></section></Reveal><Reveal delay={50}><section className="home-section" aria-labelledby="latest-posts-title"><div className="section-heading"><h2 id="latest-posts-title">最近文章</h2><a href="/writing">进入文章空间 ↗</a></div><div className="home-posts"><PostList posts={posts.slice(0, 6)} variant="compact" /></div></section></Reveal><Reveal><section className="home-section home-experience" aria-labelledby="experience-title"><div className="section-heading"><h2 id="experience-title">经历</h2><span>工作与教育</span></div><ExperienceList items={experiences} compact /><div className="profile-actions"><a href={siteProfile.resumeHref}>查看与下载简历 ↗</a><a href={siteProfile.github} target="_blank" rel="noreferrer">GitHub ↗</a></div></section></Reveal></div>;
}
