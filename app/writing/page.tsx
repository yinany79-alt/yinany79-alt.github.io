import { ContentShell } from "@/components/content-shell";
import { PostList } from "@/components/post-list";
import { getPosts } from "@/lib/content";

export default function WritingPage() {
  return <ContentShell eyebrow="TECHNICAL NOTES" title="记录我如何理解技术与产品" intro="这些文章从真实工作中的问题出发，关心数据、系统、评测和长期演进。"><PostList posts={getPosts()} /></ContentShell>;
}
