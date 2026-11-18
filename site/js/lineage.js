/* Lineage: methods on a (piecewise-compressed) time axis, one lane per family,
   with descent edges. Colour = telos. */
(function () {
  const H = window.HOD;

  H.drawLineage = function (host) {
    // Drawn at the width of the page, so the whole span from 500 BCE to now is visible without sideways scrolling
    // on a desktop. `right` leaves room for the labels of the newest methods. CH ≈ px per character at 10.5px.
    host.innerHTML = "";
    const avail = (host.closest("main") || document.body).clientWidth - 58;
    const W = Math.max(1040, Math.min(1500, avail)), left = 150, right = 200, top = 34, CH = 6.1;
    // Piecewise time scale. Half the methods date from after 1900, so that span gets half the width.
    const x = d3.scaleLinear()
      .domain([-520, 0, 1000, 1500, 1800, 1900, 1950, 1980, 2030])
      .range([0, .09, .17, .25, .37, .47, .58, .78, 1].map((t) => left + t * (W - left - right)));

    // pack nodes into sub-rows within each lane so labels do not collide
    const lanes = [];
    let y = top;
    H.families.forEach((f) => {
      const ms = H.methods.filter((m) => m.family === f.id).sort((a, b) => a.date - b.date);
      const rows = [];
      ms.forEach((m) => {
        const x0 = x(m.date) - 4, x1 = x(m.date) + 10 + m.name.length * CH;
        let r = rows.findIndex((end) => end < x0);
        if (r === -1) { r = rows.length; rows.push(0); }
        rows[r] = x1; m._row = r;
      });
      const h = Math.max(Math.max(1, rows.length) * 20 + 14, 48);
      lanes.push({ f, y, h });
      ms.forEach((m) => { m._x = x(m.date); m._y = y + 17 + m._row * 20; });
      y += h;
    });
    const Ht = y + 26;

    const svg = d3.select(host).append("svg")
      .attr("viewBox", [0, 0, W, Ht]).attr("class", "lineage")
      .attr("width", W).attr("height", Ht).style("max-width", "none").style("display", "block");
    host.dataset.w = avail;

    // lanes
    const lane = svg.append("g").selectAll("g").data(lanes).join("g");
    lane.append("rect").attr("class", "lane-bg").attr("x", 0).attr("width", W).attr("y", (d) => d.y).attr("height", (d) => d.h - 3)
      .attr("opacity", (d, i) => (i % 2 ? 0.0 : 0.03));
    lane.append("text").attr("class", "lane-label").attr("x", 8).attr("y", (d) => d.y + 17).text((d) => d.f.name)
      .call((t) => t.each(function () { wrap(d3.select(this), left - 16); }));

    // grid & axis
    const ticks = [-500, 0, 500, 1000, 1500, 1650, 1800, 1900, 1950, 1965, 1980, 2000, 2020];
    const grid = svg.append("g").attr("class", "grid");
    grid.selectAll("line").data(ticks).join("line").attr("x1", x).attr("x2", x).attr("y1", top - 4).attr("y2", Ht - 22).attr("stroke-dasharray", "2,4");
    const ax = svg.append("g").attr("class", "axis");
    [top - 12, Ht - 8].forEach((yy) => ax.append("g").selectAll("text").data(ticks).join("text")
      .attr("x", x).attr("y", yy).attr("text-anchor", "middle").text((t) => (t < 0 ? `${-t} BCE` : t === 0 ? "1 CE" : t)));
    svg.append("text").attr("x", W - 8).attr("y", Ht - 8 - 14).attr("text-anchor", "end")
      .style("font-size", "10px").style("fill", "var(--ink-3)").text("time axis compressed before 1800 and stretched after 1900");

    // links
    const links = [];
    H.methods.forEach((m) => m.parents.forEach((p) => links.push({ s: H.M[p], t: m })));
    const link = svg.append("g").selectAll("path").data(links).join("path").attr("class", "link")
      .attr("d", ({ s, t }) => {
        const mx = (s._x + t._x) / 2;
        return `M${s._x},${s._y} C${mx},${s._y} ${mx},${t._y} ${t._x},${t._y}`;
      }).style("--c", ({ t }) => H.teloColor[t.telos]);

    // nodes
    const node = svg.append("g").selectAll("g").data(H.methods).join("g").attr("class", "node")
      .attr("transform", (m) => `translate(${m._x},${m._y})`);
    node.append("rect").attr("x", -4.5).attr("y", -4.5).attr("width", 9).attr("height", 9).attr("rx", 1.5).attr("fill", (m) => H.teloColor[m.telos]);
    node.append("text").attr("x", 8).attr("dy", "0.33em").text((m) => m.name);

    // lineage closure for highlight
    function closure(id) {
      const s = new Set([id]);
      const up = (k) => H.M[k].parents.forEach((p) => { if (!s.has(p)) { s.add(p); up(p); } });
      const down = (k) => H.M[k].children.forEach((c) => { if (!s.has(c)) { s.add(c); down(c); } });
      up(id); down(id); return s;
    }
    let pinned = null;
    function focus(id) {
      if (!id) { svg.classed("focus", false); node.classed("on", false); link.classed("on", false); return; }
      const s = closure(id);
      svg.classed("focus", true);
      node.classed("on", (m) => s.has(m.id));
      link.classed("on", (l) => s.has(l.s.id) && s.has(l.t.id));
      link.filter(".on").raise();
    }
    node.on("mouseenter", (ev, m) => { if (!pinned) focus(m.id); H.tip(H.tipFor(m.id) + `<br><i>${m.parents.length} ancestors · ${m.children.length} descendants</i>`, ev); })
      .on("mousemove", (ev, m) => H.tip(H.tipFor(m.id), ev))
      .on("mouseleave", () => { if (!pinned) focus(null); H.tip(null); })
      .on("click", (ev, m) => { pinned = m.id; focus(m.id); H.tip(null); H.open(m.id); });

    const prevClose = H.onClose; H.onClose = () => { pinned = null; focus(null); if (prevClose) prevClose(); };
    const prevOpen = H.onOpen; H.onOpen = (id) => { if (H.M[id]) { pinned = id; focus(id); } if (prevOpen) prevOpen(id); };

    return {
      // keep(m) says whether a method passes the shared filters; the rest are dimmed.
      filter(keep) { node.classed("dim", (m) => !keep(m)); link.classed("dim", (l) => !keep(l.t) || !keep(l.s)); }
    };

    function wrap(text, width) {
      const words = text.text().split(/\s+/); text.text(null);
      let line = [], tspan = text.append("tspan").attr("x", 8).attr("dy", 0), n = 0;
      words.forEach((w) => {
        line.push(w); tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width && line.length > 1) {
          line.pop(); tspan.text(line.join(" ")); line = [w];
          tspan = text.append("tspan").attr("x", 8).attr("dy", "1.15em").text(w); n++;
        }
      });
    }
  };
})();
