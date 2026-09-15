import Link from "next/link";
import type { PostRecord } from "@/lib/content-types";

export function PostList({ posts }: { posts: PostRecord[] }) {
  return <section className="record-list">{posts.map((post) => <Link className="record-row" href={`/writing/${post.slug}`} key={post.slug} prefetch={false}><span className="record-index">{post.publishedAt.slice(5).replace("-", "/")}</span><span className="record-main"><small>{post.topic} / {post.readingMinutes} MIN</small><strong>{post.title}</strong><span>{post.summary}</span></span><span className="record-arrow" aria-hidden="true">↗</span></Link>)}</section>;
}
