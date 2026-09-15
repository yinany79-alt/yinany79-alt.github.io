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
  let listOpen = false;
  const closeList = () => { if (listOpen) { html.push("</ul>"); listOpen = false; } };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { closeList(); continue; }
    if (line.startsWith("### ")) { closeList(); html.push(`<h3>${inline(line.slice(4))}</h3>`); }
    else if (line.startsWith("## ")) { closeList(); html.push(`<h2>${inline(line.slice(3))}</h2>`); }
    else if (line.startsWith("- ")) { if (!listOpen) { html.push("<ul>"); listOpen = true; } html.push(`<li>${inline(line.slice(2))}</li>`); }
    else { closeList(); html.push(`<p>${inline(line)}</p>`); }
  }
  closeList();
  return html.join("\n");
}
