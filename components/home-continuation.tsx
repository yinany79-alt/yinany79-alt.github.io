import { siteProfile, workstreams } from "@/content/site";
import { getPosts, getProjects } from "@/lib/content";
import { CurrentWork } from "./current-work";
import { PostList } from "./post-list";
import { ProjectList } from "./project-list";
import { Reveal } from "./reveal";

export function HomeContinuation() {
  const projects = getProjects();
  const posts = getPosts();
  return <div className="home-continuation" id="archive"><Reveal><CurrentWork items={workstreams} /></Reveal><Reveal delay={50}><section className="home-section" aria-labelledby="featured-projects-title"><div className="section-heading"><h2 id="featured-projects-title">重点项目</h2><a href="/projects">查看全部 ↗</a></div><div className="home-projects"><ProjectList projects={projects.slice(0, 3)} variant="home" /></div></section></Reveal><Reveal delay={50}><section className="home-section" aria-labelledby="latest-posts-title"><div className="section-heading"><h2 id="latest-posts-title">最近文章</h2><a href="/writing">进入文章空间 ↗</a></div><div className="home-posts"><PostList posts={posts.slice(0, 6)} variant="compact" /></div></section></Reveal><Reveal><section className="home-profile-footer" aria-label="经历与联系"><div><span>教育经历</span><strong>北京大学 · 信息管理系</strong><p>信息管理与信息系统</p></div><div><span>个人资料</span><strong>双页中文简历</strong><a href={siteProfile.resumeHref}>查看与下载 ↗</a></div><div><span>保持联系</span><strong>GitHub</strong><a href={siteProfile.github} target="_blank" rel="noreferrer">yinany79-alt ↗</a></div></section></Reveal></div>;
}
