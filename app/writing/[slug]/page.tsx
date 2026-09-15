import { notFound } from "next/navigation";
import { ContentShell } from "@/components/content-shell";
import { MarkdownContent } from "@/components/markdown-content";
import { getPost, getPosts } from "@/lib/content";

export function generateStaticParams() { return getPosts().map(({ slug }) => ({ slug })); }

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  return <ContentShell eyebrow={`${post.topic.toUpperCase()} / TECHNICAL NOTE`} title={post.title} intro={post.summary}><div className="article-meta"><span>{post.publishedAt}</span><span>{post.readingMinutes} MIN READ</span></div><MarkdownContent source={post.body} /></ContentShell>;
}
