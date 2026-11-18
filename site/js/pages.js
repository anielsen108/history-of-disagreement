/* Page renderers for the list pages. Each page has <body data-page="...">. */
(function () {
  const H = window.HOD;

  function methodsPage() {
    const host = document.getElementById("list");
    const sel = document.getElementById("groupby");
    const q = document.getElementById("q");
    function render() {
      const key = sel.value, term = q.value.trim().toLowerCase();
      const match = (m) => !term || H.strip([m.name, m.native, m.who, m.summary, m.when].join(" ")).toLowerCase().includes(term);
      const groups = key === "telos" ? H.teloi.map((t) => ({ id: t.id, name: t.name, gloss: t.gloss, color: H.teloColor[t.id], items: H.methods.filter((m) => m.telos === t.id) }))
        : key === "family" ? H.families.map((f) => ({ id: f.id, name: f.name, color: "var(--ink-3)", items: H.methods.filter((m) => m.family === f.id) }))
        : [{ id: "all", name: "Chronological", items: H.methods.slice() }];
      host.innerHTML = groups.map((g) => {
        const items = g.items.filter(match).sort((a, b) => a.date - b.date);
        if (!items.length) return "";
        return `<div class="group-head" id="g-${g.id}">${g.color ? `<span class="dot" style="background:${g.color}"></span>` : ""}<h2 style="margin:0">${g.name}</h2></div>
          ${g.gloss ? `<p class="group-gloss">${g.gloss}</p>` : ""}
          ${items.map(H.foldEntry).join("")}`;
      }).join("") || "<p>No match.</p>";
      document.getElementById("jump").innerHTML = key === "date" ? "" : `<span class="legend-title">Jump to</span>` + groups.filter((g) => g.items.some(match)).map((g) =>
        `<a class="chip" href="#g-${g.id}">${g.color ? `<span class="dot" style="background:${g.color}"></span>` : ""}${g.name}</a>`).join("");
    }
    sel.onchange = render; q.oninput = render; render();
    H.wireFolds(host);
  }

  function viewsPage() {
    const host = document.getElementById("list");
    const q = document.getElementById("q");
    function render() {
      const term = q.value.trim().toLowerCase();
      const match = (v) => !term || H.strip([v.name, v.who, v.summary, v.when].join(" ")).toLowerCase().includes(term);
      host.innerHTML = H.domains.map((d) => {
        const items = H.views.filter((v) => v.domain === d.id && match(v)).sort((a, b) => a.date - b.date);
        if (!items.length) return "";
        return `<div class="group-head" id="g-${d.id}"><span class="dot" style="background:${H.domainColor[d.id]}"></span><h2 style="margin:0">${d.name}</h2></div>
          <p class="group-gloss">${d.gloss}</p>
          ${items.map(H.foldEntry).join("")}`;
      }).join("") || "<p>No match.</p>";
      document.getElementById("jump").innerHTML = `<span class="legend-title">Jump to</span>` + H.domains.filter((d) => H.views.some((v) => v.domain === d.id && match(v))).map((d) =>
        `<a class="chip" href="#g-${d.id}"><span class="dot" style="background:${H.domainColor[d.id]}"></span>${d.name}</a>`).join("");
    }
    q.oninput = render; render();
    H.wireFolds(host);
  }

  function timelinePage() {
    const host = document.getElementById("tl");
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
        const col = H.colorOf(x.id);
        const sub = k === "method" ? `${H.T[x.telos].name} · ${H.F[x.family].name}` : H.D[x.domain].name;
        out += `<li><span class="yr">${H.year(x.date)}</span><span class="what"><span class="kind" style="color:${col}">${k === "method" ? "method" : "view"}</span><a href="${H.href(x.id)}" data-id="${x.id}">${x.name}</a> <span class="meta">— ${H.strip(x.when)} · ${sub}</span></span></li>`;
      });
      host.innerHTML = out;
      host.querySelectorAll("a[data-id]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); H.open(a.dataset.id); }));
    }
    document.querySelectorAll("[data-show]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.show; show[k] = !show[k]; b.setAttribute("aria-pressed", show[k]); render();
    }));
    render();
  }

  function sourcesPage() {
    const host = document.getElementById("biblio");
    const usedBy = {};
    [...H.methods, ...H.views].forEach((x) => x.cite.forEach(([k]) => (usedBy[k] = usedBy[k] || []).push(x.id)));
    const keys = Object.keys(H.sources).sort((a, b) => H.strip(H.sources[a]).localeCompare(H.strip(H.sources[b])));
    host.innerHTML = keys.map((k) => `<li id="${k}">${H.sources[k].replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1">$1</a>')}
      ${usedBy[k] ? `<span class="used">Cited in: ${[...new Set(usedBy[k])].map((id) => H.link(id)).join(" · ")}</span>` : `<span class="used">Background reading (see About).</span>`}</li>`).join("");
  }

  function wire() {
    // in-page xrefs open the drawer instead of navigating, on pages that have visuals
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a.xref");
      if (!a || !document.body.dataset.drawerLinks || a.closest(".drawer")) return;
      e.preventDefault(); H.goto(a.dataset.id);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const p = document.body.dataset.page;
    wire();
    if (p === "methods") methodsPage();
    if (p === "views") viewsPage();
    if (p === "timeline") timelinePage();
    if (p === "sources") sourcesPage();
  });
})();
