/* Shared helpers: palettes, lookups, chrome (nav, search), drawer (entries, people, glossary,
   tours), permalinks, glossary hover cards, excerpts, notes, entry rendering. */
(function () {
  const H = window.HOD;
  const REPO = "https://github.com/anielsen108/history-of-disagreement";

  H.teloColor = {
    truth: "#2b6cb0", victory: "#c53030", formation: "#a07a1c", decision: "#6b46c1",
    settlement: "#2c9a8a", understanding: "#dd6b20", plurality: "#4a8a2e", release: "#a35d8a"
  };
  H.domainColor = {
    epistemic: "#3a6ea5", linguistic: "#7d5ba6", axiological: "#b7791f", interest: "#2f855a",
    power: "#9b2c2c", psyche: "#c05621", relational: "#b83280", contemplative: "#5f8b99", generative: "#5a6b2f"
  };

  const by = (arr) => Object.fromEntries((arr || []).map((x) => [x.id, x]));
  H.M = by(H.methods); H.V = by(H.views);
  H.T = by(H.teloi); H.F = by(H.families); H.D = by(H.domains);
  H.P = by(H.people); H.G = by(H.glossary); H.PATH = by(H.paths);
  H.excerpts = H.excerpts || [];

  H.methods.forEach((m) => {
    m.children = [];
    const x = (H.extras || {})[m.id] || {};
    m.conf = Object.assign({ date: m.date >= 1500 ? "firm" : "approx", pair: "interpretive" }, x.conf || {});
    m.third = x.third; m.resolution = x.resolution; m.failure = x.failure; m.critic = x.critic;
  });
  H.views.forEach((v) => { v.conf = { date: (H.viewConf || {})[v.id] || "firm" }; v.methods = []; });
  H.methods.forEach((m) => {
    m.parents.forEach((p) => H.M[p].children.push(m.id));
    m.views.forEach((v, i) => H.V[v].methods.push({ id: m.id, primary: i === 0 }));
  });
  (H.people || []).forEach((p) => { p.methods = p.methods || []; p.views = p.views || []; });

  H.confLabel = {
    firm: "dating firm", approx: "dating approximate", contested: "dating contested",
    explicit: "diagnosis stated by the tradition", interpretive: "diagnosis is this site’s reading", contested_pair: "diagnosis contested by scholars"
  };
  H.confBadges = (x) => {
    const c = x.conf || {};
    const sym = { firm: "●", approx: "◐", contested: "○", explicit: "●", interpretive: "◐" };
    let out = `<span class="conf conf-${c.date}" title="How secure the date is">${sym[c.date]} ${H.confLabel[c.date]}</span>`;
    if (c.pair) out += `<span class="conf conf-${c.pair}" title="How secure the primary pairing is">${c.pair === "contested" ? "○" : sym[c.pair]} ${c.pair === "contested" ? H.confLabel.contested_pair : H.confLabel[c.pair]}</span>`;
    return `<div class="confs">${out}</div>${c.note ? `<p class="conf-note">${c.note}</p>` : ""}`;
  };

  H.year = (y) => (y < 0 ? `${-y} BCE` : y < 1000 ? `${y} CE` : `${y}`);
  H.esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  H.strip = (s) => String(s).replace(/<[^>]+>/g, "");
  H.fold = (s) => H.strip(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  H.kind = (id) => (H.M[id] ? "method" : H.V[id] ? "view" : null);
  H.get = (id) => H.M[id] || H.V[id];
  H.colorOf = (id) => (H.M[id] ? H.teloColor[H.M[id].telos] : H.domainColor[H.V[id].domain]);
  H.dot = (col) => `<span class="dot" style="background:${col};display:inline-block;width:.55em;height:.55em;border-radius:50%;margin-right:.25em"></span>`;

  /* ── chrome ───────────────────────────────────────────── */
  const primary = [
    ["index.html", "Overview"], ["taxonomy.html", "Taxonomy"], ["methods.html", "Methods"], ["views.html", "Views"],
    ["diagnose.html", "Diagnose"], ["compare.html", "Compare"], ["paths.html", "Paths"]
  ];
  const more = [
    ["timeline.html", "Timeline"], ["people.html", "People"], ["gaps.html", "Gap gallery"], ["example.html", "Worked example"],
    ["texts.html", "Primary texts"], ["glossary.html", "Glossary"], ["print.html", "Printable chart"], ["data.html", "Open data & notes"],
    ["sources.html", "Sources"], ["about.html", "About"]
  ];
  function chrome() {
    const here = (location.pathname.split("/").pop() || "index.html") || "index.html";
    const a = ([h, t]) => `<a href="${h}"${h === here ? ' aria-current="page"' : ""}>${t}</a>`;
    const hdr = document.createElement("header");
    hdr.className = "site-header";
    hdr.innerHTML = `<div class="inner"><a class="brand" href="index.html">Disagreement<span>,</span> a history</a>
      <nav class="nav">${primary.map(a).join("")}
        <details class="more"><summary${more.some(([h]) => h === here) ? ' aria-current="page"' : ""}>More</summary><div class="more-menu">${more.map(a).join("")}</div></details></nav>
      <div class="search-wrap"><input class="site-search" type="search" placeholder="Search methods, views, people, terms" aria-label="Search the site" autocomplete="off"><div class="search-results" role="listbox" hidden></div></div>
      <button class="help-btn" type="button" aria-label="Help: how to use this site" title="Help">?</button>
      <button class="theme-toggle" type="button" aria-label="Toggle colour theme">◐ theme</button></div>`;
    document.body.prepend(hdr);
    const ftr = document.createElement("footer");
    ftr.innerHTML = `<div class="inner"><a href="data.html">Download the data</a> · <a href="${REPO}/issues/new">Propose a correction</a> · <a href="${REPO}">Source on GitHub</a></div>`;
    document.body.append(ftr);
    const root = document.documentElement;
    try { const t = localStorage.getItem("hod-theme"); if (t) root.dataset.theme = t; } catch (e) {}
    hdr.querySelector(".theme-toggle").onclick = () => {
      const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
      root.dataset.theme = dark ? "light" : "dark";
      try { localStorage.setItem("hod-theme", root.dataset.theme); } catch (e) {}
    };
    document.addEventListener("click", (e) => { const d = hdr.querySelector("details.more"); if (d && !d.contains(e.target)) d.open = false; });
    initSearch(hdr.querySelector(".site-search"), hdr.querySelector(".search-results"));
    hdr.querySelector(".help-btn").onclick = () => H.help();
  }

  /* ── help and first-visit welcome ─────────────────────── */
  // A small picture of the diagram, with upright labels, for the welcome and help panels.
  const miniDiagram = () => {
    const c = H.domainColor, t = H.teloColor, VL = H.viewsLeft !== false;
    // Views take the left column when VL, the right otherwise. Labels sit outside the dots, upright.
    const xV = VL ? 160 : 360, xM = VL ? 360 : 160, lab = (x) => (x === 160 ? `x="150" text-anchor="end"` : `x="370"`);
    const th = (yv, ym, col, w) => `<path d="M${xV},${yv} C260,${yv} 260,${ym} ${xM},${ym}" stroke="${col}" stroke-width="${w}" fill="none"${w < 2 ? ' opacity=".7"' : ""}/>`;
    const node = (x, y, col, name) => `<circle cx="${x}" cy="${y}" r="4" fill="${col}"/><text ${lab(x)} y="${y + 4}">${name}</text>`;
    return `<svg class="mini" viewBox="0 0 520 132" role="img" aria-label="Methods in one column joined by threads to the views they presuppose in the other">
      <text ${lab(xV)} y="14" class="mh">VIEWS</text><text ${lab(xM)} y="14" class="mh">METHODS</text>
      ${th(44, 38, c.interest, 2.4)}${th(44, 64, c.interest, 2.4)}${th(84, 64, c.relational, 1)}${th(84, 104, c.relational, 2.4)}
      ${node(xV, 44, c.interest, "Interests beneath positions")}${node(xV, 84, c.relational, "Relationship-level message")}
      ${node(xM, 38, t.settlement, "Principled negotiation")}${node(xM, 64, t.settlement, "Mediation")}${node(xM, 104, t.understanding, "Difficult conversations")}
      <text x="260" y="126" text-anchor="middle" class="mh">heavy thread = the method’s primary view</text></svg>`;
  };
  const welcomeSteps = () => [
    { h: "Two questions, one map", b: `<p>This site surveys <b>methods</b> of conducting a disagreement, from Socratic questioning to AI-mediated deliberation. It also surveys <b>views</b> of what a disagreement is really about: error, words, values, interests, power, the psyche, the relationship.</p>
      <p>The two are linked. Every method assumes one of the views, so choosing a method is already a diagnosis.</p>` },
    { h: "Read the diagram across", b: `${miniDiagram()}<p>Methods fill one column and views the other. A thread joins a method to a view it presupposes. Hover a name to trace its threads, and click it to hold the focus. A hollow dot marks a view that no method here is built on.</p>` },
    { h: "Open any entry", b: `<p>Click a focused name again, or press “Read entry”. Each method gives its procedure, the view it assumes, how it fails and its strongest critic.</p>
      <p>Each entry also says how far to trust it. Flags mark uncertain dates and interpretive pairings, and a “Whose reading?” box names the scholar behind a contested claim.</p>` },
    { h: "Bring a dispute of your own", b: `<p><a href="diagnose.html">Diagnose</a> asks a few questions about a dispute and suggests methods that fit it. Its mismatch finder shows what happens when two parties hold different views of the same quarrel.</p>
      <p><a href="compare.html">Compare</a> sets two methods side by side. The <a href="example.html">worked example</a> runs one family dispute through five methods.</p>` },
    { h: "Find your way back", b: `<p>Press <kbd>/</kbd> to search methods, views, people and terms. <a href="paths.html">Paths</a> offers guided tours through the entries. Dotted underlines in the text open glossary cards.</p>
      <p>The <b>?</b> button in the header reopens this guide on any page.</p>` }
  ];
  let dlg;
  function dialog(cls, html) {
    if (!dlg) {
      dlg = document.createElement("dialog"); document.body.append(dlg);
      dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
      dlg.addEventListener("close", () => { try { localStorage.setItem("hod-welcomed", "1"); } catch (e) {} });
    }
    dlg.className = "modal " + cls; dlg.innerHTML = html;
    if (!dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); }
    return dlg;
  }
  H.welcome = (i = 0) => {
    try { localStorage.setItem("hod-welcomed", "1"); } catch (e) {}
    const steps = welcomeSteps(), n = steps.length; i = Math.max(0, Math.min(n - 1, i));
    const st = steps[i], last = i === n - 1;
    const d = dialog("welcome", `<button class="close" aria-label="Close" data-a="x">×</button>
      <div class="kicker">Welcome · ${i + 1} of ${n}</div><h2>${st.h}</h2><div class="modal-body">${st.b}</div>
      <div class="modal-foot"><span class="pips">${steps.map((_, j) => `<i class="${j === i ? "on" : ""}"></i>`).join("")}</span>
        <span>${i ? `<button type="button" class="btn" data-a="back">Back</button>` : `<button type="button" class="btn" data-a="x">Skip</button>`}
        ${last ? `<a class="btn" href="diagnose.html">Diagnose a dispute</a> <a class="btn primary" href="taxonomy.html">Explore the diagram</a>` : `<button type="button" class="btn primary" data-a="next">Next</button>`}</span></div>`);
    d.querySelectorAll("[data-a]").forEach((b) => (b.onclick = () => (b.dataset.a === "x" ? d.close() : H.welcome(i + (b.dataset.a === "next" ? 1 : -1)))));
    const f = d.querySelector(".btn.primary"); if (f) f.focus();
  };
  H.help = () => {
    const d = dialog("help", `<button class="close" aria-label="Close" data-a="x">×</button>
      <div class="kicker">Help</div><h2>How to use this site</h2>
      <div class="modal-body">
        <h3>What it is</h3>
        <p>A survey of methods of conducting disagreement and of views of what disagreement is about. Each method is linked to the views it presupposes.</p>
        <h3>The diagram</h3>${miniDiagram()}
        <dl class="helpdl">
          <dt>Two columns</dt><dd>Methods are grouped by telos, meaning what the exchange is for. Views are grouped by domain. “Swap sides” exchanges the columns.</dd>
          <dt>Threads</dt><dd>A heavy thread marks a method’s primary view. A dashed thread marks a pairing that scholars contest. “Primary threads only” leaves one thread per method.</dd>
          <dt>Focus</dt><dd>Hover a name to trace it. Click to hold the focus, and click again to open the entry. Hover a group heading to light the whole group.</dd>
          <dt>Filters</dt><dd>On the Taxonomy page, chips hide a telos, domain or culture, and the slider rebuilds the field century by century. The address bar keeps the filter state, so a copied link reopens the same view.</dd>
        </dl>
        <h3>Entries</h3>
        <dl class="helpdl">
          <dt>Flags</dt><dd>● firm, ◐ approximate or interpretive, ○ contested. One flag covers the date. The other covers the pairing of a method with its primary view.</dd>
          <dt>Whose reading?</dt><dd>Lists the disputed claims in an entry and says whether each is attested in the source, a specialist consensus, one scholar’s reading, or this site’s own.</dd>
          <dt>Notes</dt><dd>“Your notes” saves private notes in this browser. Export them from <a href="data.html">Open data &amp; notes</a>.</dd>
        </dl>
        <h3>Tools</h3>
        <dl class="helpdl">
          <dt><a href="diagnose.html">Diagnose</a></dt><dd>Answer a few questions about a dispute and get the domains in play and the methods that fit. The mismatch finder takes two views and shows how each party’s method looks to the other.</dd>
          <dt><a href="compare.html">Compare</a></dt><dd>Two methods side by side.</dd>
          <dt><a href="paths.html">Paths</a></dt><dd>Guided tours through the entries. Use ← and → to step through one.</dd>
          <dt><a href="gaps.html">Gap gallery</a></dt><dd>The views no method is built on, with a sketch of a method for each.</dd>
        </dl>
        <h3>Keys</h3>
        <p><kbd>/</kbd> search · <kbd>Esc</kbd> close a panel · <kbd>←</kbd> <kbd>→</kbd> previous and next stop on a path</p>
      </div>
      <div class="modal-foot"><span></span><span><button type="button" class="btn" data-a="tour">Replay the welcome tour</button> <button type="button" class="btn primary" data-a="x">Close</button></span></div>`);
    d.querySelectorAll("[data-a]").forEach((b) => (b.onclick = () => (b.dataset.a === "tour" ? H.welcome(0) : d.close())));
  };
  function firstVisit() {
    if (document.body.dataset.page === "print" || /^#(e|p|g|tour)=/.test(location.hash) || location.search) return;
    try { if (localStorage.getItem("hod-welcomed")) return; } catch (e) { return; }
    H.welcome(0);
  }

  /* ── search ───────────────────────────────────────────── */
  function searchIndex() {
    const idx = [];
    H.methods.forEach((m) => idx.push({ kind: "Method", id: m.id, label: m.name, sub: H.strip(m.when), col: H.teloColor[m.telos], hay: H.fold([m.name, m.native, m.who].join(" ")), body: H.fold(m.summary) }));
    H.views.forEach((v) => idx.push({ kind: "View", id: v.id, label: v.name, sub: H.D[v.domain].name, col: H.domainColor[v.domain], hay: H.fold([v.name, v.who].join(" ")), body: H.fold(v.summary) }));
    (H.people || []).forEach((p) => idx.push({ kind: "Person", id: "p:" + p.id, label: p.name, sub: H.year(p.born) + "–" + (p.died ? H.year(p.died) : ""), col: "var(--ink-3)", hay: H.fold(p.name), body: "" }));
    (H.glossary || []).forEach((g) => idx.push({ kind: "Term", id: "g:" + g.id, label: g.term, sub: g.lang, col: "var(--ink-3)", hay: H.fold(g.term + " " + g.match.join(" ")), body: H.fold(g.def) }));
    (H.paths || []).forEach((p) => idx.push({ kind: "Path", id: "t:" + p.id, label: p.name, sub: "guided tour", col: "var(--accent)", hay: H.fold(p.name), body: H.fold(p.blurb) }));
    return idx;
  }
  const KR = { Method: 0, View: 1, Person: 2, Term: 3, Path: 4 };
  function initSearch(input, box) {
    let idx = null, sel = 0, res = [];
    const render = () => {
      box.innerHTML = res.length ? res.map((r, i) => `<div class="sr${i === sel ? " sel" : ""}" role="option" data-i="${i}">${H.dot(r.col)}<b>${r.label}</b> <span class="meta">${r.kind} · ${r.sub || ""}</span></div>`).join("")
        : `<div class="sr meta">No matches</div>`;
      box.hidden = false;
    };
    const go = (r) => { box.hidden = true; input.value = ""; input.blur(); H.goto(r.id); };
    input.addEventListener("input", () => {
      idx = idx || searchIndex();
      const q = H.fold(input.value.trim());
      if (!q) { box.hidden = true; return; }
      res = idx.map((r) => ({ r, s: r.hay.startsWith(q) ? 3 : r.hay.includes(q) ? 2 : r.body.includes(q) ? 1 : 0 }))
        .filter((x) => x.s).sort((a, b) => b.s - a.s || KR[a.r.kind] - KR[b.r.kind] || a.r.label.localeCompare(b.r.label)).slice(0, 12).map((x) => x.r);
      sel = 0; render();
    });
    input.addEventListener("keydown", (e) => {
      if (box.hidden) return;
      if (e.key === "ArrowDown") { sel = Math.min(sel + 1, res.length - 1); render(); e.preventDefault(); }
      if (e.key === "ArrowUp") { sel = Math.max(sel - 1, 0); render(); e.preventDefault(); }
      if (e.key === "Enter" && res[sel]) { go(res[sel]); e.preventDefault(); }
      if (e.key === "Escape") box.hidden = true;
    });
    box.addEventListener("mousedown", (e) => { const d = e.target.closest(".sr[data-i]"); if (d) { e.preventDefault(); go(res[+d.dataset.i]); } });
    input.addEventListener("blur", () => setTimeout(() => (box.hidden = true), 150));
    document.addEventListener("keydown", (e) => { const typing = /input|textarea|select/i.test(document.activeElement.tagName);
      if (e.key === "/" && !typing) { e.preventDefault(); input.focus(); }
      if (e.key === "?" && !typing) { e.preventDefault(); H.help(); } });
  }
  // Route an id ("elenchus", "p:plato", "g:stasis", "t:therapeutic") to the right drawer.
  H.goto = (id) => {
    if (id.startsWith("p:")) return H.openPerson(id.slice(2));
    if (id.startsWith("g:")) return H.openGloss(id.slice(2));
    if (id.startsWith("t:")) return H.startTour(id.slice(2), 0);
    return H.open(id);
  };

  /* ── citations, links ─────────────────────────────────── */
  H.citeList = (cites) => `<ol class="cites">${cites.map(([k, loc]) =>
    `<li>${H.sources[k]}${loc ? ` <span class="loc">— ${loc}</span>` : ""} <a href="sources.html#${k}" title="In bibliography">↗</a></li>`).join("")}</ol>`;
  H.href = (id) => (H.M[id] ? `methods.html#${id}` : `views.html#${id}`);
  H.link = (id, opts = {}) => {
    const x = H.get(id); if (!x) return id;
    return `<a class="xref" data-id="${id}" href="${H.href(id)}">${H.dot(H.colorOf(id))}${x.name}${opts.star ? " ★" : ""}</a>`;
  };
  H.plink = (pid) => { const p = H.P[pid]; return p ? `<a class="xref" data-id="p:${pid}" href="people.html#p=${pid}">${p.name}</a>` : pid; };
  H.chip = (label, color) => `<span class="chip"><span class="dot" style="background:${color}"></span>${label}</span>`;

  /* ── glossary hover cards ────────────────────────────── */
  let glossRe = null; const formToId = {};
  function buildGloss() {
    const forms = [];
    (H.glossary || []).forEach((g) => g.match.forEach((f) => { formToId[f.toLowerCase()] = g.id; forms.push(f); }));
    forms.sort((a, b) => b.length - a.length);
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    glossRe = forms.length ? new RegExp(`(?<![\\p{L}])(${forms.map(esc).join("|")})(?![\\p{L}])`, "giu") : null;
  }
  H.glossify = (html, skip) => {
    if (!H.glossary) return html;
    if (!glossRe) buildGloss();
    if (!glossRe) return html;
    const used = new Set(skip ? [skip] : []);
    let inA = 0;
    return html.split(/(<[^>]+>)/).map((seg) => {
      if (seg.startsWith("<")) { if (/^<a[\s>]/i.test(seg)) inA++; if (/^<\/a>/i.test(seg)) inA = Math.max(0, inA - 1); return seg; }
      if (inA) return seg;
      return seg.replace(glossRe, (m) => {
        const id = formToId[m.toLowerCase()];
        if (!id || used.has(id)) return m;
        used.add(id);
        return `<span class="gl" data-g="${id}" tabindex="0">${m}</span>`;
      });
    }).join("");
  };
  document.addEventListener("mouseover", (e) => {
    const g = e.target.closest && e.target.closest(".gl"); if (!g) return;
    const x = H.G[g.dataset.g]; if (!x) return;
    H.tip(`<b>${x.term}</b> <span style="opacity:.7">${x.lang}</span><br>${x.def}`, e);
  });
  document.addEventListener("mouseout", (e) => { if (e.target.closest && e.target.closest(".gl")) H.tip(null); });
  document.addEventListener("click", (e) => { const g = e.target.closest && e.target.closest(".gl"); if (g) { e.preventDefault(); H.openGloss(g.dataset.g); } });

  /* ── excerpts ─────────────────────────────────────────── */
  H.excerptsFor = (id) => H.excerpts.filter((x) => x.entry === id).map((x) =>
    `<blockquote class="excerpt"><span class="ex-label">Primary text</span>${x.text}<cite>${x.who}, ${x.src} · ${x.tr}</cite></blockquote>`).join("");

  /* ── notes (browser-local) and correction link ───────── */
  const noteKey = (id) => "hod-note-" + id;
  H.getNote = (id) => { try { return localStorage.getItem(noteKey(id)) || ""; } catch (e) { return ""; } };
  H.allNotes = () => {
    const out = {};
    try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith("hod-note-") && localStorage.getItem(k)) out[k.slice(9)] = localStorage.getItem(k); } } catch (e) {}
    return out;
  };
  H.notesBox = (id, name) => {
    const body = encodeURIComponent(`Entry: ${name} (${id})\nPage: ${location.origin}${location.pathname}#e=${id}\n\nWhat is wrong or missing:\n\nSource for the correction:\n`);
    return `<details class="notes"${H.getNote(id) ? " open" : ""}><summary>Your notes${H.getNote(id) ? " ✎" : ""}</summary>
      <textarea data-note="${id}" rows="3" placeholder="Private notes, saved only in this browser">${H.esc(H.getNote(id))}</textarea>
      <a class="meta" href="${REPO}/issues/new?title=${encodeURIComponent("Correction: " + name)}&body=${body}" target="_blank" rel="noopener">Propose a correction on GitHub ↗</a></details>`;
  };
  document.addEventListener("input", (e) => {
    const t = e.target; if (!t.dataset || !t.dataset.note) return;
    try { if (t.value) localStorage.setItem(noteKey(t.dataset.note), t.value); else localStorage.removeItem(noteKey(t.dataset.note)); } catch (err) {}
  });

  /* ── entry renderers ─────────────────────────────────── */
  H.peopleFor = (id) => (H.people || []).filter((p) => p.methods.includes(id) || p.views.includes(id));
  H.firstSentence = (s) => H.strip(s).split(/(?<=[.!?’])\s+(?=[A-Z‘“])/)[0];
  // Every method uses one skeleton: who and when; in brief; procedure; what it assumes; in practice and how it fails; critique.
  H.renderMethod = (m, tag = "h3", bare = false) => {
    const ppl = H.peopleFor(m.id), pv = H.V[m.views[0]];
    return `
    ${bare ? "" : `<${tag}>${m.name}</${tag}>`}
    ${m.native ? `<div class="native">${m.native}</div>` : ""}
    ${bare ? "" : `<div class="when">${m.when}${m.who ? ` · ${m.who}` : ""}</div>`}
    <div class="chips">${H.chip("Telos: " + H.T[m.telos].name, H.teloColor[m.telos])}${H.chip(H.F[m.family].name, "var(--ink-3)")}</div>
    <p>${H.glossify(m.summary, null)}</p>
    <h4 class="sk">Procedure</h4>
    <ol class="moves">${(m.moves || []).map((x) => `<li>${x}</li>`).join("")}</ol>
    <h4 class="sk">What it assumes</h4>
    <p class="assumes">${H.link(pv.id, { star: true })}: ${H.firstSentence(pv.summary)}${m.views.length > 1 ? ` <span class="meta">It also presupposes ${m.views.slice(1).map((v) => H.link(v)).join(", ")}.</span>` : ""}</p>
    ${m.third ? `<h4 class="sk">In practice</h4><dl class="facts"><dt>Third party</dt><dd>${m.third}</dd><dt>Ends well when</dt><dd>${m.resolution}</dd><dt>How it fails</dt><dd>${m.failure}</dd></dl>` : ""}
    ${m.critic ? `<div class="critique"><b>Strongest critique</b> <span class="meta">from ${H.link(m.critic.view)}</span><p>${m.critic.text}</p><span class="meta">— ${m.critic.who}</span></div>` : ""}
    ${m.note ? `<p class="note">${m.note}</p>` : ""}
    ${H.excerptsFor(m.id)}
    ${H.readingFor(m)}
    ${H.confBadges(m)}
    ${m.parents.length ? `<p class="rel"><b>Descends from</b>${m.parents.map((p) => H.link(p)).join(", ")}</p>` : ""}
    ${m.children.length ? `<p class="rel"><b>Gave rise to</b>${m.children.map((p) => H.link(p)).join(", ")}</p>` : ""}
    ${ppl.length ? `<p class="rel"><b>People</b>${ppl.map((p) => H.plink(p.id)).join(", ")}</p>` : ""}
    <p class="rel"><b>Tools</b><a href="compare.html?a=${m.id}">Compare with another method</a> · <a href="taxonomy.html?focus=${m.id}">Show in diagram</a> · <a href="#e=${m.id}" class="permalink">Permalink</a></p>
    ${H.citeList(m.cite)}
    ${H.notesBox(m.id, m.name)}`;
  };
  // List pages show each entry folded to a heading and one line; it opens on click, on a link to it, or on find-in-page.
  H.foldEntry = (x) => {
    const isM = !!H.M[x.id];
    // The chip carries the other half of the pairing: a method shows its primary view, and a view says so when no method is built on it.
    const tagc = isM ? H.chip("assumes: " + H.V[x.views[0]].name, H.domainColor[H.V[x.views[0]].domain])
      : x.methods.length ? "<span></span>" : H.chip("no method", "transparent");
    return `<details class="entry fold" id="${x.id}"><summary><span class="f-name">${x.name}</span>${tagc}
      <span class="f-when">${x.when}${x.who ? ` · ${x.who}` : ""}</span>
      <span class="f-line">${H.firstSentence(x.summary)}</span></summary>
      ${isM ? H.renderMethod(x, "h3", true) : H.renderView(x, "h3", true)}</details>`;
  };
  H.wireFolds = (host) => {
    const openHash = () => {
      const id = decodeURIComponent(location.hash.slice(1)), el = id && !id.includes("=") && document.getElementById(id);
      if (el && el.tagName === "DETAILS") { el.open = true; el.scrollIntoView(); }
    };
    window.addEventListener("hashchange", openHash); setTimeout(openHash, 30);
    document.querySelectorAll("[data-fold]").forEach((b) => (b.onclick = () => host.querySelectorAll("details.fold").forEach((d) => (d.open = b.dataset.fold === "open"))));
  };

  // Named readings for contested entries: what is claimed, its status, and whose reading it is.
  H.statusLabel = { attested: "Attested in the source", consensus: "Scholarly consensus", reading: "A named scholar’s reading", site: "This site’s reading" };
  H.readingFor = (x) => {
    const r = (H.readings || {})[x.id]; if (!r) return "";
    return `<div class="reading"><b>Whose reading?</b>${r.map((c) => `<p><span class="st st-${c.status}">${H.statusLabel[c.status]}</span> ${c.claim}${c.by ? ` <span class="meta">${c.by}.</span>` : ""}</p>`).join("")}</div>`;
  };
  H.renderView = (v, tag = "h3", bare = false) => {
    const ppl = H.peopleFor(v.id);
    const gap = (H.gaps || {})[v.id];
    return `
    ${bare ? "" : `<${tag}>${v.name}</${tag}>
    <div class="when">${v.when}${v.who ? ` · ${v.who}` : ""}</div>`}
    <div class="chips">${H.chip("Domain: " + H.D[v.domain].name, H.domainColor[v.domain])}</div>
    <p>${H.glossify(v.summary, null)}</p>
    ${v.quote ? `<blockquote>“${v.quote.t}”<cite>${v.quote.src}</cite></blockquote>` : ""}
    ${H.excerptsFor(v.id)}
    <p class="rel"><b>Remedy implied</b>${v.implies}</p>
    ${H.readingFor(v)}
    ${H.confBadges(v)}
    <p class="rel"><b>Methods presupposing it</b>${v.methods.length ? v.methods.map((x) => H.link(x.id, { star: x.primary })).join(", ") : `none in this survey. <a href="gaps.html#${v.id}">See the gap gallery</a>${gap ? ` for a sketch (“${gap.method}”)` : ""}.`}</p>
    ${ppl.length ? `<p class="rel"><b>People</b>${ppl.map((p) => H.plink(p.id)).join(", ")}</p>` : ""}
    <p class="rel"><b>Tools</b><a href="diagnose.html?a=${v.id}#mismatch">Use in the mismatch finder</a> · <a href="taxonomy.html?focus=${v.id}">Show in diagram</a> · <a href="#e=${v.id}" class="permalink">Permalink</a></p>
    ${H.citeList(v.cite)}
    ${H.notesBox(v.id, v.name)}`;
  };

  /* ── drawer ──────────────────────────────────────────── */
  let drawer, tour = null;
  function ensureDrawer() {
    if (drawer) return drawer;
    drawer = document.createElement("aside");
    drawer.className = "drawer"; drawer.setAttribute("aria-live", "polite");
    document.body.append(drawer);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") H.close();
      if (tour && drawer.classList.contains("open") && !/input|textarea|select/i.test(document.activeElement.tagName)) {
        if (e.key === "ArrowRight") H.startTour(tour.path, tour.i + 1);
        if (e.key === "ArrowLeft") H.startTour(tour.path, tour.i - 1);
      }
    });
    drawer.addEventListener("click", (e) => {
      const a = e.target.closest("a.xref");
      if (a) { e.preventDefault(); tour = null; H.goto(a.dataset.id); }
    });
    return drawer;
  }
  function setHash(h) { try { history.replaceState(null, "", h ? "#" + h : location.pathname + location.search); } catch (e) {} }
  function show(kicker, html, hash, tourBar) {
    ensureDrawer();
    drawer.innerHTML = `<button class="close" aria-label="Close">×</button>${tourBar || ""}<div class="kicker">${kicker}</div>
      <div class="entry" style="border:0;padding-top:.3rem">${html}</div>`;
    drawer.querySelector(".close").onclick = H.close;
    drawer.classList.add("open"); drawer.scrollTop = 0;
    setHash(hash);
  }
  H.open = (id, keepTour) => {
    const x = H.get(id); if (!x) return;
    if (!keepTour) tour = null;
    const kind = H.kind(id);
    show(kind === "method" ? "Method" : "View of what disagreement is about",
      (kind === "method" ? H.renderMethod(x, "h2") : H.renderView(x, "h2")) + `<p><a href="${H.href(id)}">Open in ${kind === "method" ? "Methods" : "Views"} →</a></p>`,
      tour ? `tour=${tour.path}.${tour.i}` : `e=${id}`, tour ? tourBar() : "");
    if (H.onOpen) H.onOpen(id);
  };
  H.openPerson = (pid) => {
    const p = H.P[pid]; if (!p) return; tour = null;
    const infl = p.infl.map(H.plink).join(", ");
    const heirs = H.people.filter((q) => q.infl.includes(pid)).map((q) => H.plink(q.id)).join(", ");
    show("Person", `<h2>${p.name}</h2><div class="when">${H.year(p.born)}–${p.died ? H.year(p.died) : "present"}${p.approx ? " (approximate)" : ""} · ${H.regions.find((r) => r.id === p.region).name}</div>
      ${p.methods.length ? `<p class="rel"><b>Methods</b>${p.methods.map((m) => H.link(m)).join(", ")}</p>` : ""}
      ${p.views.length ? `<p class="rel"><b>Views</b>${p.views.map((v) => H.link(v)).join(", ")}</p>` : ""}
      ${infl ? `<p class="rel"><b>Drew on or wrote against</b>${infl}</p>` : ""}
      ${heirs ? `<p class="rel"><b>Taken up by</b>${heirs}</p>` : ""}
      <p><a href="people.html#p=${pid}">Show in the influence graph →</a></p>`, `p=${pid}`);
    if (H.onOpen) H.onOpen("p:" + pid);
  };
  H.openGloss = (gid) => {
    const g = H.G[gid]; if (!g) return; tour = null;
    show("Glossary", `<h2>${g.term}</h2><div class="when">${g.lang}</div><p>${g.def}</p>
      ${g.see && H.get(g.see) ? `<p class="rel"><b>See</b>${H.link(g.see)}</p>` : ""}<p><a href="glossary.html#${gid}">Full glossary →</a></p>`, `g=${gid}`);
  };
  function tourBar() {
    const p = H.PATH[tour.path], n = p.steps.length;
    return `<div class="tourbar"><span class="meta">Path: <b>${p.name}</b> · ${tour.i + 1} of ${n}</span>
      <span><button type="button" onclick="HOD.startTour('${tour.path}',${tour.i - 1})" ${tour.i === 0 ? "disabled" : ""}>← Previous</button>
      <button type="button" onclick="HOD.startTour('${tour.path}',${tour.i + 1})" ${tour.i === n - 1 ? "disabled" : ""}>Next →</button></span></div>`;
  }
  H.startTour = (pathId, i) => {
    const p = H.PATH[pathId]; if (!p) return;
    i = Math.max(0, Math.min(p.steps.length - 1, i));
    tour = { path: pathId, i };
    H.open(p.steps[i], true);
  };
  H.close = () => { tour = null; if (drawer) drawer.classList.remove("open"); setHash(""); if (H.onClose) H.onClose(); };

  // permalinks: #e=id, #p=person, #g=term, #tour=path.i
  function fromHash() {
    const h = decodeURIComponent(location.hash.slice(1));
    const m = h.match(/^(e|p|g|tour)=(.+)$/);
    if (!m) return;
    if (m[1] === "e") H.open(m[2]);
    if (m[1] === "p") H.openPerson(m[2]);
    if (m[1] === "g") H.openGloss(m[2]);
    if (m[1] === "tour") { const [pid, i] = m[2].split("."); H.startTour(pid, +i || 0); }
  }
  window.addEventListener("hashchange", fromHash);

  /* ── tooltip ─────────────────────────────────────────── */
  let tip;
  H.tip = (html, ev) => {
    if (!tip) { tip = document.createElement("div"); tip.className = "tooltip"; document.body.append(tip); }
    if (!html) { tip.style.opacity = 0; return; }
    tip.innerHTML = html; tip.style.opacity = 1;
    const w = tip.offsetWidth, h = tip.offsetHeight;
    let x = ev.clientX + 14, y = ev.clientY + 14;
    if (x + w > innerWidth - 8) x = ev.clientX - w - 14;
    if (y + h > innerHeight - 8) y = ev.clientY - h - 14;
    tip.style.left = x + "px"; tip.style.top = y + "px";
  };
  H.tipFor = (id) => {
    const x = H.get(id);
    const sub = H.M[id] ? `${H.T[x.telos].name} · ${H.F[x.family].name}` : `${H.D[x.domain].name}`;
    return `<b>${x.name}</b><br>${H.strip(x.when)}<br><span style="opacity:.75">${sub}</span>`;
  };

  /* ── legend builder ──────────────────────────────────── */
  H.legend = (title, items, colorMap, onToggle, active) => {
    const div = document.createElement("div"); div.className = "legend";
    div.innerHTML = `<span class="legend-title">${title}</span>` + items.map((t) =>
      `<button class="chip" type="button" aria-pressed="${!active || active.has(t.id)}" data-id="${t.id}" title="${H.esc(t.gloss || "")}"><span class="dot" style="background:${colorMap ? colorMap[t.id] : "var(--ink-3)"}"></span>${t.name}</button>`).join("");
    if (onToggle) div.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => {
      b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") === "true" ? "false" : "true");
      const on = new Set([...div.querySelectorAll('button[aria-pressed="true"]')].map((x) => x.dataset.id));
      onToggle(on);
    }));
    return div;
  };

  document.addEventListener("DOMContentLoaded", () => { chrome(); setTimeout(fromHash, 0); setTimeout(firstVisit, 250); });
})();
