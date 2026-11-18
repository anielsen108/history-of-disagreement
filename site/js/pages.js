/* Page renderers for the list pages and for the lists that sit in tabs. Each page has <body data-page="...">. */
(function () {
  const H = window.HOD;
  const jump = (groups) => `<span class="legend-title">Jump to</span>` + groups.map((g) =>
    `<a class="chip" href="#g-${g.id}">${g.color ? H.dot(g.color, g.sq) : ""}${g.name}</a>`).join("");
  const groupHtml = (g, items) => `<div class="group-head" id="g-${g.id}">${g.color ? H.dot(g.color, g.sq) : ""}<h2 style="margin:0">${g.name}</h2></div>
    ${g.gloss ? `<p class="group-gloss">${g.gloss}</p>` : ""}${items.map(H.rowEntry).join("")}`;
  const none = `<p class="meta">Nothing matches. Clear the filters or the search box to see everything.</p>`;

  function methodsPage() {
    const host = document.getElementById("list");
    const sel = document.getElementById("groupby");
    const q = document.getElementById("q");
    function render() {
      const key = sel.value, term = q.value.trim().toLowerCase();
      const match = (m) => H.keepM(m) && (!term || H.strip([m.name, m.native, m.who, m.summary, m.when].join(" ")).toLowerCase().includes(term));
      const groups = (key === "telos" ? H.teloi.map((t) => ({ id: t.id, name: t.name, gloss: t.gloss, color: H.teloColor[t.id], sq: true, items: H.methods.filter((m) => m.telos === t.id) }))
        : key === "family" ? H.families.map((f) => ({ id: f.id, name: f.name, items: H.methods.filter((m) => m.family === f.id) }))
        : [{ id: "all", name: "In order of date", items: H.methods.slice() }])
        .map((g) => Object.assign(g, { items: g.items.filter(match).sort((a, b) => a.date - b.date) })).filter((g) => g.items.length);
      host.innerHTML = groups.map((g) => groupHtml(g, g.items)).join("") || none;
      document.getElementById("jump").innerHTML = key === "date" || !groups.length ? "" : jump(groups);
    }
    H.filterBar(document.getElementById("fbar"), render);
    sel.onchange = render; q.oninput = render; render();
  }

  function gapsHtml() {
    const ids = H.views.filter((v) => !v.methods.length).sort((a, b) => H.domains.findIndex((d) => d.id === a.domain) - H.domains.findIndex((d) => d.id === b.domain) || a.date - b.date);
    return ids.map((v) => { const g = (H.gaps || {})[v.id] || {};
      return `<section class="gcard" id="${v.id}" style="border-left:4px solid ${H.domainColor[v.domain]}">
        <div class="kicker" style="color:${H.domainColor[v.domain]}">${H.D[v.domain].name}</div>
        <h2>${H.link(v.id)}</h2><div class="meta">${v.when}${v.who ? " · " + v.who : ""}</div>
        <p>${H.glossify(v.summary)}</p>
        <p class="meta"><b>Why there is a gap:</b> ${g.why || ""}</p>
        ${g.near ? `<p class="meta"><b>Nearest existing practice:</b> ${g.near}</p>` : ""}
        ${g.method ? `<p><span class="meta">Sketch proposed by this site:</span> <span class="sketch-name">${g.method}</span></p><ol>${g.sketch.map((s) => `<li>${s}</li>`).join("")}</ol>` : ""}
      </section>`; }).join("");
  }

  function viewsPage() {
    const host = document.getElementById("list");
    const q = document.getElementById("q");
    function render() {
      const term = q.value.trim().toLowerCase();
      const match = (v) => H.keepV(v) && (!term || H.strip([v.name, v.who, v.summary, v.when].join(" ")).toLowerCase().includes(term));
      const groups = H.domains.map((d) => ({ id: d.id, name: d.name, gloss: d.gloss, color: H.domainColor[d.id],
        items: H.views.filter((v) => v.domain === d.id && match(v)).sort((a, b) => a.date - b.date) })).filter((g) => g.items.length);
      host.innerHTML = groups.map((g) => groupHtml(g, g.items)).join("") || none;
      document.getElementById("jump").innerHTML = groups.length ? jump(groups) : "";
    }
    H.filterBar(document.getElementById("fbar"), render);
    q.oninput = render; render();
    document.getElementById("gaps").innerHTML = gapsHtml();
    // Two tabs: every view, and the views that no method is built on. The old gap-gallery address lands on the second.
    const tabs = document.querySelectorAll("[role=tab]");
    const show = (id, quiet) => {
      tabs.forEach((t) => t.setAttribute("aria-selected", t.dataset.tab === id));
      document.querySelectorAll(".tabpanel").forEach((p) => (p.hidden = p.id !== "t-" + id));
      if (quiet) return;
      const p = new URLSearchParams(location.search); if (id === "gaps") p.set("tab", "gaps"); else p.delete("tab");
      const s = p.toString(); try { history.replaceState(null, "", location.pathname + (s ? "?" + s : "")); } catch (e) {}
    };
    tabs.forEach((t) => (t.onclick = () => show(t.dataset.tab)));
    if (new URLSearchParams(location.search).get("tab") === "gaps") {
      show("gaps", true);
      const el = location.hash && !location.hash.includes("=") && document.getElementById(location.hash.slice(1));
      if (el) setTimeout(() => el.scrollIntoView(), 30);
    }
  }

  // Chronological list of methods and views together. It sits in the "Over time" tab of the Taxonomy page.
  H.timelineInit = function (host, buttons) {
    const eras = [
      [-10000, "Axial antiquity"], [300, "Late antiquity & the scriptural commentaries"], [1000, "Medieval disputation"],
      [1500, "Early modernity"], [1800, "The long nineteenth century"], [1914, "The twentieth century"], [1990, "The present"]
    ];
    const show = { method: true, view: true };
    function render() {
      const items = [
        ...(show.method ? H.methods.map((m) => ({ k: "method", x: m })) : []),
        ...(show.view ? H.views.map((v) => ({ k: "view", x: v })) : [])
      ].sort((a, b) => a.x.date - b.x.date || (a.k > b.k ? 1 : -1));
      let ei = -1, out = "";
      items.forEach(({ k, x }) => {
        while (ei + 1 < eras.length && x.date >= eras[ei + 1][0]) { ei++; out += `<li class="era">${eras[ei][1]}</li>`; }
        const sub = k === "method" ? `${H.T[x.telos].name} · ${H.F[x.family].name}` : H.D[x.domain].name;
        out += `<li><span class="yr">${H.year(x.date)}</span><span class="what"><span class="kind" style="color:${H.colorOf(x.id)}">${k}</span><a class="xref" href="${H.href(x.id)}" data-id="${x.id}">${H.mark(x.id)}${x.name}</a> <span class="meta">— ${H.strip(x.when)} · ${sub}</span></span></li>`;
      });
      host.innerHTML = out;
    }
    buttons.forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.show; show[k] = !show[k]; b.setAttribute("aria-pressed", show[k]); render();
    }));
    render();
  };

  function sourcesPage() {
    const host = document.getElementById("biblio");
    const usedBy = {};
    [...H.methods, ...H.views].forEach((x) => x.cite.forEach(([k]) => (usedBy[k] = usedBy[k] || []).push(x.id)));
    const keys = Object.keys(H.sources).sort((a, b) => H.strip(H.sources[a]).localeCompare(H.strip(H.sources[b])));
    host.innerHTML = keys.map((k) => `<li id="${k}">${H.sources[k].replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1">$1</a>')}
      ${usedBy[k] ? `<span class="used">Cited in: ${[...new Set(usedBy[k])].map((id) => H.link(id)).join(" · ")}</span>` : `<span class="used">Background reading (see About).</span>`}</li>`).join("");
  }

  document.addEventListener("DOMContentLoaded", () => {
    const p = document.body.dataset.page;
    if (p === "methods") methodsPage();
    if (p === "views") viewsPage();
    if (p === "sources") sourcesPage();
  });
})();
