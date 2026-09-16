import { ContentShell } from "@/components/content-shell";
import { ProjectList } from "@/components/project-list";
import { getProjects } from "@/lib/content";

export default function ProjectsPage() {
  return <ContentShell section="重点项目" title="把复杂系统变成可运行的产品" intro="我的工作介于产品、算法工程和平台架构之间。这里不只记录交付，也记录问题如何被定义。"><ProjectList projects={getProjects()} /></ContentShell>;
}
