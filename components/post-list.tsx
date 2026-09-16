import type { PostSummary } from "@/lib/content-types";

export function PostList({ posts, variant = "archive" }: { posts: PostSummary[]; variant?: "archive" | "compact" }) {
  if (!posts.length) return <p className="post-empty">这个标签下暂时没有文章。</p>;
  return <section className="post-list" data-variant={variant}>{posts.map((post) => <article className="post-row" key={post.slug}><time dateTime={post.publishedAt}>{post.publishedAt.replaceAll("-", ".")}</time><div className="post-main"><span className="post-topic">{post.topic}</span><h2><a href={`/writing/${post.slug}`}>{post.title}</a></h2><p className="post-summary">{post.summary}</p><div className="post-tags" aria-label="文章标签">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><span className="post-reading">约 {post.readingMinutes} 分钟</span></article>)}</section>;
}
