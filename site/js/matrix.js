/* Table: every view (row) against the eight teloi (columns); each cell names the methods
   that presuppose the view and pursue that telos (★ = the view is the method's primary one).
   Views run down the side and methods across, as in the two-column diagram. Plain HTML, all text upright. */
(function () {
  const H = window.HOD;

  H.drawMatrix = function (host, sortKey = "domain") {
    const domIdx = Object.fromEntries(H.domains.map((d, i) => [d.id, i]));
    const rows = H.views.slice().sort({
      date: (a, b) => a.date - b.date,
      count: (a, b) => b.methods.length - a.methods.length || a.date - b.date,
      domain: (a, b) => domIdx[a.domain] - domIdx[b.domain] || b.methods.length - a.methods.length || a.date - b.date
    }[sortKey]);
    let prev = null, body = "";
    rows.forEach((v) => {
      const g = sortKey === "domain" ? H.D[v.domain].name : null;
      if (g && g !== prev) body += `<tr class="grp"><th colspan="${H.teloi.length + 1}" style="color:${H.domainColor[v.domain]}">${g}</th></tr>`;
      prev = g;
      body += `<tr><th data-id="${v.id}"><span class="dot" style="display:inline-block;width:.6em;height:.6em;border-radius:50%;margin-right:.35em;background:${H.domainColor[v.domain]}"></span>${v.name}${v.methods.length ? "" : ' <span class="meta">(no method)</span>'}</th>` +
        H.teloi.map((t) => {
          const ms = v.methods.map((x) => ({ m: H.M[x.id], prim: x.primary })).filter((x) => x.m.telos === t.id).sort((a, b) => b.prim - a.prim || a.m.date - b.m.date);
          return `<td style="${ms.length ? `background:color-mix(in srgb, ${H.teloColor[t.id]} ${ms.some((x) => x.prim) ? 16 : 8}%, transparent)` : ""}">${ms.map((x) =>
            `<a class="xref${x.prim ? " prim" : ""}" data-id="${x.m.id}" href="${H.href(x.m.id)}">${x.m.name}${x.prim ? " ★" : ""}</a>`).join("")}</td>`;
        }).join("") + "</tr>";
    });
    host.innerHTML = `<div class="mtable-wrap"><table class="mtable"><thead><tr><th>View</th>${H.teloi.map((t) =>
      `<th style="color:${H.teloColor[t.id]}" title="${H.esc(t.gloss)}">${t.name}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table></div>`;
    host.querySelectorAll("tbody th[data-id]").forEach((th) => th.addEventListener("click", () => H.open(th.dataset.id)));
    host.querySelectorAll("a.xref").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); H.open(a.dataset.id); }));
  };

  /* Domain × telos summary: for each place a view locates disagreement, what the methods built on it are for. */
  H.telosDomainTable = function (host) {
    const count = {}, rowSum = {}, colSum = {};
    H.methods.forEach((m) => m.views.forEach((v, i) => {
      const d = H.V[v].domain, w = i === 0 ? 2 : 1, k = d + "|" + m.telos;
      count[k] = (count[k] || 0) + w; rowSum[d] = (rowSum[d] || 0) + w; colSum[m.telos] = (colSum[m.telos] || 0) + w;
    }));
    const max = Math.max(...Object.values(count));
    const c = (d, t) => count[d + "|" + t] || 0;
    const share = (n, of) => `${n} of ${of} (${Math.round(100 * n / of)}%)`;
    host.innerHTML = `<div class="viz-scroll"><table class="simple"><thead><tr><th>Domain ↓ / Telos →</th>${H.teloi.map((t) =>
      `<th style="color:${H.teloColor[t.id]}">${t.name}</th>`).join("")}</tr></thead><tbody>${H.domains.map((d) =>
      `<tr><th style="color:${H.domainColor[d.id]}">${d.name}</th>${H.teloi.map((t) => {
        const n = c(d.id, t.id);
        return `<td style="text-align:center;background:color-mix(in srgb, ${H.domainColor[d.id]} ${Math.round((n / max) * 70)}%, transparent)">${n || ""}</td>`;
      }).join("")}</tr>`).join("")}</tbody></table></div>
      <p class="viz-caption">Weighted count (a method’s primary view = 2, each further view = 1). Read down a column to see where methods with one telos locate the trouble. Truth-seeking methods put ${share(c("epistemic", "truth"), colSum.truth)} of their weighted links in the epistemic row. Methods aimed at understanding put ${share(c("psyche", "understanding") + c("relational", "understanding"), colSum.understanding)} in the psyche and relational rows. Release methods put ${share(c("contemplative", "release"), colSum.release)} in the contemplative row. Read across a row for the converse: ${share(c("interest", "settlement") + c("interest", "decision"), rowSum.interest)} of the weight on interest views comes from methods of settlement and decision.</p>`;
  };
})();
