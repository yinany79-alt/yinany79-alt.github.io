import { getPosts, getProjects } from "@/lib/content";
import { PostList } from "./post-list";
import { ProjectList } from "./project-list";

export function HomeContinuation() {
  const projects = getProjects();
  const posts = getPosts();
  return <div className="home-continuation" id="archive"><section className="home-manifesto"><p className="content-eyebrow">OPERATING PRINCIPLES</p><h2>智能系统的价值，<br />发生在模型之外。</h2><p>数据是否可理解，工具是否可信，任务是否可恢复，决策是否可评测。我希望把这些看似隐形的基础条件，做成人和 Agent 都能使用的产品。</p></section><section className="home-section"><div className="section-heading"><span>SELECTED WORK</span><a href="/projects">全部项目 ↗</a></div><ProjectList projects={projects} /></section><section className="home-section"><div className="section-heading"><span>LATEST NOTES</span><a href="/writing">全部文章 ↗</a></div><PostList posts={posts} /></section></div>;
}
