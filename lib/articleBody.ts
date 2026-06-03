function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatArticleBody(body?: string) {
  if (!body) {
    return "<p>本文は準備中です。</p>";
  }

  if (/<[a-z][\s\S]*>/i.test(body)) {
    return body;
  }

  return body
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("## ")) return `<h2>${escapeHtml(trimmed.replace(/^## /, ""))}</h2>`;
      if (trimmed.startsWith("# ")) return `<h2>${escapeHtml(trimmed.replace(/^# /, ""))}</h2>`;

      const lines = trimmed.split("\n").map((line) => line.trim()).filter(Boolean);
      if (lines.every((line) => line.startsWith("・") || line.startsWith("- "))) {
        return `<ul>${lines
          .map((line) => `<li>${escapeHtml(line.replace(/^・|- /, ""))}</li>`)
          .join("")}</ul>`;
      }

      return `<p>${escapeHtml(trimmed).replace(/\n/g, "<br>")}</p>`;
    })
    .join("");
}
