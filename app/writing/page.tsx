import { ContentShell } from "@/components/content-shell";
import { PostFilter } from "@/components/post-filter";
import { getPostSummaries, getPostTags } from "@/lib/content";

export default function WritingPage() {
  const posts = getPostSummaries();
  return <ContentShell section="文章归档" title="文章" intro="记录我对智能体系统、模型训练、数据与算法基础设施的理解，也保留真实实践中的判断与复盘。" density="compact"><PostFilter posts={posts} tags={getPostTags(posts)} /></ContentShell>;
}
