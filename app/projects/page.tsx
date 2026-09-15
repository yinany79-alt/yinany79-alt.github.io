import { ContentShell } from "@/components/content-shell";
import { ProjectList } from "@/components/project-list";
import { getProjects } from "@/lib/content";

export default function ProjectsPage() {
  return <ContentShell eyebrow="SELECTED WORK / 03" title="把复杂系统，变成可运行的产品" intro="我的工作介于产品、算法工程和平台架构之间。这里不只记录交付，也记录问题如何被定义。"><ProjectList projects={getProjects()} /></ContentShell>;
}
