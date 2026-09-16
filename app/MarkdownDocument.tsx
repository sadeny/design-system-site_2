import { Fragment, type ReactNode } from "react";

// Render authored Markdown as React nodes; raw HTML is never executed.
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
    if (part.startsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link && /^https?:\/\//.test(link[2])) return <a key={index} href={link[2]} target="_blank" rel="noreferrer">{link[1]}</a>;
    return part;
  });
}

function blocks(lines: string[]): ReactNode[] {
  const result: ReactNode[] = [];
  for (let i = 0; i < lines.length;) {
    const line = lines[i].trim();
    const key = i;
    if (!line || /^#{1,6}\s*$/.test(line) || /^---+$/.test(line)) { i++; continue; }
    if (line.startsWith("```")) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) code.push(lines[i++]);
      i++;
      result.push(<pre key={key}><code>{code.join("\n")}</code></pre>);
      continue;
    }
    const image = line.match(/^!\[([^\]]*)\]\((?:<)?([^)>]+)(?:>)?\)$/);
    if (image) {
      result.push(<figure className="markdown-figure" key={key}><img src={image[2]} alt={image[1]} />{lines[i + 1]?.trim().startsWith("*图") && <figcaption>{lines[++i].trim().replace(/^\*|\*$/g, "")}</figcaption>}</figure>);
      i++; continue;
    }
    if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const row = lines[i++].trim().replace(/^\||\|$/g, "").split("|").map(cell => cell.trim());
        if (!row.every(cell => /^:?-{3,}:?$/.test(cell))) rows.push(row);
      }
      result.push(<div className="markdown-table-wrap" key={key} tabIndex={0} role="region" aria-label="规范表格"><table><thead><tr>{rows[0]?.map((cell, j) => <th key={j}>{inline(cell)}</th>)}</tr></thead><tbody>{rows.slice(1).map((row, j) => <tr key={j}>{row.map((cell, k) => <td key={k}>{inline(cell)}</td>)}</tr>)}</tbody></table></div>);
      continue;
    }
    const heading = line.match(/^(#{3,6})\s+(.+)/);
    if (heading) {
      const Heading = `h${heading[1].length}` as "h3" | "h4" | "h5" | "h6";
      result.push(<Heading key={key}>{inline(heading[2])}</Heading>); i++; continue;
    }
    if (/^[-*+]\s+|^\d+[.)]\s+/.test(line)) {
      const ordered = /^\d/.test(line);
      const entries: ReactNode[] = [];
      const pattern = ordered ? /^\d+[.)]\s+/ : /^[-*+]\s+/;
      while (i < lines.length && pattern.test(lines[i].trim())) entries.push(<li key={i}>{inline(lines[i++].trim().replace(pattern, ""))}</li>);
      result.push(ordered ? <ol key={key}>{entries}</ol> : <ul key={key}>{entries}</ul>);
      continue;
    }
    if (line.startsWith(">")) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) quote.push(lines[i++].trim().replace(/^>\s?/, ""));
      result.push(<blockquote key={key}>{quote.map((text, j) => <p key={j}>{inline(text)}</p>)}</blockquote>);
      continue;
    }
    const paragraph = [line]; i++;
    while (i < lines.length && lines[i].trim() && !/^(#{1,6}\s|\||>|```|!\[|[-*+]\s|\d+[.)]\s)/.test(lines[i].trim())) paragraph.push(lines[i++].trim());
    result.push(<p key={key}>{inline(paragraph.join(" "))}</p>);
  }
  return result;
}

export function MarkdownDocument({ source, language }: { source: string; language: "zh" | "en" }) {
  const sections: { title: string; lines: string[] }[] = [{ title: "", lines: [] }];
  let inCode = false;
  for (const line of source.split(/\r?\n/)) {
    if (line.startsWith("```")) inCode = !inCode;
    if (!inCode && /^#\s/.test(line)) continue;
    const heading = !inCode && line.match(/^##\s+(.+)/);
    if (heading) sections.push({ title: heading[1].replace(/^\d+[.、]?\s*/, ""), lines: [] });
    else sections[sections.length - 1].lines.push(line);
  }
  return <div className="module-document markdown-document">
    {language === "en" && <p className="markdown-language-note">This chapter is currently available in Chinese.</p>}
    {sections.map((section, index) => <Fragment key={index}>{section.title ? <section className="document-section"><div className="document-section-heading"><h2>{section.title}</h2></div><div className="markdown-body">{blocks(section.lines)}</div></section> : <div className="markdown-intro markdown-body">{blocks(section.lines)}</div>}</Fragment>)}
  </div>;
}
