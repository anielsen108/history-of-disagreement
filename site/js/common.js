/* Shared helpers: palettes, lookups, chrome, drawer, entry rendering. */
(function () {
  const H = window.HOD;

  H.teloColor = {
    truth: "#2b6cb0", victory: "#c53030", formation: "#a07a1c", decision: "#6b46c1",
    settlement: "#2c9a8a", understanding: "#dd6b20", plurality: "#4a8a2e", release: "#a35d8a"
  };
  H.domainColor = {
    epistemic: "#3a6ea5", linguistic: "#7d5ba6", axiological: "#b7791f", interest: "#2f855a",
    power: "#9b2c2c", psyche: "#c05621", relational: "#b83280", contemplative: "#5f8b99", generative: "#5a6b2f"
  };

  const by = (arr) => Object.fromEntries(arr.map((x) => [x.id, x]));
  H.M = by(H.methods); H.V = by(H.views);
  H.T = by(H.teloi); H.F = by(H.families); H.D = by(H.domains);

  // reverse links
  H.methods.forEach((m) => { m.children = []; });
  H.views.forEach((v) => { v.methods = []; });
  H.methods.forEach((m) => {
    m.parents.forEach((p) => H.M[p].children.push(m.id));
    m.views.forEach((v, i) => H.V[v].methods.push({ id: m.id, primary: i === 0 }));
  });

  H.year = (y) => (y < 0 ? `${-y} BCE` : y < 1000 ? `${y} CE` : `${y}`);
  H.esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  H.strip = (s) => String(s).replace(/<[^>]+>/g, "");
  H.kind = (id) => (H.M[id] ? "method" : H.V[id] ? "view" : null);
  H.get = (id) => H.M[id] || H.V[id];
  H.colorOf = (id) => (H.M[id] ? H.teloColor[H.M[id].telos] : H.domainColor[H.V[id].domain]);

  /* ── chrome ───────────────────────────────────────────── */
  const pages = [
    ["index.html", "Overview"], ["taxonomy.html", "Taxonomy"], ["methods.html", "Methods"],
    ["views.html", "Views"], ["timeline.html", "Timeline"], ["sources.html", "Sources"], ["about.html", "About"]
  ];
  function chrome() {
    const here = (location.pathname.split("/").pop() || "index.html").replace(/\.html$/, "") || "index";
    const hdr = document.createElement("header");
    hdr.className = "site-header";
    hdr.innerHTML = `<div class="inner"><a class="brand" href="index.html">Disagreement<span>,</span> a history</a>
      <nav class="nav">${pages.map(([h, t]) => `<a href="${h}"${h.replace(".html", "") === here ? ' aria-current="page"' : ""}>${t}</a>`).join("")}</nav>
      <button class="theme-toggle" type="button" aria-label="Toggle colour theme">◐ theme</button></div>`;
    document.body.prepend(hdr);
    const ftr = document.createElement("footer");
    ftr.innerHTML = `<div class="inner">${H.methods.length} methods · ${H.views.length} views · ${Object.keys(H.sources).length} sources.
      Corrections and additions: <a href="https://github.com/anielsen108/history-of-disagreement">github.com/anielsen108/history-of-disagreement</a>.</div>`;
    document.body.append(ftr);
    const root = document.documentElement;
    try { const t = localStorage.getItem("hod-theme"); if (t) root.dataset.theme = t; } catch (e) {}
    hdr.querySelector(".theme-toggle").onclick = () => {
      const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
      root.dataset.theme = dark ? "light" : "dark";
      try { localStorage.setItem("hod-theme", root.dataset.theme); } catch (e) {}
    };
  }

  /* ── citations ────────────────────────────────────────── */
  H.citeList = (cites) => `<ol class="cites">${cites.map(([k, loc]) =>
    `<li>${H.sources[k]}${loc ? ` <span class="loc">— ${loc}</span>` : ""} <a href="sources.html#${k}" title="In bibliography">↗</a></li>`).join("")}</ol>`;

  /* ── links between entries ───────────────────────────── */
  H.href = (id) => (H.M[id] ? `methods.html#${id}` : `views.html#${id}`);
  H.link = (id, opts = {}) => {
    const x = H.get(id); if (!x) return id;
    const col = H.colorOf(id);
    return `<a class="xref" data-id="${id}" href="${H.href(id)}"><span class="dot" style="background:${col};display:inline-block;width:.55em;height:.55em;border-radius:50%;margin-right:.25em"></span>${x.name}${opts.star ? "★" : ""}</a>`;
  };

  /* ── entry renderers ─────────────────────────────────── */
  H.chip = (label, color) => `<span class="chip"><span class="dot" style="background:${color}"></span>${label}</span>`;

  H.renderMethod = (m, tag = "h3") => `
    <${tag}>${m.name}</${tag}>
    ${m.native ? `<div class="native">${m.native}</div>` : ""}
    <div class="when">${m.when}${m.who ? ` · ${m.who}` : ""}</div>
    <div class="chips">${H.chip("Telos: " + H.T[m.telos].name, H.teloColor[m.telos])}${H.chip(H.F[m.family].name, "var(--ink-3)")}</div>
    <p>${m.summary}</p>
    ${m.moves && m.moves.length ? `<ul class="moves">${m.moves.map((x) => `<li>${x}</li>`).join("")}</ul>` : ""}
    ${m.note ? `<p class="note">${m.note}</p>` : ""}
    <p class="rel"><b>Presupposes</b>${m.views.map((v, i) => H.link(v, { star: i === 0 })).join(", ")}</p>
    ${m.parents.length ? `<p class="rel"><b>Descends from</b>${m.parents.map((p) => H.link(p)).join(", ")}</p>` : ""}
    ${m.children.length ? `<p class="rel"><b>Gave rise to</b>${m.children.map((p) => H.link(p)).join(", ")}</p>` : ""}
    ${H.citeList(m.cite)}`;

  H.renderView = (v, tag = "h3") => `
    <${tag}>${v.name}</${tag}>
    <div class="when">${v.when}${v.who ? ` · ${v.who}` : ""}</div>
    <div class="chips">${H.chip("Domain: " + H.D[v.domain].name, H.domainColor[v.domain])}</div>
    <p>${v.summary}</p>
    ${v.quote ? `<blockquote>“${v.quote.t}”<cite>${v.quote.src}</cite></blockquote>` : ""}
    <p class="rel"><b>Remedy implied</b>${v.implies}</p>
    <p class="rel"><b>Methods presupposing it</b>${v.methods.length ? v.methods.map((x) => H.link(x.id, { star: x.primary })).join(", ") : "<i>none in this survey: a diagnosis still awaiting its procedure</i>"}</p>
    ${H.citeList(v.cite)}`;

  /* ── drawer ──────────────────────────────────────────── */
  let drawer;
  H.open = (id) => {
    const x = H.get(id); if (!x) return;
    if (!drawer) {
      drawer = document.createElement("aside");
      drawer.className = "drawer"; drawer.setAttribute("aria-live", "polite");
      document.body.append(drawer);
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") H.close(); });
    }
    const kind = H.kind(id);
    drawer.innerHTML = `<button class="close" aria-label="Close">×</button>
      <div class="kicker">${kind === "method" ? "Method" : "View of what disagreement is about"}</div>
      <div class="entry" style="border:0;padding-top:.3rem">${kind === "method" ? H.renderMethod(x, "h2") : H.renderView(x, "h2")}</div>
      <p><a href="${H.href(id)}">Open in ${kind === "method" ? "Methods" : "Views"} →</a></p>`;
    drawer.querySelector(".close").onclick = H.close;
    drawer.querySelectorAll("a.xref").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); H.open(a.dataset.id); }));
    drawer.classList.add("open"); drawer.scrollTop = 0;
    if (H.onOpen) H.onOpen(id);
  };
  H.close = () => { if (drawer) drawer.classList.remove("open"); if (H.onClose) H.onClose(); };

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
  H.legend = (title, items, colorMap, onToggle) => {
    const div = document.createElement("div"); div.className = "legend";
    div.innerHTML = `<span class="legend-title">${title}</span>` + items.map((t) =>
      `<button class="chip" type="button" aria-pressed="true" data-id="${t.id}" title="${H.esc(t.gloss || "")}"><span class="dot" style="background:${colorMap[t.id]}"></span>${t.name}</button>`).join("");
    if (onToggle) div.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => {
      b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") === "true" ? "false" : "true");
      const on = new Set([...div.querySelectorAll('button[aria-pressed="true"]')].map((x) => x.dataset.id));
      onToggle(on);
    }));
    return div;
  };

  document.addEventListener("DOMContentLoaded", chrome);
})();
