const escapeHtml = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const inlinePattern = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^\s)]+\))/g;

function inline(value: string) {
  return value.split(inlinePattern).map((part) => {
    if (part.startsWith("`") && part.endsWith("`")) return `<code>${escapeHtml(part.slice(1, -1))}</code>`;
    if (part.startsWith("**") && part.endsWith("**")) return `<strong>${escapeHtml(part.slice(2, -2))}</strong>`;
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (link) {
      try {
        const url = new URL(link[2]);
        if (url.protocol !== "http:" && url.protocol !== "https:") return escapeHtml(part);
        return `<a href="${escapeHtml(url.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link[1])}</a>`;
      } catch {
        return escapeHtml(part);
      }
    }
    return escapeHtml(part);
  }).join("");
}

export function renderMarkdown(source: string) {
  const lines = source.split("\n");
  const html: string[] = [];
  let listTag: "ul" | "ol" | null = null;
  let codeLines: string[] | null = null;
  let fenceChar = "";
  let fenceLength = 0;
  let quoteLines: string[] = [];
  const closeList = () => { if (listTag) { html.push(`</${listTag}>`); listTag = null; } };
  const closeQuote = () => {
    if (!quoteLines.length) return;
    html.push(`<blockquote><p>${quoteLines.map(inline).join("<br />")}</p></blockquote>`);
    quoteLines = [];
  };
  const closeBlocks = () => { closeList(); closeQuote(); };
  const openList = (tag: "ul" | "ol", start?: number) => {
    closeQuote();
    if (listTag === tag) return;
    closeList();
    html.push(tag === "ol" && start && start !== 1 ? `<ol start="${start}">` : `<${tag}>`);
    listTag = tag;
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (codeLines) {
      const closingFence = new RegExp(`^${fenceChar}{${fenceLength},}\\s*$`);
      if (closingFence.test(line)) {
        html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        codeLines = null;
      } else codeLines.push(raw);
      continue;
    }

    const openingFence = line.match(/^(`{3,}|~{3,})(.*)$/);
    if (openingFence) {
      closeBlocks();
      fenceChar = openingFence[1][0];
      fenceLength = openingFence[1].length;
      codeLines = [];
      continue;
    }
    if (!line) { closeBlocks(); continue; }
    if (line.startsWith("> ")) { closeList(); quoteLines.push(line.slice(2)); continue; }
    closeQuote();
    if (line.startsWith("### ")) { closeList(); html.push(`<h3>${inline(line.slice(4))}</h3>`); }
    else if (line.startsWith("## ")) { closeList(); html.push(`<h2>${inline(line.slice(3))}</h2>`); }
    else if (/^---+$/.test(line)) { closeList(); html.push("<hr />"); }
    else if (line.startsWith("- ")) { openList("ul"); html.push(`<li>${inline(line.slice(2))}</li>`); }
    else if (/^\d+\.\s+/.test(line)) {
      const start = Number.parseInt(line, 10);
      openList("ol", start);
      html.push(`<li>${inline(line.replace(/^\d+\.\s+/, ""))}</li>`);
    } else { closeList(); html.push(`<p>${inline(line)}</p>`); }
  }
  if (codeLines) html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
  closeBlocks();
  return html.join("\n");
}
