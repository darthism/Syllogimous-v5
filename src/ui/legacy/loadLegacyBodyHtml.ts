import { readFileSync } from "node:fs";
import path from "node:path";

function extractBody(html: string): string {
  const bodyOpen = html.indexOf("<body");
  if (bodyOpen < 0) throw new Error("Legacy HTML missing <body>");
  const bodyStart = html.indexOf(">", bodyOpen);
  const bodyClose = html.lastIndexOf("</body>");
  if (bodyStart < 0 || bodyClose < 0) throw new Error("Legacy HTML missing </body>");
  return html.slice(bodyStart + 1, bodyClose);
}

function stripScripts(html: string): string {
  // We boot logic via bundled TS, not via <script src="..."> tags.
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
}

export function loadLegacyBodyHtml(): string {
  const legacyPath = path.join(process.cwd(), "legacy", "index.html");
  const html = readFileSync(legacyPath, "utf8");
  return stripScripts(extractBody(html));
}


