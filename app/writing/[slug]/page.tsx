import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentShell } from "@/components/content-shell";
import { MarkdownContent } from "@/components/markdown-content";
import { getPost, getPosts } from "@/lib/content";

export function generateStaticParams() { return getPosts().map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPost((await params).slug);
  return post ? { title: `${post.title} · 杨弋南`, description: post.summary } : {};
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  return <ContentShell section="技术文章" title={post.title} intro={post.summary} density="article"><div className="article-meta"><span>{post.publishedAt}</span><span>约 {post.readingMinutes} 分钟</span>{post.tags.map((tag) => <span className="article-tag" key={tag}>{tag}</span>)}</div><MarkdownContent source={post.body} /></ContentShell>;
}
