import { notFound } from "next/navigation";
import { ContentShell } from "@/components/content-shell";
import { MarkdownContent } from "@/components/markdown-content";
import { getPost, getPosts } from "@/lib/content";

export function generateStaticParams() { return getPosts().map(({ slug }) => ({ slug })); }

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  return <ContentShell section="技术文章" title={post.title} intro={post.summary} density="article"><div className="article-meta"><span>{post.publishedAt}</span><span>约 {post.readingMinutes} 分钟</span></div><MarkdownContent source={post.body} /></ContentShell>;
}
