import { experiences, siteProfile } from "@/content/site";
import { getPosts, getProjects } from "@/lib/content";
import { ExperienceList } from "./experience-list";
import { PostList } from "./post-list";
import { ProjectList } from "./project-list";
import { Reveal } from "./reveal";

export function HomeContinuation() {
  const projects = getProjects();
  const posts = getPosts();
  return <div className="home-continuation" id="archive">
    <Reveal><section className="home-section" id="current-work" aria-labelledby="featured-projects-title">
      <div className="section-heading"><h2 id="featured-projects-title">实践档案</h2><span>三个正在推进的方向</span></div>
      <div className="section-introduction"><p>从平台能力，到 Agent 产品。</p><span>记录问题、我的工作，以及可以复核的结果。</span></div>
      <ProjectList projects={projects.slice(0, 3)} variant="home" />
    </section></Reveal>
    <Reveal><section className="thinking-strip" aria-label="我的产品判断">
      <p>一些始终在用的判断</p>
      <div><span>01</span><h2>先走通，再抽象。</h2><p>亲自经历一次训练、部署和评测，才能知道产品该替用户省掉什么。</p></div>
      <div><span>02</span><h2>把失败变成反馈。</h2><p>记录证据、复盘决策，让每一个 Bad Case 都能进入下一轮验证。</p></div>
      <div><span>03</span><h2>让复杂度留在系统里。</h2><p>用稳定的能力、清晰的状态和合适的确认，换取用户更简单的操作。</p></div>
    </section></Reveal>
    <Reveal><section className="home-section" aria-labelledby="latest-posts-title"><div className="section-heading"><h2 id="latest-posts-title">写作与思考</h2><a href="/writing">全部文章 ↗</a></div><div className="home-posts"><PostList posts={posts.slice(0, 6)} variant="compact" /></div></section></Reveal>
    <Reveal><section className="home-section home-experience" aria-labelledby="experience-title"><div className="section-heading"><h2 id="experience-title">关于这位构建者</h2><a href="/about">认识我 ↗</a></div><ExperienceList items={experiences} compact /><div className="profile-actions"><a href="/resume">阅读简历 ↗</a><a href={siteProfile.resumeHref} download>下载双页 PDF ↗</a></div></section></Reveal>
  </div>;
}
