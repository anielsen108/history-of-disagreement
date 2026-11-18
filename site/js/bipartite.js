/* Two-column taxonomy: methods (left, grouped by telos) ↔ views (right, grouped by domain).
   Every label is horizontal. A thread means "this method presupposes this view". */
(function () {
  const H = window.HOD;

  H.drawBipartite = function (host) {
    const W = 1120, labelW = 250, dotL = labelW + 8, dotR = W - labelW - 8;
    const rowH = 18, headH = 30, top = 44;

    // left: methods by telos, by date within group
    const left = [];
    let y = top;
    H.teloi.forEach((t) => {
      const ms = H.methods.filter((m) => m.telos === t.id).sort((a, b) => a.date - b.date);
      if (!ms.length) return;
      left.push({ head: true, id: t.id, y }); y += headH;
      ms.forEach((m) => { left.push({ id: m.id, y: y + rowH / 2 }); y += rowH; });
    });
    const Ht = y + 16;
    const posL = Object.fromEntries(left.filter((r) => !r.head).map((r) => [r.id, r.y]));

    // right: views by domain; within a domain, order by mean height of linked methods (fewer crossings)
    const nV = H.views.length, nD = H.domains.length;
    const rowR = (Ht - 16 - top - nD * headH) / nV;
    const right = [];
    y = top;
    H.domains.forEach((d) => {
      const vs = H.views.filter((v) => v.domain === d.id).map((v) => {
        const ys = v.methods.map((x) => posL[x.id]);
        return { v, k: ys.length ? ys.reduce((a, b) => a + b, 0) / ys.length : 1e9 + v.date };
      }).sort((a, b) => a.k - b.k);
      right.push({ head: true, id: d.id, y }); y += headH;
      vs.forEach(({ v }) => { right.push({ id: v.id, y: y + rowR / 2 }); y += rowR; });
    });
    const posR = Object.fromEntries(right.filter((r) => !r.head).map((r) => [r.id, r.y]));

    const svg = d3.select(host).append("svg").attr("class", "bip")
      .attr("viewBox", [0, 0, W, Ht]).attr("width", W).attr("height", Ht)
      .attr("role", "img").attr("aria-label", "Methods of disagreement (left, by telos) linked to the views of disagreement they presuppose (right, by domain)")
      .style("display", "block").style("max-width", "100%").style("height", "auto").style("margin", "0 auto");

    // column titles
    svg.append("text").attr("class", "coltitle").attr("x", labelW).attr("y", 18).attr("text-anchor", "end").text("METHODS, by telos");
    svg.append("text").attr("class", "coltitle").attr("x", W - labelW).attr("y", 18).text("VIEWS, by domain");
    svg.append("text").attr("class", "colsub").attr("x", W / 2).attr("y", 18).attr("text-anchor", "middle").text("thread = “presupposes”; heavy = primary");

    // links
    const links = [];
    H.methods.forEach((m) => m.views.forEach((v, i) => links.push({ m: m.id, v, primary: i === 0 })));
    const path = (l) => {
      const y1 = posL[l.m], y2 = posR[l.v], mx = (dotL + dotR) / 2;
      return `M${dotL},${y1} C${mx},${y1} ${mx},${y2} ${dotR},${y2}`;
    };
    const link = svg.append("g").selectAll("path").data(links).join("path").attr("class", "link")
      .attr("d", path).attr("stroke", (l) => H.teloColor[H.M[l.m].telos]).attr("stroke-width", (l) => (l.primary ? 2 : 1));

    // group headers
    const head = (rows, side) => svg.append("g").selectAll("g").data(rows.filter((r) => r.head)).join("g").attr("class", "ghead")
      .each(function (r) {
        const g = d3.select(this);
        const col = side === "L" ? H.teloColor[r.id] : H.domainColor[r.id];
        const name = side === "L" ? H.T[r.id].name : H.D[r.id].name;
        const x0 = side === "L" ? 0 : W - labelW;
        g.append("rect").attr("x", x0).attr("y", r.y + 8).attr("width", labelW).attr("height", 18).attr("rx", 3).attr("fill", col).attr("opacity", 0.14);
        g.append("text").attr("x", side === "L" ? labelW - 6 : x0 + 6).attr("y", r.y + 21)
          .attr("text-anchor", side === "L" ? "end" : "start").style("fill", col).text(name.toUpperCase());
        g.append("title").text(side === "L" ? H.T[r.id].gloss : H.D[r.id].gloss);
      });
    const headL = head(left, "L"), headR = head(right, "R");

    // item rows
    const item = (rows, side) => svg.append("g").selectAll("g").data(rows.filter((r) => !r.head)).join("g")
      .attr("class", (r) => "item" + (side === "R" && !H.V[r.id].methods.length ? " orphan" : ""))
      .each(function (r) {
        const g = d3.select(this), x = side === "L" ? dotL : dotR;
        const col = H.colorOf(r.id), orphan = side === "R" && !H.V[r.id].methods.length;
        g.append("rect").attr("class", "hit").attr("x", side === "L" ? 0 : dotR - 6).attr("y", r.y - 8).attr("width", labelW + 14).attr("height", 16);
        g.append("circle").attr("cx", x).attr("cy", r.y).attr("r", 3.4).attr("fill", orphan ? "none" : col).attr("stroke", col).attr("stroke-width", 1.4);
        g.append("text").attr("x", side === "L" ? labelW : dotR + 8).attr("y", r.y).attr("dy", "0.34em")
          .attr("text-anchor", side === "L" ? "end" : "start").text(H.get(r.id).name + (orphan ? "  (no method)" : ""));
      });
    const itemL = item(left, "L"), itemR = item(right, "R");
    const items = svg.selectAll(".item");

    // interaction
    let pinned = null;
    function focus(ids) {
      if (!ids) { svg.classed("focus", false); link.classed("on", false); items.classed("on", false); return; }
      const on = new Set(ids), lit = new Set(ids);
      links.forEach((l) => { if (on.has(l.m) || on.has(l.v)) { lit.add(l.m); lit.add(l.v); } });
      svg.classed("focus", true);
      link.classed("on", (l) => on.has(l.m) || on.has(l.v));
      items.classed("on", (r) => lit.has(r.id));
      link.filter(".on").raise();
    }
    items.style("cursor", "pointer")
      .on("mouseenter", (ev, r) => { if (!pinned) focus([r.id]); H.tip(H.tipFor(r.id), ev); })
      .on("mousemove", (ev, r) => H.tip(H.tipFor(r.id), ev))
      .on("mouseleave", () => { if (!pinned) focus(null); H.tip(null); })
      .on("click", (ev, r) => { pinned = r.id; focus([r.id]); H.tip(null); H.open(r.id); });
    const groupIds = (side, gid) => (side === "L" ? H.methods.filter((m) => m.telos === gid) : H.views.filter((v) => v.domain === gid)).map((x) => x.id);
    headL.style("cursor", "pointer").on("mouseenter", (ev, r) => { if (!pinned) focus(groupIds("L", r.id)); }).on("mouseleave", () => { if (!pinned) focus(null); });
    headR.style("cursor", "pointer").on("mouseenter", (ev, r) => { if (!pinned) focus(groupIds("R", r.id)); }).on("mouseleave", () => { if (!pinned) focus(null); });

    const prevClose = H.onClose; H.onClose = () => { pinned = null; focus(null); if (prevClose) prevClose(); };
    const prevOpen = H.onOpen; H.onOpen = (id) => { if (posL[id] || posR[id]) { pinned = id; focus([id]); } if (prevOpen) prevOpen(id); };
    return { focus };
  };
})();
