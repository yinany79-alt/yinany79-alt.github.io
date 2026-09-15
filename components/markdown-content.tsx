import { renderMarkdown } from "@/lib/markdown";

export function MarkdownContent({ source }: { source: string }) {
  return <article className="prose-tech" dangerouslySetInnerHTML={{ __html: renderMarkdown(source) }} />;
}
