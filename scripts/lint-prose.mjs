// Prose linter for the site's text. Run: node scripts/lint-prose.mjs
// Checks data prose and page text against the style sheet on about.html#style.
// Exits 1 on any error, so new text cannot reintroduce the patterns below.
// To accept a flagged sentence on purpose, add `path|fragment` to scripts/lint-allow.txt.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ["sources", "taxonomy", "methods", "views", "extras", "people", "glossary", "content", "readings"])
  vm.runInContext(fs.readFileSync(path.join(root, "site/data", f + ".js"), "utf8"), ctx);
const H = ctx.window.HOD;
const allow = fs.existsSync(path.join(root, "scripts/lint-allow.txt"))
  ? fs.readFileSync(path.join(root, "scripts/lint-allow.txt"), "utf8").split("\n").filter((l) => l.trim() && !l.startsWith("#")).map((l) => l.split("|"))
  : [];

const SKIP = /^(id|cite|parents|views|steps|infl|methods|match|entry|m|see|family|telos|domain|region|view|src|tr|who|lang|when|native|name|term|by|status|t|text|quote)$/;
const items = [];
function walk(o, p) {
  if (typeof o === "string") { if (!SKIP.test(p.split(".").pop())) items.push([p, o]); return; }
  if (Array.isArray(o)) o.forEach((x, i) => walk(x, p + "." + i));
  else if (o && typeof o === "object") for (const k in o) walk(o[k], p + "." + k);
}
for (const k of ["teloi", "families", "domains", "methods", "views", "extras", "glossary", "paths", "gaps", "example", "readings"]) walk(H[k], k);
for (const f of fs.readdirSync(path.join(root, "site")).filter((f) => f.endsWith(".html"))) {
  const s = fs.readFileSync(path.join(root, "site", f), "utf8");
  const main = (s.match(/<main>([\s\S]*?)<\/main>/) || [, ""])[1].replace(/<script[\s\S]*?<\/script>/g, "").replace(/<(table|pre|select)[\s\S]*?<\/\1>/g, "");
  main.split(/<\/p>|<\/li>|<\/h\d>|<\/dd>|<\/div>/).forEach((para, i) => { const t = para.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(); if (t) items.push([`${f}#${i}`, t]); });
}

const BANNED = ["delve", "tapestry", "nuanced", "vibrant", "crucial", "pivotal", "robust", "landscape", "navigate", "navigating", "underscore", "underscores",
  "testament", "profound", "profoundly", "seamless", "realm", "foster", "leverage", "showcase", "highlights", "serves as", "utilize", "utilise",
  "demonstrate", "demonstrates", "in order to", "it is worth", "worth noting", "importantly", "moreover", "additionally", "furthermore", "ultimately",
  "essentially", "fundamentally", "truly", "genuinely", "deeply", "influential", "seminal", "landmark", "groundbreaking", "addresses", "explores",
  "not only", "more than just", "not merely", "at its core", "in essence", "a wide range", "plays a role", "key role"];
const banRe = new RegExp(`\\b(${BANNED.join("|").replace(/ /g, "\\s+")})\\b`, "i");
const hedgeRe = /\b(may|might|could|perhaps|arguably|possibly|somewhat|largely|probably|seems?)\b[^.]{0,50}\b(may|might|could|perhaps|arguably|possibly|somewhat|largely|probably|seems?)\b/i;
const quoted = (s) => s.replace(/‘[^’]*’|“[^”]*”/g, "Q");

let errors = 0, warns = 0;
const out = (lvl, p, msg, t) => {
  if (allow.some(([ap, frag]) => p.startsWith(ap) && t.includes(frag))) return;
  lvl === "error" ? errors++ : warns++;
  console.log(`${lvl.padEnd(5)} ${p}: ${msg}\n      ${t.slice(0, 160)}`);
};
for (const [p, s] of items) {
  const plain = s.replace(/<[^>]+>/g, "");
  const words = plain.split(/\s+/).length;
  if (words > 120) out("error", p, `paragraph of ${words} words (max 120)`, plain);
  for (const sent of plain.split(/(?<=[.!?’”])\s+(?=[A-Z‘“(])/)) {
    const q = quoted(sent), n = sent.split(/\s+/).length;
    const m = q.match(banRe); if (m) out("error", p, `banned: “${m[1]}”`, sent);
    if (/\w—\w|\s—\s/.test(q)) out("error", p, "em dash in running prose", sent);
    if (/\?/.test(q) && !/\.moves\.|^example\.|gaps\.\w+\.sketch/.test(p)) out("error", p, "rhetorical question", sent);
    if (hedgeRe.test(q)) out("warn", p, "stacked hedges", sent);
    if (n > 40) out("warn", p, `sentence of ${n} words`, sent);
    if (/\b(which|that)\b[^,.;]{0,60}\b(which|that)\b[^,.;]{0,60}\b(which|that)\b/.test(q)) out("warn", p, "relative-clause chain", sent);
  }
}
console.log(`\n${items.length} passages checked: ${errors} errors, ${warns} warnings.`);
process.exit(errors ? 1 : 0);
