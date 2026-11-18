/* Shared helpers: palettes, lookups, chrome (nav, search), drawer (entries, people, glossary,
   tours), permalinks, glossary hover cards, excerpts, notes, entry rendering. */
(function () {
  const H = window.HOD;
  const REPO = "https://github.com/anielsen108/history-of-disagreement";

  // The group colours are deliberately muted: about half the saturation of a full hue, so the page stays calm and neighbouring groups stay distinct.
  H.teloColor = {
    truth: "#4170a1", victory: "#af4444", formation: "#9c803c", decision: "#6f54ad",
    settlement: "#47968b", understanding: "#ca7841", plurality: "#5a8846", release: "#9d6a8b"
  };
  H.domainColor = {
    epistemic: "#4d729a", linguistic: "#7f679d", axiological: "#a88c3c", interest: "#458364",
    power: "#8e3d3d", psyche: "#b0643d", relational: "#a7477f", contemplative: "#6e8d97", generative: "#636f44"
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
    if (c.pair && c.pair !== "interpretive") out += `<span class="conf conf-${c.pair}" title="How secure the primary pairing is">${c.pair === "contested" ? "○" : sym[c.pair]} ${c.pair === "contested" ? H.confLabel.contested_pair : H.confLabel[c.pair]}</span>`;
    return `<div class="confs">${out}</div>${c.note ? `<p class="conf-note">${c.note}</p>` : ""}`;
  };

  H.year = (y) => (y < 0 ? `${-y} BCE` : y < 1000 ? `${y} CE` : `${y}`);
  H.esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  H.strip = (s) => String(s).replace(/<[^>]+>/g, "");
  H.fold = (s) => H.strip(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  H.kind = (id) => (H.M[id] ? "method" : H.V[id] ? "view" : null);
  H.get = (id) => H.M[id] || H.V[id];
  H.colorOf = (id) => (H.M[id] ? H.teloColor[H.M[id].telos] : H.domainColor[H.V[id].domain]);
  // Two shapes, used everywhere: a square marks a method or an aim, a circle marks a view or the place a dispute lives.
  H.dot = (col, sq) => `<span class="dot${sq ? " sq" : ""}" style="background:${col}"></span>`;
  H.mark = (id) => H.dot(H.colorOf(id), !!H.M[id]);

  H.cultures = [
    { id: "greek", name: "Greek & Roman" }, { id: "indian", name: "Indian & Tibetan" }, { id: "chinese", name: "Chinese" },
    { id: "jewish", name: "Jewish" }, { id: "islamic", name: "Islamic" }, { id: "latin", name: "Latin Christian" },
    { id: "african", name: "African" }, { id: "modern", name: "Modern Western" }
  ];
  H.cultureOf = (m) => m.id === "palaver" ? "african"
    : ({ greek: "greek", indic: "indian", sinitic: "chinese", jewish: "jewish", islamic: "islamic", latin: "latin" })[m.family] || "modern";

  /* ── chrome ───────────────────────────────────────────── */
  const primary = [
    ["index.html", "Overview"], ["diagnose.html", "Diagnose"], ["paths.html", "Paths"], ["taxonomy.html", "Taxonomy"],
    ["methods.html", "Methods"], ["views.html", "Views"], ["compare.html", "Compare"]
  ];
  const more = [
    ["example.html", "Worked example"], ["texts.html", "Primary texts"], ["glossary.html", "Glossary"], ["print.html", "Printable chart"], ["data.html", "Open data & notes"],
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
    // The footer states the site's three uses and files every page under one of them.
    const col = (h, t, links) => `<div><b>${h}</b><span class="meta">${t}</span>${links.map(([u, n]) => `<a href="${u}">${n}</a>`).join("")}</div>`;
    ftr.innerHTML = `<div class="inner sitemap">
      ${col("Use", "Bring a dispute of your own.", [["diagnose.html", "Diagnose"], ["diagnose.html#mismatch", "Mismatch finder"], ["compare.html", "Compare"]])}
      ${col("Browse", "See the whole map.", [["taxonomy.html", "Taxonomy"], ["methods.html", "Methods"], ["views.html", "Views"], ["glossary.html", "Glossary"]])}
      ${col("Read", "Follow one story.", [["paths.html", "Paths"], ["example.html", "Worked example"], ["texts.html", "Primary texts"], ["about.html", "About"]])}</div>
      <div class="inner"><a href="data.html">Download the data</a> · <a href="${REPO}/issues/new">Propose a correction</a> · <a href="${REPO}">Source on GitHub</a></div>`;
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
    const node = (x, y, col, name) => `${x === xM ? `<rect x="${x - 4}" y="${y - 4}" width="8" height="8" rx="1" fill="${col}"/>` : `<circle cx="${x}" cy="${y}" r="4" fill="${col}"/>`}<text ${lab(x)} y="${y + 4}">${name}</text>`;
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
    { h: "Three ways in", b: `<p><b>Use.</b> <a href="diagnose.html">Diagnose</a> asks a few questions about a dispute of your own and suggests methods that fit it. <a href="compare.html">Compare</a> sets two methods side by side.</p>
      <p><b>Browse.</b> The <a href="taxonomy.html">Taxonomy</a> draws the whole map. <a href="methods.html">Methods</a> and <a href="views.html">Views</a> list every entry.</p>
      <p><b>Read.</b> <a href="paths.html">Paths</a> are short tours that tell one story across traditions.</p>` },
    { h: "Read the diagram across", b: `${miniDiagram()}<p>Methods fill one column and views the other. A square marks a method and a circle marks a view. The diagram opens with its groups shut, so click a group to see its members. Click a name to trace its threads, and click it again to open it.</p>` },
    { h: "One panel for every entry", b: `<p>An entry opens in the same panel wherever you click it. The top line says where it sits, and the row beneath shows its neighbours in the group. The entry reads straight down: summary, the view it assumes, procedure, critique, primary text, then your own notes.</p>
      <p>One fold, “Reference”, holds what you look up: how secure the dating is, lineage, people, sources and links.</p>` },
    { h: "Carry things with you", b: `<p><b>Pin</b> an entry and it joins a tray at the foot of the page. The tray sends two methods to Compare, or two views to the mismatch finder.</p>
      <p>Focus a name in the diagram and press “Read these in sequence”. Everything lit becomes a reading sequence in the bar at the foot of the page, and “Reorder” lets you set the order. Filters set on one page hold on the next.</p>` },
    { h: "Find your way back", b: `<p>Press <kbd>/</kbd> to search methods, views, people and terms. Click the empty search box to see what you opened last. Dotted underlines in the text open glossary cards.</p>
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
        <h3>Marks and names</h3>
        <dl class="helpdl">
          <dt>${H.dot("var(--ink-2)", true)} Square</dt><dd>A method, or the aim that groups methods. The traditions call the aim a <i>telos</i>: what the exchange is for.</dd>
          <dt>${H.dot("var(--ink-2)")} Circle</dt><dd>A view, or the place where a view says the dispute lives. This site calls that place the <i>domain</i>.</dd>
          <dt>Colour</dt><dd>Each group keeps one colour on every page, and the groups keep one order.</dd>
        </dl>
        <h3>The diagram</h3>${miniDiagram()}
        <dl class="helpdl">
          <dt>Groups</dt><dd>The diagram opens with every group shut. Click a group to open it, or use “Open all groups”. A band between two shut groups is wider when it carries more methods.</dd>
          <dt>Threads</dt><dd>The diagram draws each method’s primary view. “Show all links” adds the secondary views. A dashed thread marks a pairing that scholars contest.</dd>
          <dt>Focus</dt><dd>Hover a name to trace it. Click to hold the focus, and click again to open the entry. “Swap sides” exchanges the columns.</dd>
          <dt>Filters</dt><dd>One filter bar serves the diagram, the lineage map, the table and the two lists. Pick chips to narrow by aim, by where the dispute lives, or by culture. “Clear all filters” resets it.</dd>
        </dl>
        <h3>Entries</h3>
        <dl class="helpdl">
          <dt>One panel</dt><dd>Every link to an entry opens the same panel. Its first line is a breadcrumb, and the row beneath shows the entry among its neighbours.</dd>
          <dt>Reference</dt><dd>The one fold in an entry. It holds “Whose reading?”, which names the source or scholar behind a disputed claim, the flags for dating and pairing (● firm, ◐ approximate, ○ contested), lineage, people, sources and links. It stays open on the next entry once you open it.</dd>
          <dt>Pin</dt><dd>Pinned entries wait in the tray at the foot of the page. The tray sends them to Compare or to the mismatch finder, or loads them as a reading sequence.</dd>
          <dt>Sequence</dt><dd>In the diagram, focus a name and press “Read these in sequence” to load everything lit. “Reorder” in the bar moves or removes stops. A named path can be reordered the same way.</dd>
          <dt>Notes</dt><dd>“Your notes” sits under each entry’s text and saves private notes in this browser. Export them from <a href="data.html">Open data &amp; notes</a>.</dd>
        </dl>
        <h3>Tools</h3>
        <dl class="helpdl">
          <dt><a href="diagnose.html">Diagnose</a></dt><dd>Answer a few questions about a dispute and get the domains in play and the methods that fit. One button shows the result in the diagram. The mismatch finder takes two views and shows how each party’s method looks to the other.</dd>
          <dt><a href="compare.html">Compare</a></dt><dd>Two methods side by side.</dd>
          <dt><a href="paths.html">Paths</a></dt><dd>Guided tours through the entries. The bar at the foot of the page keeps your place.</dd>
          <dt><a href="views.html?tab=gaps">Views without a method</a></dt><dd>The views no method is built on, with a sketch of a method for each.</dd>
        </dl>
        <h3>Keys</h3>
        <p><kbd>/</kbd> search · <kbd>Esc</kbd> close a panel · <kbd>←</kbd> <kbd>→</kbd> previous and next entry in a group, or stop on a path</p>
      </div>
      <div class="modal-foot"><span></span><span><button type="button" class="btn" data-a="tour">Replay the welcome tour</button> <button type="button" class="btn primary" data-a="x">Close</button></span></div>`);
    d.querySelectorAll("[data-a]").forEach((b) => (b.onclick = () => (b.dataset.a === "tour" ? H.welcome(0) : d.close())));
  };
  function firstVisit() {
    if (document.body.dataset.page === "print" || /^#(e|p|g|tour)=/.test(location.hash) || location.search || tour) return;
    try { if (localStorage.getItem("hod-welcomed")) return; } catch (e) { return; }
    H.welcome(0);
  }

  /* ── search ───────────────────────────────────────────── */
  function searchIndex() {
    const idx = [];
    H.methods.forEach((m) => idx.push({ kind: "Method", id: m.id, label: m.name, sub: H.strip(m.when), col: H.teloColor[m.telos], sq: true, hay: H.fold([m.name, m.native, m.who].join(" ")), body: H.fold(m.summary) }));
    H.views.forEach((v) => idx.push({ kind: "View", id: v.id, label: v.name, sub: H.D[v.domain].name, col: H.domainColor[v.domain], hay: H.fold([v.name, v.who].join(" ")), body: H.fold(v.summary) }));
    (H.people || []).forEach((p) => idx.push({ kind: "Person", id: "p:" + p.id, label: p.name, sub: H.year(p.born) + "–" + (p.died ? H.year(p.died) : ""), col: "var(--ink-3)", hay: H.fold(p.name), body: "" }));
    (H.glossary || []).forEach((g) => idx.push({ kind: "Term", id: "g:" + g.id, label: g.term, sub: g.lang, col: "var(--ink-3)", hay: H.fold(g.term + " " + g.match.join(" ")), body: H.fold(g.def) }));
    (H.paths || []).forEach((p) => idx.push({ kind: "Path", id: "t:" + p.id, label: p.name, sub: "reading path", col: "var(--accent)", hay: H.fold(p.name), body: H.fold(p.blurb) }));
    return idx;
  }
  const KR = { Method: 0, View: 1, Person: 2, Term: 3, Path: 4 };
  function initSearch(input, box) {
    let idx = null, sel = 0, res = [];
    let head = "";
    const render = () => {
      box.innerHTML = res.length ? head + res.map((r, i) => `<div class="sr${i === sel ? " sel" : ""}" role="option" data-i="${i}">${H.dot(r.col, r.sq)}<b>${r.label}</b> <span class="meta">${r.kind} · ${r.sub || ""}</span></div>`).join("")
        : `<div class="sr meta">No matches</div>`;
      box.hidden = false;
    };
    const go = (r) => { box.hidden = true; input.value = ""; input.blur(); H.goto(r.id); };
    // With the box empty, it lists what was opened last, so the way back never depends on the browser's Back button.
    const recents = () => {
      idx = idx || searchIndex();
      res = H.recent().map((id) => idx.find((r) => r.id === id)).filter(Boolean);
      if (!res.length) { box.hidden = true; return; }
      head = `<div class="sr-head">Recently viewed</div>`; sel = 0; render();
    };
    input.addEventListener("focus", () => { if (!input.value.trim()) recents(); });
    input.addEventListener("input", () => {
      idx = idx || searchIndex();
      const q = H.fold(input.value.trim());
      if (!q) return recents();
      head = "";
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
    if (!id) return;
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
    return `<a class="xref" data-id="${id}" href="${H.href(id)}">${H.mark(id)}${x.name}${opts.star ? " ★" : ""}</a>`;
  };
  H.plink = (pid) => { const p = H.P[pid]; return p ? `<a class="xref" data-id="p:${pid}" href="taxonomy.html?tab=people#p=${pid}">${p.name}</a>` : pid; };
  H.chip = (label, color, sq) => `<span class="chip">${H.dot(color, sq)}${label}</span>`;

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
  H.notesBox = (id) => `<div class="notes"><label for="note-${id}">Your notes</label>
      <textarea id="note-${id}" data-note="${id}" rows="2">${H.esc(H.getNote(id))}</textarea></div>`;
  H.fixLink = (id, name) => {
    const body = encodeURIComponent(`Entry: ${name} (${id})\nPage: ${location.origin}${location.pathname}#e=${id}\n\nWhat is wrong or missing:\n\nSource for the correction:\n`);
    return `<p class="meta"><a href="${REPO}/issues/new?title=${encodeURIComponent("Correction: " + name)}&body=${body}" target="_blank" rel="noopener">Propose a correction on GitHub ↗</a></p>`;
  };
  document.addEventListener("input", (e) => {
    const t = e.target; if (!t.dataset || !t.dataset.note) return;
    try { if (t.value) localStorage.setItem(noteKey(t.dataset.note), t.value); else localStorage.removeItem(noteKey(t.dataset.note)); } catch (err) {}
  });

  /* ── entry renderers ─────────────────────────────────── */
  H.peopleFor = (id) => (H.people || []).filter((p) => p.methods.includes(id) || p.views.includes(id));
  H.firstSentence = (s) => H.strip(s).split(/(?<=[.!?’])\s+(?=[A-Z‘“])/)[0];

  // The group an entry belongs to: a method's aim or a view's domain, with its members in date order.
  H.groupOf = (id) => {
    const isM = !!H.M[id], x = H.get(id);
    const g = isM ? H.T[x.telos] : H.D[x.domain];
    const items = (isM ? H.methods.filter((m) => m.telos === g.id) : H.views.filter((v) => v.domain === g.id)).slice().sort((a, b) => a.date - b.date);
    return { isM, g, items, i: items.findIndex((y) => y.id === id), color: H.colorOf(id), page: isM ? "methods.html" : "views.html", pageName: isM ? "Methods" : "Views" };
  };
  // Breadcrumb, then a strip that shows the entry among its neighbours in the group.
  H.crumbs = (id) => {
    const G = H.groupOf(id), x = H.get(id);
    return `<nav class="crumbs" aria-label="Breadcrumb"><a href="${G.page}">${G.pageName}</a><span class="sep">›</span><a href="${G.page}#g-${G.g.id}">${H.dot(G.color, G.isM)}${G.g.name}</a><span class="sep">›</span><span>${H.strip(x.name)}</span></nav>`;
  };
  H.hereMap = (id) => {
    const G = H.groupOf(id), lo = Math.max(0, G.i - 2), hi = Math.min(G.items.length - 1, G.i + 2);
    const cut = lo > 0 || hi < G.items.length - 1;
    return `<nav class="here${G.isM ? " sq" : ""}" style="--g:${G.color}" aria-label="Neighbours in ${G.g.name}">
      ${lo > 0 ? `<span class="ell">…</span>` : ""}${G.items.map((y, j) => y.id === id ? `<b class="cur" aria-current="true">${H.strip(y.name)}</b>`
        : `<a class="xref${j < lo || j > hi ? " far" : ""}" data-id="${y.id}" href="${H.href(y.id)}">${H.strip(y.name)}</a>`).join("")}${hi < G.items.length - 1 ? `<span class="ell">…</span>` : ""}
      ${cut ? `<button type="button" class="linkbtn" data-a="whole">whole group</button>` : ""}</nav>`;
  };
  H.stepRow = (id) => {
    const G = H.groupOf(id), p = G.items[G.i - 1], n = G.items[G.i + 1];
    return `<div class="steprow">${p ? `<a class="xref btn" data-id="${p.id}" href="${H.href(p.id)}">← ${H.strip(p.name)}</a>` : "<span></span>"}
      <span class="meta">in ${G.g.name}</span>${n ? `<a class="xref btn" data-id="${n.id}" href="${H.href(n.id)}">${H.strip(n.name)} →</a>` : "<span></span>"}</div>`;
  };

  // Sections of an entry sit behind labelled folds. A section the reader opens stays open on the next entry.
  let openSecs; try { openSecs = new Set(JSON.parse(sessionStorage.getItem("hod-secs") || "[]")); } catch (e) { openSecs = new Set(); }
  const sec = (key, label, body) => (body && body.trim() ? `<details class="sec" data-sec="${key}"${openSecs.has(key) ? " open" : ""}><summary>${label}</summary><div class="sec-body">${body}</div></details>` : "");
  document.addEventListener("toggle", (e) => {
    const d = e.target; if (!d.dataset || !d.dataset.sec) return;
    if (d.open) openSecs.add(d.dataset.sec); else openSecs.delete(d.dataset.sec);
    try { sessionStorage.setItem("hod-secs", JSON.stringify([...openSecs])); } catch (err) {}
  }, true);
  const head = (x, tag) => `${H.crumbs(x.id)}${H.hereMap(x.id)}
    <div class="ehead"><${tag}>${H.mark(x.id)}${x.name}</${tag}>${H.pinBtn(x.id)}</div>`;

  // Every method uses one skeleton. What a reader reads is in view: summary, assumption, procedure, practice, critique,
  // primary text, then the reader's own notes. One fold, "Reference", holds what is looked up: dating, lineage, people, sources, tools.
  H.renderMethod = (m, tag = "h2") => {
    const ppl = H.peopleFor(m.id), pv = H.V[m.views[0]];
    return `${head(m, tag)}
    ${m.native ? `<div class="native">${m.native}</div>` : ""}
    <div class="when">${m.when}${m.who ? ` · ${m.who}` : ""}</div>
    <div class="chips">${H.chip("Aim: " + H.T[m.telos].name, H.teloColor[m.telos], true)}${H.chip(H.F[m.family].name, "var(--ink-3)", true)}</div>
    <p>${H.glossify(m.summary, null)}</p>
    <h4 class="sk">What it assumes</h4>
    <p class="assumes">${H.link(pv.id, { star: true })}: ${H.firstSentence(pv.summary)}${m.views.length > 1 ? ` <span class="meta">It also presupposes ${m.views.slice(1).map((v) => H.link(v)).join(", ")}.</span>` : ""}</p>
    ${(m.moves || []).length ? `<h4 class="sk">Procedure</h4><ol class="moves">${m.moves.map((x) => `<li>${x}</li>`).join("")}</ol>` : ""}
    ${m.third ? `<h4 class="sk">In practice</h4><dl class="facts"><dt>Third party</dt><dd>${m.third}</dd><dt>Ends well when</dt><dd>${m.resolution}</dd><dt>How it fails</dt><dd>${m.failure}</dd></dl>` : ""}
    ${m.critic ? `<div class="critique"><b>Strongest critique</b> <span class="meta">from ${H.link(m.critic.view)}</span><p>${m.critic.text}</p><span class="meta">— ${m.critic.who}</span></div>` : ""}
    ${m.note ? `<p class="note">${m.note}</p>` : ""}
    ${H.excerptsFor(m.id)}
    ${H.notesBox(m.id, m.name)}
    ${sec("ref", "Reference", `${H.readingFor(m)}${H.confBadges(m)}
      ${m.parents.length ? `<p class="rel"><b>Descends from</b>${m.parents.map((p) => H.link(p)).join(", ")}</p>` : ""}
      ${m.children.length ? `<p class="rel"><b>Gave rise to</b>${m.children.map((p) => H.link(p)).join(", ")}</p>` : ""}
      ${ppl.length ? `<p class="rel"><b>People</b>${ppl.map((p) => H.plink(p.id)).join(", ")}</p>` : ""}
      <p class="rel"><b>Tools</b><a href="compare.html?a=${m.id}">Compare with another method</a> · <a href="taxonomy.html?focus=${m.id}">Show in diagram</a> · <a href="#e=${m.id}" class="permalink">Permalink</a></p>
      <h4 class="sk">Sources</h4>${H.citeList(m.cite)}${H.fixLink(m.id, m.name)}`)}
    ${H.stepRow(m.id)}`;
  };
  // One row per entry on the list pages. A row opens the entry panel, as every other link to an entry does.
  H.rowEntry = (x) => {
    const isM = !!H.M[x.id];
    // The chip carries the other half of the pairing: a method shows its primary view, and a view says so when no method is built on it.
    const tagc = isM ? H.chip("assumes: " + H.V[x.views[0]].name, H.domainColor[H.V[x.views[0]].domain])
      : x.methods.length ? "<span></span>" : H.chip("no method", "transparent");
    return `<a class="row xref" id="${x.id}" data-id="${x.id}" href="${H.href(x.id)}"><span class="f-name">${H.mark(x.id)}${x.name}</span>${tagc}
      <span class="f-when">${x.when}${x.who ? ` · ${x.who}` : ""}</span>
      <span class="f-line">${H.firstSentence(x.summary)}</span></a>`;
  };

  // Whose reading: the claims in an entry that rest on a source, a consensus or a named scholar.
  // A claim that is only this site's own reading is the default, so it gets no label and is not listed.
  H.statusLabel = { attested: "Attested in the source", consensus: "Scholarly consensus", reading: "A named scholar’s reading" };
  H.readingFor = (x) => {
    const r = ((H.readings || {})[x.id] || []).filter((c) => H.statusLabel[c.status]); if (!r.length) return "";
    return `<div class="reading"><b>Whose reading?</b>${r.map((c) => `<p><span class="st st-${c.status}">${H.statusLabel[c.status]}</span> ${c.claim}${c.by ? ` <span class="meta">${c.by}.</span>` : ""}</p>`).join("")}</div>`;
  };
  H.renderView = (v, tag = "h2") => {
    const ppl = H.peopleFor(v.id);
    const gap = (H.gaps || {})[v.id];
    return `${head(v, tag)}
    <div class="when">${v.when}${v.who ? ` · ${v.who}` : ""}</div>
    <div class="chips">${H.chip("Lives in: " + H.D[v.domain].name, H.domainColor[v.domain])}</div>
    <p>${H.glossify(v.summary, null)}</p>
    <p class="rel"><b>Remedy implied</b>${v.implies}</p>
    <p class="rel"><b>Methods presupposing it</b>${v.methods.length ? v.methods.map((x) => H.link(x.id, { star: x.primary })).join(", ") : `none in this survey. <a href="views.html?tab=gaps#${v.id}">See the views without a method</a>${gap ? ` for a sketch (“${gap.method}”)` : ""}.`}</p>
    ${v.quote ? `<blockquote>“${v.quote.t}”<cite>${v.quote.src}</cite></blockquote>` : ""}
    ${H.excerptsFor(v.id)}
    ${H.notesBox(v.id, v.name)}
    ${sec("ref", "Reference", `${H.readingFor(v)}${H.confBadges(v)}
      ${ppl.length ? `<p class="rel"><b>People</b>${ppl.map((p) => H.plink(p.id)).join(", ")}</p>` : ""}
      <p class="rel"><b>Tools</b><a href="diagnose.html?a=${v.id}#mismatch">Use in the mismatch finder</a> · <a href="taxonomy.html?focus=${v.id}">Show in diagram</a> · <a href="#e=${v.id}" class="permalink">Permalink</a></p>
      <h4 class="sk">Sources</h4>${H.citeList(v.cite)}${H.fixLink(v.id, v.name)}`)}
    ${H.stepRow(v.id)}`;
  };

  /* ── stored state: recently viewed, pinned tray, reading path ── */
  const store = (k, v, sess) => { try { (sess ? sessionStorage : localStorage).setItem(k, JSON.stringify(v)); } catch (e) {} };
  const load = (k, d, sess) => { try { const v = JSON.parse((sess ? sessionStorage : localStorage).getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
  const valid = (id) => (id.startsWith("p:") ? !!H.P[id.slice(2)] : !!H.get(id));
  H.recent = () => load("hod-recent", []).filter(valid);
  const remember = (id) => store("hod-recent", [id, ...H.recent().filter((x) => x !== id)].slice(0, 8));
  H.tray = () => load("hod-tray", []).filter((id) => H.get(id));
  H.pinBtn = (id) => { const on = H.tray().includes(id);
    return `<button type="button" class="pinbtn" data-pin="${id}" aria-pressed="${on}" title="${on ? "Remove from the pinned tray" : "Keep in the pinned tray, to compare later"}">${on ? "Pinned" : "Pin"}</button>`; };
  H.togglePin = (id) => { const t = H.tray(); store("hod-tray", t.includes(id) ? t.filter((x) => x !== id) : [...t, id]); renderDock();
    document.querySelectorAll(`[data-pin="${id}"]`).forEach((b) => (b.outerHTML = H.pinBtn(id))); };
  // The sequence being read: a named path ({ path, i }) or a list the reader loaded ({ steps, name, i }).
  let tour = load("hod-path", null, true), editing = false;
  if (tour && !(tour.steps ? tour.steps.filter((id) => H.get(id)).length : H.PATH[tour.path])) tour = null;
  const tsteps = () => (tour.steps || H.PATH[tour.path].steps);
  const go = (i) => { const st = tsteps(); tour.i = Math.max(0, Math.min(st.length - 1, i)); store("hod-path", tour, true); renderDock(); H.open(st[tour.i]); };
  // Load a list of entries as a reading sequence. The dock then steps through it and lets the reader reorder it.
  H.startSeq = (ids, name) => {
    const st = [...new Set(ids)].filter((id) => H.get(id)); if (!st.length) return;
    tour = { steps: st, name: name || "Your sequence", i: 0 }; editing = st.length > 1; go(0);
  };

  // One dock at the foot of every page holds the reading path, when one is being followed, and the pinned tray.
  let dock;
  function renderDock() {
    if (!dock) { dock = document.createElement("div"); dock.className = "dock noprint"; document.body.append(dock);
      dock.addEventListener("click", (e) => {
        const b = e.target.closest("[data-a]"); if (!b) return;
        const a = b.dataset.a;
        if (a === "prev") go(tour.i - 1);
        if (a === "next") go(tour.i + 1);
        if (a === "stop") go(tour.i);
        if (a === "goto") go(+b.dataset.i);
        if (a === "leave") { tour = null; editing = false; store("hod-path", null, true); renderDock(); }
        if (a === "edit") { editing = !editing; renderDock(); }
        if (a === "seq") H.startSeq(H.tray(), "Pinned entries");
        // Reordering works on a copy, so a named path becomes the reader's own sequence once it is changed.
        if (a === "mv" || a === "rm") {
          const st = tsteps().slice(), k = +b.dataset.i, cur = st[tour.i];
          if (a === "rm") st.splice(k, 1); else { const t = k + +b.dataset.d; if (t < 0 || t >= st.length) return; [st[k], st[t]] = [st[t], st[k]]; }
          if (!st.length) { tour = null; editing = false; store("hod-path", null, true); return renderDock(); }
          tour = { steps: st, name: tour.name || H.PATH[tour.path].name, i: Math.max(0, st.indexOf(cur)) };
          store("hod-path", tour, true); renderDock();
        }
        if (a === "unpin") H.togglePin(b.dataset.id);
        if (a === "clear") { store("hod-tray", []); renderDock(); document.querySelectorAll("[data-pin]").forEach((x) => (x.outerHTML = H.pinBtn(x.dataset.pin))); }
      }); }
    const t = H.tray(), ms = t.filter((id) => H.M[id]).slice(-2), vs = t.filter((id) => H.V[id]).slice(-2);
    let html = "";
    if (tour) { const st = tsteps(), n = st.length, cur = st[tour.i], name = tour.name || H.PATH[tour.path].name;
      html += `<div class="pathbar"><span class="lab">${tour.steps ? "Sequence" : "Path"}</span><b>${name}</b>
        <span class="pips">${st.map((_, j) => `<i class="${j === tour.i ? "on" : ""}"></i>`).join("")}</span>
        <button type="button" class="linkbtn" data-a="stop">${tour.i + 1} of ${n}: ${H.strip(H.get(cur).name)}</button>
        <span class="grow"></span><button type="button" class="btn" data-a="prev" ${tour.i === 0 ? "disabled" : ""}>← Previous</button>
        <button type="button" class="btn" data-a="next" ${tour.i === n - 1 ? "disabled" : ""}>Next →</button>
        <button type="button" class="linkbtn" data-a="edit" aria-expanded="${editing}">${editing ? "Done ordering" : "Reorder"}</button>
        <button type="button" class="linkbtn" data-a="leave">Leave</button></div>`;
      if (editing) html += `<div class="seqedit"><span class="lab">Order</span><ol>${st.map((id, j) => `<li class="${j === tour.i ? "on" : ""}">
          <button type="button" class="mv" data-a="mv" data-i="${j}" data-d="-1" ${j === 0 ? "disabled" : ""} aria-label="Move earlier">◀</button>
          <button type="button" class="nm" data-a="goto" data-i="${j}">${H.mark(id)}${H.strip(H.get(id).name)}</button>
          <button type="button" class="mv" data-a="mv" data-i="${j}" data-d="1" ${j === n - 1 ? "disabled" : ""} aria-label="Move later">▶</button>
          <button type="button" class="mv" data-a="rm" data-i="${j}" aria-label="Remove from the sequence">×</button></li>`).join("")}</ol></div>`; }
    if (t.length) html += `<div class="tray"><span class="lab">Pinned</span>
        ${t.map((id) => `<span class="chip">${H.mark(id)}<a class="xref" data-id="${id}" href="${H.href(id)}">${H.strip(H.get(id).name)}</a><button type="button" data-a="unpin" data-id="${id}" aria-label="Unpin ${H.esc(H.strip(H.get(id).name))}">×</button></span>`).join("")}
        <span class="grow"></span>
        ${ms.length ? `<a class="btn" href="compare.html?a=${ms[0]}${ms[1] ? "&b=" + ms[1] : ""}" title="Sends the two methods pinned last">Compare</a>` : ""}
        ${vs.length ? `<a class="btn" href="diagnose.html?a=${vs[0]}${vs[1] ? "&b=" + vs[1] : ""}#mismatch" title="Sends the two views pinned last">Mismatch finder</a>` : ""}
        <button type="button" class="btn" data-a="seq" title="Load the pinned entries as a reading sequence">Read in sequence</button>
        <button type="button" class="linkbtn" data-a="clear">Clear</button></div>`;
    dock.innerHTML = html; dock.hidden = !html;
    document.body.classList.toggle("has-dock", !!html);
    document.body.style.setProperty("--dock-h", html ? dock.offsetHeight + "px" : "0px");
  }
  document.addEventListener("click", (e) => { const b = e.target.closest && e.target.closest("[data-pin]"); if (b) { e.preventDefault(); H.togglePin(b.dataset.pin); } });

  /* ── the entry panel: one way of opening an entry, on every page ── */
  let drawer, current = null;
  const typing = () => /input|textarea|select/i.test(document.activeElement.tagName);
  function ensureDrawer() {
    if (drawer) return drawer;
    drawer = document.createElement("aside");
    drawer.className = "drawer"; drawer.setAttribute("aria-live", "polite");
    document.body.append(drawer);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") H.close();
      if (!drawer.classList.contains("open") || typing() || !["ArrowRight", "ArrowLeft"].includes(e.key)) return;
      const d = e.key === "ArrowRight" ? 1 : -1;
      // Arrows step the reading path while its current stop is open, and the group otherwise.
      if (tour && tsteps()[tour.i] === current) return go(tour.i + d);
      if (current && H.get(current)) { const G = H.groupOf(current), y = G.items[G.i + d]; if (y) H.open(y.id); }
    });
    drawer.addEventListener("click", (e) => {
      const w = e.target.closest("[data-a=whole]");
      if (w) { const n = w.closest(".here"); n.classList.toggle("all"); w.textContent = n.classList.contains("all") ? "neighbours only" : "whole group"; }
    });
    return drawer;
  }
  function setHash(h) { try { history.replaceState(null, "", h ? "#" + h : location.pathname + location.search); } catch (e) {} }
  function show(kicker, html, hash, cls) {
    ensureDrawer();
    drawer.innerHTML = `<button class="close" aria-label="Close">×</button>${kicker ? `<div class="kicker">${kicker}</div>` : ""}
      <div class="entry ${cls || ""}">${html}</div>`;
    drawer.querySelector(".close").onclick = H.close;
    drawer.classList.add("open"); drawer.scrollTop = 0;
    setHash(hash);
  }
  H.open = (id) => {
    const x = H.get(id); if (!x) return;
    const kind = H.kind(id); current = id; remember(id);
    const onPath = tour && !tour.steps && tsteps()[tour.i] === id;
    show("", kind === "method" ? H.renderMethod(x) : H.renderView(x), onPath ? `tour=${tour.path}.${tour.i}` : `e=${id}`, kind);
    drawer.style.setProperty("--g", H.colorOf(id));
    document.querySelectorAll(".row.here-now").forEach((r) => r.classList.remove("here-now"));
    const row = document.querySelector(`.row[data-id="${id}"]`); if (row) row.classList.add("here-now");
    if (H.onOpen) H.onOpen(id);
  };
  H.openPerson = (pid) => {
    const p = H.P[pid]; if (!p) return; current = "p:" + pid; remember(current);
    const infl = p.infl.map(H.plink).join(", ");
    const heirs = H.people.filter((q) => q.infl.includes(pid)).map((q) => H.plink(q.id)).join(", ");
    show("Person", `<h2>${p.name}</h2><div class="when">${H.year(p.born)}–${p.died ? H.year(p.died) : "present"}${p.approx ? " (approximate)" : ""} · ${H.regions.find((r) => r.id === p.region).name}</div>
      ${p.methods.length ? `<p class="rel"><b>Methods</b>${p.methods.map((m) => H.link(m)).join(", ")}</p>` : ""}
      ${p.views.length ? `<p class="rel"><b>Views</b>${p.views.map((v) => H.link(v)).join(", ")}</p>` : ""}
      ${infl ? `<p class="rel"><b>Drew on or wrote against</b>${infl}</p>` : ""}
      ${heirs ? `<p class="rel"><b>Taken up by</b>${heirs}</p>` : ""}
      <p><a href="taxonomy.html?tab=people#p=${pid}">Show in the influence map →</a></p>`, `p=${pid}`);
    if (H.onOpen) H.onOpen("p:" + pid);
  };
  H.openGloss = (gid) => {
    const g = H.G[gid]; if (!g) return; current = null;
    show("Glossary", `<h2>${g.term}</h2><div class="when">${g.lang}</div><p>${g.def}</p>
      ${g.see && H.get(g.see) ? `<p class="rel"><b>See</b>${H.link(g.see)}</p>` : ""}<p><a href="glossary.html#${gid}">Full glossary →</a></p>`, `g=${gid}`);
  };
  // Path mode: the path and the reader's place in it are kept for the visit and shown in the dock on every page.
  H.startTour = (pathId, i) => {
    if (!H.PATH[pathId]) return;
    tour = { path: pathId, i: 0 }; editing = false; go(i);
  };
  H.close = () => { current = null; if (drawer) drawer.classList.remove("open"); setHash("");
    document.querySelectorAll(".row.here-now").forEach((r) => r.classList.remove("here-now")); if (H.onClose) H.onClose(); };
  // Any link to an entry, a person or a term opens the panel in place.
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("a.xref");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault(); H.goto(a.dataset.id);
  });

  // permalinks: #e=id, #p=person, #g=term, #tour=path.i; on the list pages a bare #id opens that entry.
  function fromHash() {
    const h = decodeURIComponent(location.hash.slice(1));
    const m = h.match(/^(e|p|g|tour)=(.+)$/);
    if (!m) {
      const pg = document.body.dataset.page;
      if (h && H.get(h) && (pg === "methods" || pg === "views") && !/tab=gaps/.test(location.search)) {
        H.open(h); const row = document.getElementById(h); if (row) row.scrollIntoView({ block: "center" });
      }
      return;
    }
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

  /* ── legend and the shared filter bar ────────────────── */
  // A static key: one chip per group. Methods and their aims take a square mark, views and their domains a round one.
  H.legend = (title, items, colorMap, sq) => {
    const div = document.createElement("div"); div.className = "legend";
    div.innerHTML = `<span class="legend-title">${title}</span>` + items.map((t) =>
      `<span class="chip" title="${H.esc(t.gloss || "")}">${H.dot(colorMap[t.id], sq)}${t.name}</span>`).join("");
    return div;
  };

  /* One filter state for the diagram, the lineage map, the table and the two lists. null means "all".
     The address bar carries it, and the visit remembers it, so a filter set on one page holds on the next. */
  const FK = [["telos", "Aim", () => H.teloi, () => H.teloColor, true], ["domain", "Where it lives", () => H.domains, () => H.domainColor, false], ["culture", "Culture", () => H.cultures, () => null, true]];
  H.filters = (() => {
    const q = new URLSearchParams(location.search), saved = load("hod-filters", {}, true), F = {};
    const inUrl = FK.some(([k]) => q.get(k)) || q.get("only");
    FK.forEach(([k, , all]) => {
      const raw = inUrl ? (q.get(k) || "").split(",") : saved[k] || [];
      const s = new Set(raw.filter((x) => all().some((y) => y.id === x)));
      F[k] = s.size && s.size < all().length ? s : null;
    });
    const only = (q.get("only") || "").split(",").filter((x) => H.get(x));
    F.only = only.length ? new Set(only) : null;
    return F;
  })();
  H.keepM = (m, F = H.filters) => (!F.only || F.only.has(m.id)) && (!F.telos || F.telos.has(m.telos)) && (!F.culture || F.culture.has(H.cultureOf(m)))
    && (!F.domain || m.views.some((v) => F.domain.has(H.V[v].domain)));
  H.keepV = (v, F = H.filters) => (!F.only || F.only.has(v.id)) && (!F.domain || F.domain.has(v.domain))
    && (!(F.telos || F.culture) || v.methods.some((x) => H.keepM(H.M[x.id], F)));
  H.filtersActive = (F = H.filters) => !!(F.telos || F.domain || F.culture || F.only);
  function saveFilters() {
    const F = H.filters, out = {};
    FK.forEach(([k]) => { if (F[k]) out[k] = [...F[k]]; });
    store("hod-filters", out, true);
    const p = new URLSearchParams(location.search);
    FK.forEach(([k]) => { if (F[k]) p.set(k, [...F[k]].join(",")); else p.delete(k); });
    if (!F.only) p.delete("only");
    const s = p.toString();
    try { history.replaceState(null, "", location.pathname + (s ? "?" + s : "") + location.hash); } catch (e) {}
  }
  H.filterBar = (host, onChange) => {
    const F = H.filters;
    const render = () => {
      const state = [F.only ? "the Diagnose result" : "", ...FK.map(([k, label, all]) => (F[k] ? `${label.toLowerCase()}: ${all().filter((x) => F[k].has(x.id)).map((x) => x.name).join(", ")}` : ""))].filter(Boolean);
      const wasOpen = host.querySelector("details") ? host.querySelector("details").open : false;
      host.className = "filters";
      host.innerHTML = `<details${wasOpen ? " open" : ""}><summary><span class="f-title">Filters</span><span class="f-state">${state.length ? state.join(" · ") : "showing everything"}</span></summary>
        ${FK.map(([k, label, all, colors, sq]) => `<div class="legend" data-k="${k}"><span class="legend-title">${label}</span>${all().map((t) =>
          `<button class="chip" type="button" aria-pressed="${F[k] ? F[k].has(t.id) : "mixed"}" data-id="${t.id}" title="${H.esc(t.gloss || "")}">${colors() ? H.dot(colors()[t.id], sq) : ""}${t.name}</button>`).join("")}</div>`).join("")}
        <p class="meta">Pick chips to narrow what is shown. A method is kept when its aim and culture are picked and one of its views lives in a picked place.</p></details>
        <button type="button" class="btn clear"${H.filtersActive() ? "" : " hidden"}>Clear all filters</button>`;
      host.querySelectorAll("button.chip").forEach((b) => (b.onclick = () => {
        const k = b.closest("[data-k]").dataset.k, all = FK.find((x) => x[0] === k)[2]();
        const s = new Set(F[k] || []);
        if (s.has(b.dataset.id)) s.delete(b.dataset.id); else s.add(b.dataset.id);
        F[k] = s.size && s.size < all.length ? s : null;
        saveFilters(); render(); onChange();
      }));
      host.querySelector(".clear").onclick = () => { FK.forEach(([k]) => (F[k] = null)); F.only = null; saveFilters(); render(); onChange(); };
    };
    render();
    return { render };
  };

  document.addEventListener("DOMContentLoaded", () => { chrome(); renderDock(); setTimeout(fromHash, 0); setTimeout(firstVisit, 250); });
  window.addEventListener("resize", () => { if (dock && !dock.hidden) document.body.style.setProperty("--dock-h", dock.offsetHeight + "px"); });
})();
