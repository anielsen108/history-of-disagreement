// Regenerates the Markdown research notes (approaches/, framings/, sources/, timeline.md)
// from the site's data files, so the site and the notes never drift.
// Also writes the open-data files in site/data/open/ (hod.json and CSVs).
// Usage: node scripts/export-markdown.mjs
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ["sources", "taxonomy", "methods", "views", "extras", "people", "glossary", "content"]) {
  vm.runInContext(fs.readFileSync(path.join(root, "site/data", f + ".js"), "utf8"), ctx);
}
const H = ctx.window.HOD;
const md = (s) => String(s).replace(/<i>(.*?)<\/i>/g, "*$1*").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&");
const year = (y) => (y < 0 ? `${-y} BCE` : y < 1000 ? `${y} CE` : `${y}`);
const by = (a) => Object.fromEntries(a.map((x) => [x.id, x]));
const M = by(H.methods), V = by(H.views), T = by(H.teloi), F = by(H.families), D = by(H.domains);
const cites = (c) => c.map(([k, loc]) => `- ${md(H.sources[k])}${loc ? ` — ${loc}` : ""}`).join("\n");
const write = (p, s) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s.trim() + "\n"); };

for (const dir of ["approaches", "framings"]) fs.rmSync(path.join(root, dir), { recursive: true, force: true });

H.methods.forEach((m) => {
  const kids = H.methods.filter((x) => x.parents.includes(m.id));
  write(path.join(root, "approaches", m.id + ".md"), `
# ${m.name}
${m.native ? `\n*${md(m.native)}*\n` : ""}
- **When:** ${md(m.when)}
- **Who:** ${md(m.who || "")}
- **Telos:** ${T[m.telos].name}
- **Family:** ${F[m.family].name}
- **Presupposes:** ${m.views.map((v, i) => `[${V[v].name}](../framings/${v}.md)${i === 0 ? " (primary)" : ""}`).join(", ")}
${m.parents.length ? `- **Descends from:** ${m.parents.map((p) => `[${M[p].name}](${p}.md)`).join(", ")}` : ""}
${kids.length ? `- **Gave rise to:** ${kids.map((k) => `[${k.name}](${k.id}.md)`).join(", ")}` : ""}

${md(m.summary)}

## Moves
${(m.moves || []).map((x) => `- ${md(x)}`).join("\n")}
${m.note ? `\n> ${md(m.note)}\n` : ""}
## Sources
${cites(m.cite)}
`);
});

H.views.forEach((v) => {
  const ms = H.methods.filter((m) => m.views.includes(v.id));
  write(path.join(root, "framings", v.id + ".md"), `
# ${v.name}

- **Domain:** ${D[v.domain].name}
- **When:** ${md(v.when)}
- **Who:** ${md(v.who || "")}
- **Remedy implied:** ${md(v.implies)}
- **Methods presupposing it:** ${ms.length ? ms.map((m) => `[${m.name}](../approaches/${m.id}.md)`).join(", ") : "none in this survey"}

${md(v.summary)}
${v.quote ? `\n> “${md(v.quote.t)}” — ${md(v.quote.src)}\n` : ""}
## Sources
${cites(v.cite)}
`);
});

write(path.join(root, "approaches", "README.md"), `# Approaches (methods)\n\nGenerated from \`site/data/methods.js\`. Grouped by telos.\n\n` +
  H.teloi.map((t) => `## ${t.name}\n\n*${t.gloss}*\n\n` + H.methods.filter((m) => m.telos === t.id).sort((a, b) => a.date - b.date)
    .map((m) => `- [${m.name}](${m.id}.md) — ${md(m.when)}`).join("\n")).join("\n\n"));
write(path.join(root, "framings", "README.md"), `# Framings (views of what disagreement is about)\n\nGenerated from \`site/data/views.js\`. Grouped by domain.\n\n` +
  H.domains.map((d) => `## ${d.name}\n\n*${d.gloss}*\n\n` + H.views.filter((v) => v.domain === d.id).sort((a, b) => a.date - b.date)
    .map((v) => `- [${v.name}](${v.id}.md) — ${md(v.when)}`).join("\n")).join("\n\n"));
const keys = Object.keys(H.sources).sort((a, b) => md(H.sources[a]).localeCompare(md(H.sources[b])));
write(path.join(root, "sources", "bibliography.md"), `# Bibliography\n\nGenerated from \`site/data/sources.js\`.\n\n` + keys.map((k) => `- ${md(H.sources[k])}`).join("\n"));
write(path.join(root, "timeline.md"), `# Timeline\n\nGenerated from the site data. Dates are plotting years; see each note for the honest range.\n\n| Year | Kind | Entry | Range |\n|---|---|---|---|\n` +
  [...H.methods.map((x) => ["method", x]), ...H.views.map((x) => ["view", x])].sort((a, b) => a[1].date - b[1].date)
    .map(([k, x]) => `| ${year(x.date)} | ${k} | [${x.name}](${k === "method" ? "approaches" : "framings"}/${x.id}.md) | ${md(x.when)} |`).join("\n"));
