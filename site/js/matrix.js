/* Matrix: every method (row) against every view (column).
   Filled cell = the method presupposes the view; solid = primary presupposition. */
(function () {
  const H = window.HOD;

  H.drawMatrix = function (host, sortKey = "telos") {
    host.innerHTML = "";
    const C = 13, left = 230, top = 175;
    const famIdx = Object.fromEntries(H.families.map((f, i) => [f.id, i]));
    const telIdx = Object.fromEntries(H.teloi.map((f, i) => [f.id, i]));
    const rows = H.methods.slice().sort({
      date: (a, b) => a.date - b.date,
      family: (a, b) => famIdx[a.family] - famIdx[b.family] || a.date - b.date,
      telos: (a, b) => telIdx[a.telos] - telIdx[b.telos] || a.date - b.date
    }[sortKey]);
    const cols = [];
    H.domains.forEach((d, di) => H.views.filter((v) => v.domain === d.id).sort((a, b) => a.date - b.date)
      .forEach((v) => cols.push({ v, gap: di })));
    const cx = (i) => left + i * C + cols[i].gap * 6;
    const W = cx(cols.length - 1) + C + 140;
    // row group gaps
    const keyOf = (m) => (sortKey === "family" ? m.family : sortKey === "telos" ? m.telos : null);
    let gy = 0, prev = null;
    rows.forEach((m, i) => { const k = keyOf(m); if (k && prev !== null && k !== prev) gy += 6; prev = k; m._ry = top + i * C + gy; });
    const Ht = rows[rows.length - 1]._ry + C + 30;

    const svg = d3.select(host).append("svg").attr("class", "matrix")
      .attr("viewBox", [0, 0, W, Ht]).attr("width", W).attr("height", Ht).style("display", "block");

    // column background and headers
    const col = svg.append("g").selectAll("g").data(cols).join("g");
    col.append("rect").attr("class", "bgcell").attr("x", (d, i) => cx(i)).attr("y", top).attr("width", C - 1).attr("height", Ht - top - 30)
      .attr("opacity", (d, i) => (i % 2 ? 0.02 : 0.045));
    col.append("text").attr("class", "collab")
      .attr("transform", (d, i) => `translate(${cx(i) + C / 2 + 3},${top - 6}) rotate(-60)`)
      .style("fill", (d) => H.domainColor[d.v.domain])
      .text((d) => d.v.name)
      .on("click", (ev, d) => H.open(d.v.id))
      .on("mouseenter", (ev, d) => { hl(null, d.v.id); H.tip(H.tipFor(d.v.id) + `<br><i>${d.v.methods.length} methods</i>`, ev); })
      .on("mouseleave", () => { hl(); H.tip(null); });
    // domain bands
    H.domains.forEach((d) => {
      const idx = cols.map((c, i) => (c.v.domain === d.id ? i : -1)).filter((i) => i >= 0);
      if (!idx.length) return;
      svg.append("rect").attr("x", cx(idx[0])).attr("y", top - 3).attr("height", 3)
        .attr("width", cx(idx[idx.length - 1]) + C - 1 - cx(idx[0])).attr("fill", H.domainColor[d.id]);
    });

    // rows
    const row = svg.append("g").selectAll("g").data(rows).join("g");
    row.append("text").attr("class", "rowlab").attr("x", left - 8).attr("y", (m) => m._ry + C / 2).attr("dy", "0.33em")
      .attr("text-anchor", "end").style("fill", "var(--ink)")
      .text((m) => m.name)
      .on("click", (ev, m) => H.open(m.id))
      .on("mouseenter", (ev, m) => { hl(m.id); H.tip(H.tipFor(m.id), ev); })
      .on("mouseleave", () => { hl(); H.tip(null); });
    row.append("circle").attr("cx", left - 4).attr("cy", (m) => m._ry + C / 2).attr("r", 2.5).attr("fill", (m) => H.teloColor[m.telos]);

    const hlRow = svg.append("rect").attr("class", "hl").attr("x", 0).attr("width", W).attr("height", C).attr("visibility", "hidden");
    const hlCol = svg.append("rect").attr("class", "hl").attr("y", 0).attr("width", C).attr("height", Ht).attr("visibility", "hidden");
    function hl(mid, vid) {
      if (mid) { const m = H.M[mid]; hlRow.attr("y", m._ry).attr("visibility", "visible"); } else hlRow.attr("visibility", "hidden");
      if (vid) { const i = cols.findIndex((c) => c.v.id === vid); hlCol.attr("x", cx(i)).attr("visibility", "visible"); } else hlCol.attr("visibility", "hidden");
    }

    // cells
    const colIndex = Object.fromEntries(cols.map((c, i) => [c.v.id, i]));
    const cells = [];
    rows.forEach((m) => m.views.forEach((v, k) => cells.push({ m, v: H.V[v], primary: k === 0 })));
    svg.append("g").selectAll("rect").data(cells).join("rect").attr("class", "cell")
      .attr("x", (d) => cx(colIndex[d.v.id])).attr("y", (d) => d.m._ry).attr("width", C - 1).attr("height", C - 1).attr("rx", 2)
      .attr("fill", (d) => H.teloColor[d.m.telos]).attr("fill-opacity", (d) => (d.primary ? 1 : 0.45))
      .style("cursor", "pointer")
      .on("mouseenter", (ev, d) => { hl(d.m.id, d.v.id); H.tip(`<b>${d.m.name}</b> presupposes<br><b>${d.v.name}</b>${d.primary ? " (primary)" : ""}`, ev); })
      .on("mousemove", (ev, d) => H.tip(`<b>${d.m.name}</b> presupposes<br><b>${d.v.name}</b>${d.primary ? " (primary)" : ""}`, ev))
      .on("mouseleave", () => { hl(); H.tip(null); })
      .on("click", (ev, d) => H.open(d.m.id));
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
      <p class="viz-caption">Weighted count (primary presupposition = 2, secondary = 1). Read across a row to see where a kind of practice locates the trouble. Truth-seeking practices sit almost wholly in the epistemic column. Understanding-oriented practices migrate to psyche and relation. Release-oriented practices are the only ones that treat the disagreer’s attachment as the object.</p>`;
  };
})();
