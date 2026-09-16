"use client";

import { useMemo, useState } from "react";
import type { PostSummary } from "@/lib/content-types";
import { PostList } from "./post-list";

export function PostFilter({ posts, tags }: { posts: PostSummary[]; tags: string[] }) {
  const [active, setActive] = useState("全部");
  const visible = useMemo(() => active === "全部" ? posts : posts.filter((post) => post.tags.includes(active)), [active, posts]);
  return <div className="post-archive"><div className="post-filter" role="group" aria-label="按标签筛选文章"><button type="button" aria-pressed={active === "全部"} onClick={() => setActive("全部")}>全部 <span>{posts.length}</span></button>{tags.map((tag) => <button type="button" aria-pressed={active === tag} onClick={() => setActive(tag)} key={tag}>{tag} <span>{posts.filter((post) => post.tags.includes(tag)).length}</span></button>)}</div><p className="post-count" aria-live="polite">当前显示 {visible.length} 篇文章</p><PostList posts={visible} /></div>;
}