console.log(`wrote ${H.methods.length} approaches, ${H.views.length} framings, ${keys.length} sources`);

// ── open data ─────────────────────────────────────────
const plain = (s) => (s == null ? "" : String(s).replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">"));
const csvCell = (v) => { const s = Array.isArray(v) ? v.join(";") : plain(v); return /[",\n;]/.test(s) || /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
const csv = (cols, rows) => [cols.join(","), ...rows.map((r) => cols.map((c) => csvCell(r[c])).join(","))].join("\n") + "\n";
const X = H.extras || {};
const methods = H.methods.map((m) => ({
  id: m.id, name: plain(m.name), native: plain(m.native), date: m.date, when: plain(m.when), who: plain(m.who), family: m.family, telos: m.telos,
  primary_view: m.views[0], views: m.views, parents: m.parents, summary: plain(m.summary), moves: (m.moves || []).map(plain), note: plain(m.note),
  date_confidence: (X[m.id] && X[m.id].conf && X[m.id].conf.date) || (m.date >= 1500 ? "firm" : "approx"),
  pairing_confidence: (X[m.id] && X[m.id].conf && X[m.id].conf.pair) || "interpretive",
  third_party: plain(X[m.id] && X[m.id].third), ends_well_when: plain(X[m.id] && X[m.id].resolution), typical_failure: plain(X[m.id] && X[m.id].failure),
  critique: X[m.id] && X[m.id].critic ? { who: plain(X[m.id].critic.who), from_view: X[m.id].critic.view, text: plain(X[m.id].critic.text) } : null,
  sources: m.cite.map(([k, loc]) => ({ key: k, loc: loc || "" }))
}));
const views = H.views.map((v) => ({
  id: v.id, name: plain(v.name), date: v.date, when: plain(v.when), who: plain(v.who), domain: v.domain, summary: plain(v.summary), implies: plain(v.implies),
  quote: v.quote ? { text: plain(v.quote.t), source: plain(v.quote.src) } : null, date_confidence: (H.viewConf || {})[v.id] || "firm",
  methods: H.methods.filter((m) => m.views.includes(v.id)).map((m) => m.id), sources: v.cite.map(([k, loc]) => ({ key: k, loc: loc || "" }))
}));
const links = [];
H.methods.forEach((m) => m.views.forEach((v, i) => links.push({ method: m.id, view: v, primary: i === 0, contested: i === 0 && X[m.id] && X[m.id].conf && X[m.id].conf.pair === "contested" ? true : false })));
const out = path.join(root, "site/data/open");
fs.mkdirSync(out, { recursive: true });
const data = {
  title: "Disagreement, a history: open data", license: "CC BY 4.0 for the data; quoted texts remain under their own terms", generated: new Date().toISOString().slice(0, 10),
  teloi: H.teloi, families: H.families, domains: H.domains, regions: H.regions,
  methods, views, links, people: H.people, glossary: H.glossary.map(({ id, term, lang, def, see }) => ({ id, term, lang, def, see })),
  excerpts: H.excerpts, paths: H.paths, gaps: H.gaps, sources: Object.fromEntries(Object.entries(H.sources).map(([k, v]) => [k, plain(v)]))
};
fs.writeFileSync(path.join(out, "hod.json"), JSON.stringify(data, null, 1) + "\n");
fs.writeFileSync(path.join(out, "methods.csv"), csv(["id", "name", "native", "date", "when", "who", "family", "telos", "primary_view", "views", "parents", "date_confidence", "pairing_confidence", "third_party", "ends_well_when", "typical_failure", "summary"], methods));
fs.writeFileSync(path.join(out, "views.csv"), csv(["id", "name", "date", "when", "who", "domain", "date_confidence", "methods", "implies", "summary"], views));
fs.writeFileSync(path.join(out, "links.csv"), csv(["method", "view", "primary", "contested"], links));
fs.writeFileSync(path.join(out, "people.csv"), csv(["id", "name", "born", "died", "approx", "region", "infl", "methods", "views"], H.people.map((p) => ({ ...p, approx: !!p.approx, died: p.died == null ? "" : p.died, methods: p.methods || [], views: p.views || [] }))));
fs.writeFileSync(path.join(out, "sources.csv"), csv(["key", "citation"], Object.entries(H.sources).map(([key, c]) => ({ key, citation: c }))));
console.log(`wrote open data: ${methods.length} methods, ${views.length} views, ${links.length} links, ${H.people.length} people`);
