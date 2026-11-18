/* Influence graph: one lane per region, a life bar per person on a compressed time axis,
   and an edge from each person to those who read, studied with or wrote against them.
   All labels are horizontal. */
(function () {
  const H = window.HOD;
  H.drawPeople = function (host) {
    const W = 1500, left = 165, right = 30, top = 34, CH = 6.4, NOW = 2026;
    const x = d3.scaleLinear()
      .domain([-560, 0, 1000, 1500, 1800, 1900, 1950, 2030])
      .range([0, .14, .27, .38, .52, .64, .78, 1].map((t) => left + t * (W - left - right)));
    const lanes = []; let y = top;
    H.regions.forEach((r) => {
      const ps = H.people.filter((p) => p.region === r.id).sort((a, b) => a.born - b.born);
      if (!ps.length) return;
      const rows = [];
      ps.forEach((p) => {
        const x0 = x(p.born) - 2, x1 = Math.max(x(p.died || NOW), x(p.born) + 8 + p.name.length * CH) + 10;
        let k = rows.findIndex((end) => end < x0);
        if (k === -1) { k = rows.length; rows.push(0); }
        rows[k] = x1; p._row = k;
      });
      const h = Math.max(rows.length * 24 + 14, 50);
      lanes.push({ r, y, h });
      ps.forEach((p) => { p._x0 = x(p.born); p._x1 = x(p.died || NOW); p._y = y + 20 + p._row * 24; });
      y += h;
    });
    const Ht = y + 26;
    host.innerHTML = "";
    const svg = d3.select(host).append("svg").attr("class", "people").attr("viewBox", [0, 0, W, Ht]).attr("width", W).attr("height", Ht)
      .attr("role", "img").attr("aria-label", "Influence graph of thinkers on disagreement, by region and lifetime").style("display", "block");
    svg.append("rect").attr("width", W).attr("height", Ht).attr("fill", "transparent").on("click", () => focus(null, true));
    svg.append("g").selectAll("rect").data(lanes).join("rect").attr("class", "lane-bg")
      .attr("x", 0).attr("y", (l) => l.y).attr("width", W).attr("height", (l) => l.h - 2).attr("opacity", (l, i) => (i % 2 ? 0.035 : 0.012));
    svg.append("g").selectAll("text").data(lanes).join("text").attr("class", "lane-label")
      .attr("x", 8).attr("y", (l) => l.y + 18).text((l) => l.r.name.toUpperCase());
    const ticks = [-500, -250, 0, 500, 1000, 1250, 1500, 1650, 1800, 1850, 1900, 1950, 2000];
    const ax = svg.append("g").attr("class", "axis");
    ticks.forEach((t) => {
      ax.append("line").attr("x1", x(t)).attr("x2", x(t)).attr("y1", top - 4).attr("y2", Ht - 20).attr("stroke-dasharray", "2,4");
      ax.append("text").attr("x", x(t)).attr("y", top - 10).attr("text-anchor", "middle").text(H.year(t));
    });

    const edges = [];
    H.people.forEach((p) => p.infl.forEach((s) => { if (H.P[s]) edges.push({ s: H.P[s], t: p }); }));
    const ex = (e) => Math.min(e.s._x1, Math.max(e.s._x0, e.t._x0));
    const edge = svg.append("g").selectAll("path").data(edges).join("path").attr("class", "edge")
      .attr("d", (e) => { const x1 = ex(e), y1 = e.s._y, x2 = e.t._x0, y2 = e.t._y, mx = (x1 + x2) / 2; return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`; });

    const node = svg.append("g").selectAll("g").data(H.people).join("g").attr("class", "pnode").style("cursor", "pointer");
    node.append("rect").attr("class", "life").attr("x", (p) => p._x0).attr("y", (p) => p._y - 3).attr("height", 6).attr("rx", 3)
      .attr("width", (p) => Math.max(4, p._x1 - p._x0)).attr("fill", (p) => {
        const m = p.methods[0] && H.M[p.methods[0]]; const v = p.views[0] && H.V[p.views[0]];
        return m ? H.teloColor[m.telos] : v ? H.domainColor[v.domain] : "var(--ink-3)";
      }).attr("opacity", (p) => (p.approx ? 0.55 : 0.9));
    node.append("text").attr("x", (p) => p._x0).attr("y", (p) => p._y - 7).text((p) => p.name)
      .style("paint-order", "stroke").style("stroke", "var(--paper)").style("stroke-width", "3px");

    let pinned = null;
    function focus(id, clear) {
      if (clear) pinned = null;
      if (!id) { svg.classed("focus", false); edge.classed("on", false); node.classed("on", false); return; }
      const on = new Set([id]);
      edges.forEach((e) => { if (e.s.id === id || e.t.id === id) { on.add(e.s.id); on.add(e.t.id); } });
      svg.classed("focus", true);
      edge.classed("on", (e) => e.s.id === id || e.t.id === id);
      node.classed("on", (p) => on.has(p.id));
      edge.filter(".on").raise();
    }
    const tipFor = (p) => `<b>${p.name}</b><br>${H.year(p.born)}–${p.died ? H.year(p.died) : "present"}${p.approx ? " (approx.)" : ""}<br><span style="opacity:.75">${p.infl.length} source${p.infl.length === 1 ? "" : "s"} · ${H.people.filter((q) => q.infl.includes(p.id)).length} heir(s)</span>`;
    node.on("mouseenter", (ev, p) => { if (!pinned) focus(p.id); H.tip(tipFor(p), ev); })
      .on("mousemove", (ev, p) => H.tip(tipFor(p), ev))
      .on("mouseleave", () => { focus(pinned); H.tip(null); })
      .on("click", (ev, p) => { ev.stopPropagation(); H.tip(null); pinned = p.id; focus(p.id); H.openPerson(p.id); });
    return { pin: (id) => { pinned = id; focus(id); const p = H.P[id]; if (p && host.parentElement) host.scrollLeft = Math.max(0, p._x0 - 200); }, clear: () => focus(null, true) };
  };
})();
