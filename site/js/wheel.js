/* The Wheel: one circle, two taxonomies.
   Left half: methods, grouped by telos. Right half: views, grouped by domain.
   Each bundled edge says "this method presupposes this view of what disagreement is about". */
(function () {
  const H = window.HOD;

  H.drawWheel = function (host, opts = {}) {
    const R = opts.radius || 300;
    const pad = 205;
    const size = 2 * (R + pad);

    // hierarchy: root → {views, methods} → groups → leaves
    const viewGroups = H.domains.map((d) => ({
      name: d.id, kind: "domain",
      children: H.views.filter((v) => v.domain === d.id).sort((a, b) => a.date - b.date)
        .map((v) => ({ name: v.id, kind: "view", data: v }))
    }));
    const methodGroups = H.teloi.map((t) => ({
      name: t.id, kind: "telos",
      children: H.methods.filter((m) => m.telos === t.id).sort((a, b) => b.date - a.date)
        .map((m) => ({ name: m.id, kind: "method", data: m }))
    }));
    const root = d3.hierarchy({ name: "root", children: [
      { name: "views", children: viewGroups },
      { name: "methods", children: methodGroups }
    ] });
    d3.cluster().size([360, R]).separation((a, b) => (a.parent === b.parent ? 1 : 2.2))(root);

    const leafById = new Map(root.leaves().map((l) => [l.data.name, l]));
    const links = [];
    H.methods.forEach((m) => m.views.forEach((v, i) =>
      links.push({ source: leafById.get(m.id), target: leafById.get(v), primary: i === 0, m: m.id, v })));

    const svg = d3.select(host).append("svg")
      .attr("viewBox", [-size / 2, -size / 2, size, size])
      .attr("class", "wheel").attr("role", "img")
      .attr("aria-label", "Radial taxonomy linking methods of disagreement (left) to views of what disagreement is about (right)")
      .style("width", "100%").style("max-width", size + "px").style("height", "auto").style("display", "block").style("margin", "0 auto");

    // group arcs
    const arc = d3.arc().innerRadius(R + 4).outerRadius(R + 10);
    const groups = root.descendants().filter((d) => d.depth === 2);
    const step = 360 / root.leaves().length / 2;
    const g0 = svg.append("g").attr("class", "arcs");
    g0.selectAll("path").data(groups).join("path")
      .attr("d", (g) => {
        const ls = g.leaves();
        return arc({ startAngle: (ls[0].x - step) * Math.PI / 180, endAngle: (ls[ls.length - 1].x + step) * Math.PI / 180 });
      })
      .attr("fill", (g) => (g.data.kind === "telos" ? H.teloColor[g.data.name] : H.domainColor[g.data.name]))
      .append("title").text((g) => (g.data.kind === "telos" ? "Telos: " + H.T[g.data.name].name : "Domain: " + H.D[g.data.name].name));

    // group labels on the inner side of the ring
    g0.selectAll("text").data(groups).join("text")
      .attr("dy", "0.32em")
      .attr("transform", (g) => {
        const ls = g.leaves(); const a = (ls[0].x + ls[ls.length - 1].x) / 2;
        return `rotate(${a - 90}) translate(${R - 12},0)${a >= 180 ? " rotate(180)" : ""}`;
      })
      .attr("text-anchor", (g) => { const ls = g.leaves(); const a = (ls[0].x + ls[ls.length - 1].x) / 2; return a < 180 ? "end" : "start"; })
      .style("font-size", "10px").style("font-weight", 700).style("text-transform", "uppercase").style("letter-spacing", ".08em")
      .style("fill", (g) => (g.data.kind === "telos" ? H.teloColor[g.data.name] : H.domainColor[g.data.name]))
      .text((g) => (g.data.kind === "telos" ? H.T[g.data.name].name : H.D[g.data.name].name));

    // edges
    const line = d3.lineRadial().curve(d3.curveBundle.beta(0.82)).radius((d) => d.y).angle((d) => d.x / 180 * Math.PI);
    const edge = svg.append("g").selectAll("path").data(links).join("path")
      .attr("class", "edge")
      .attr("d", (l) => line(l.source.path(l.target)))
      .attr("stroke", (l) => H.teloColor[H.M[l.m].telos])
      .attr("stroke-width", (l) => (l.primary ? 1.6 : 0.9));

    // leaves
    const leaf = svg.append("g").selectAll("g").data(root.leaves()).join("g")
      .attr("class", (d) => "leaf" + (d.data.kind === "view" && !H.V[d.data.name].methods.length ? " orphan" : ""))
      .attr("transform", (d) => `rotate(${d.x - 90}) translate(${d.y + 14},0)`);
    leaf.append("circle").attr("r", 2.6)
      .attr("fill", (d) => (d.data.kind === "method" ? H.teloColor[d.data.data.telos] : H.domainColor[d.data.data.domain]))
      .attr("cx", -14);
    leaf.append("text")
      .attr("dy", "0.31em")
      .attr("x", (d) => (d.x < 180 ? 2 : -2))
      .attr("text-anchor", (d) => (d.x < 180 ? "start" : "end"))
      .attr("transform", (d) => (d.x >= 180 ? "rotate(180)" : null))
      .text((d) => d.data.data.name);

    // hub
    const c = -size / 2 + 22;
    svg.append("text").attr("class", "hub").attr("x", c).attr("y", c + 6).text("← METHODS");
    svg.append("text").attr("class", "hub").attr("x", c).attr("y", c + 24).style("font-size", "12px").text("grouped by telos");
    svg.append("text").attr("class", "hub").attr("x", -c).attr("y", c + 6).attr("text-anchor", "end").text("VIEWS →");
    svg.append("text").attr("class", "hub").attr("x", -c).attr("y", c + 24).attr("text-anchor", "end").style("font-size", "12px").text("grouped by domain");

    // interaction
    let pinned = null;
    function focus(ids) {
      if (!ids) { svg.classed("focus", false); edge.classed("on", false); leaf.classed("on", false); return; }
      svg.classed("focus", true);
      const on = new Set(ids);
      edge.classed("on", (l) => on.has(l.m) || on.has(l.v));
      const lit = new Set(ids);
      links.forEach((l) => { if (on.has(l.m) || on.has(l.v)) { lit.add(l.m); lit.add(l.v); } });
      leaf.classed("on", (d) => lit.has(d.data.name));
      edge.filter(".on").raise();
    }
    leaf.on("mouseenter", (ev, d) => { if (!pinned) focus([d.data.name]); H.tip(H.tipFor(d.data.name), ev); })
      .on("mousemove", (ev, d) => H.tip(H.tipFor(d.data.name), ev))
      .on("mouseleave", () => { if (!pinned) focus(null); H.tip(null); })
      .on("click", (ev, d) => { pinned = d.data.name; focus([pinned]); H.tip(null); H.open(pinned); });
    arcGroupHover();
    function arcGroupHover() {
      g0.selectAll("path").style("cursor", "pointer")
        .on("mouseenter", (ev, g) => { if (!pinned) focus(g.leaves().map((l) => l.data.name)); })
        .on("mouseleave", () => { if (!pinned) focus(null); });
    }
    const prevClose = H.onClose;
    H.onClose = () => { pinned = null; focus(null); if (prevClose) prevClose(); };
    const prevOpen = H.onOpen;
    H.onOpen = (id) => { if (leafById.has(id)) { pinned = id; focus([id]); } if (prevOpen) prevOpen(id); };

    return { focus };
  };
})();
