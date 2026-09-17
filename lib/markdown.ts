const escapeHtml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function inline(value: string) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

export function renderMarkdown(source: string) {
  const lines = source.split("\n");
  const html: string[] = [];
  let listTag: "ul" | "ol" | null = null;
  let codeLines: string[] | null = null;
  const closeList = () => { if (listTag) { html.push(`</${listTag}>`); listTag = null; } };
  const openList = (tag: "ul" | "ol") => {
    if (listTag === tag) return;
    closeList();
    html.push(`<${tag}>`);
    listTag = tag;
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (codeLines) {
      if (line.startsWith("```")) {
        html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        codeLines = null;
      } else codeLines.push(raw);
      continue;
    }
    if (line.startsWith("```")) { closeList(); codeLines = []; continue; }
    if (!line) { closeList(); continue; }
    if (line.startsWith("### ")) { closeList(); html.push(`<h3>${inline(line.slice(4))}</h3>`); }
    else if (line.startsWith("## ")) { closeList(); html.push(`<h2>${inline(line.slice(3))}</h2>`); }
    else if (/^---+$/.test(line)) { closeList(); html.push("<hr />"); }
    else if (line.startsWith("> ")) { closeList(); html.push(`<blockquote>${inline(line.slice(2))}</blockquote>`); }
    else if (line.startsWith("- ")) { openList("ul"); html.push(`<li>${inline(line.slice(2))}</li>`); }
    else if (/^\d+\.\s+/.test(line)) { openList("ol"); html.push(`<li>${inline(line.replace(/^\d+\.\s+/, ""))}</li>`); }
    else { closeList(); html.push(`<p>${inline(line)}</p>`); }
  }
  if (codeLines) html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
  closeList();
  return html.join("\n");
}
