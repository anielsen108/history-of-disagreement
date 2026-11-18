/* Matrix: every method (row) against the nine domains (columns); each cell names the views
   the method presupposes in that domain (★ = primary). Plain HTML table, all text upright. */
(function () {
  const H = window.HOD;

  H.drawMatrix = function (host, sortKey = "telos") {
    const famIdx = Object.fromEntries(H.families.map((f, i) => [f.id, i]));
    const telIdx = Object.fromEntries(H.teloi.map((f, i) => [f.id, i]));
    const rows = H.methods.slice().sort({
      date: (a, b) => a.date - b.date,
      family: (a, b) => famIdx[a.family] - famIdx[b.family] || a.date - b.date,
      telos: (a, b) => telIdx[a.telos] - telIdx[b.telos] || a.date - b.date
    }[sortKey]);
    const grpName = (m) => (sortKey === "telos" ? H.T[m.telos].name : sortKey === "family" ? H.F[m.family].name : null);
    const grpCol = (m) => (sortKey === "telos" ? H.teloColor[m.telos] : "var(--ink-3)");
    let prev = null, body = "";
    rows.forEach((m) => {
      const g = grpName(m);
      if (g && g !== prev) body += `<tr class="grp"><th colspan="${H.domains.length + 1}" style="color:${grpCol(m)}">${g}</th></tr>`;
      prev = g;
      body += `<tr><th data-id="${m.id}"><span class="dot" style="display:inline-block;width:.6em;height:.6em;border-radius:50%;margin-right:.35em;background:${H.teloColor[m.telos]}"></span>${m.name}</th>` +
        H.domains.map((d) => {
          const vs = m.views.map((v, i) => ({ v: H.V[v], prim: i === 0 })).filter((x) => x.v.domain === d.id);
          return `<td style="${vs.length ? `background:color-mix(in srgb, ${H.domainColor[d.id]} ${vs.some((x) => x.prim) ? 16 : 8}%, transparent)` : ""}">${vs.map((x) =>
            `<a class="xref${x.prim ? " prim" : ""}" data-id="${x.v.id}" href="${H.href(x.v.id)}">${x.v.name}${x.prim ? " ★" : ""}</a>`).join("")}</td>`;
        }).join("") + "</tr>";
    });
    host.innerHTML = `<div class="mtable-wrap"><table class="mtable"><thead><tr><th>Method</th>${H.domains.map((d) =>
      `<th style="color:${H.domainColor[d.id]}" title="${H.esc(d.gloss)}">${d.name}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table></div>`;
    host.querySelectorAll("tbody th[data-id]").forEach((th) => th.addEventListener("click", () => H.open(th.dataset.id)));
    host.querySelectorAll("a.xref").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); H.open(a.dataset.id); }));
  };

  /* Telos × domain summary table: where does each kind of method locate disagreement? */
  H.telosDomainTable = function (host) {
    const count = {};
    H.methods.forEach((m) => m.views.forEach((v, i) => {
      const k = m.telos + "|" + H.V[v].domain;
      count[k] = (count[k] || 0) + (i === 0 ? 2 : 1);
    }));
    const max = Math.max(...Object.values(count));
    host.innerHTML = `<div class="viz-scroll"><table class="simple"><thead><tr><th>Telos ↓ / Domain →</th>${H.domains.map((d) =>
      `<th style="color:${H.domainColor[d.id]}">${d.name}</th>`).join("")}</tr></thead><tbody>${H.teloi.map((t) =>
      `<tr><th style="color:${H.teloColor[t.id]}">${t.name}</th>${H.domains.map((d) => {
        const c = count[t.id + "|" + d.id] || 0;
        return `<td style="text-align:center;background:color-mix(in srgb, ${H.teloColor[t.id]} ${Math.round((c / max) * 70)}%, transparent)">${c || ""}</td>`;
      }).join("")}</tr>`).join("")}</tbody></table></div>
      <p class="viz-caption">Weighted count (primary presupposition = 2, secondary = 1). Read across a row to see where methods with one telos locate the trouble. Truth-seeking methods put 42 of their 57 weighted links (74%) in the epistemic column. Methods aimed at understanding put 24 of 36 (67%) in the psyche and relational columns. Release methods put 8 of 12 (67%) in the contemplative column; plurality methods come next, with 4 of 11.</p>`;
  };
})();
