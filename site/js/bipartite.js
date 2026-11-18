/* Two-column taxonomy: methods (left, grouped by telos) ↔ views (right, grouped by domain).
   Every label is horizontal. A thread means "this method presupposes this view".
   Solid heavy thread = primary presupposition; dashed = a primary pairing scholars contest.
   Click a name to focus it (all other threads fade); "Read entry" opens the full entry.
   opts.filter = { telos:Set, domain:Set, culture:Set, from:Number, to:Number } (all optional). */
(function () {
  const H = window.HOD;

  H.cultures = [
    { id: "greek", name: "Greek & Roman" }, { id: "indian", name: "Indian & Tibetan" }, { id: "chinese", name: "Chinese" },
    { id: "jewish", name: "Jewish" }, { id: "islamic", name: "Islamic" }, { id: "latin", name: "Latin Christian" },
    { id: "african", name: "African" }, { id: "modern", name: "Modern Western" }
  ];
  H.cultureOf = (m) => m.id === "palaver" ? "african"
    : ({ greek: "greek", indic: "indian", sinitic: "chinese", jewish: "jewish", islamic: "islamic", latin: "latin" })[m.family] || "modern";

  H.drawBipartite = function (host, opts = {}) {
    const f = opts.filter || {};
    const keepM = (m) => (!f.telos || f.telos.has(m.telos)) && (!f.culture || f.culture.has(H.cultureOf(m)))
      && (f.from == null || m.date >= f.from) && (f.to == null || m.date <= f.to);
    const keepV = (v) => (!f.domain || f.domain.has(v.domain)) && (f.to == null || v.date <= f.to);
    const methods = H.methods.filter(keepM), views = H.views.filter(keepV);
    const mSet = new Set(methods.map((m) => m.id)), vSet = new Set(views.map((v) => v.id));

    host.innerHTML = "";
    const bar = document.createElement("div"); bar.className = "focusbar"; host.append(bar);
    const scroller = document.createElement("div"); scroller.className = "bip-scroll"; host.append(scroller);
    const idle = () => { bar.innerHTML = `<span class="hint">Showing ${methods.length} of ${H.methods.length} methods and ${views.length} of ${H.views.length} views. Click any name to focus it.</span>`; };
    idle();
    if (!methods.length && !views.length) { scroller.innerHTML = "<p class='meta' style='padding:1rem'>Nothing matches these filters.</p>"; return {}; }

    const W = 1120, labelW = 250, dotL = labelW + 8, dotR = W - labelW - 8;
    const rowH = 18, headH = 30, top = 44;

    const left = []; let y = top;
    H.teloi.forEach((t) => {
      const ms = methods.filter((m) => m.telos === t.id).sort((a, b) => a.date - b.date);
      if (!ms.length) return;
      left.push({ head: true, id: t.id, y }); y += headH;
      ms.forEach((m) => { left.push({ id: m.id, y: y + rowH / 2 }); y += rowH; });
    });
    const groupsR = H.domains.filter((d) => views.some((v) => v.domain === d.id));
    const minR = top + groupsR.length * headH + views.length * rowH;
    const Ht = Math.max(y, minR) + 16;
    const posL = Object.fromEntries(left.filter((r) => !r.head).map((r) => [r.id, r.y]));

    const rowR = views.length ? (Ht - 16 - top - groupsR.length * headH) / views.length : rowH;
    const right = []; y = top;
    groupsR.forEach((d) => {
      const vs = views.filter((v) => v.domain === d.id).map((v) => {
        const ys = v.methods.filter((x) => mSet.has(x.id)).map((x) => posL[x.id]);
        return { v, k: ys.length ? ys.reduce((a, b) => a + b, 0) / ys.length : 1e9 + v.date };
      }).sort((a, b) => a.k - b.k);
      right.push({ head: true, id: d.id, y }); y += headH;
      vs.forEach(({ v }) => { right.push({ id: v.id, y: y + rowR / 2 }); y += rowR; });
    });
    const posR = Object.fromEntries(right.filter((r) => !r.head).map((r) => [r.id, r.y]));

    const svg = d3.select(scroller).append("svg").attr("class", "bip")
      .attr("viewBox", [0, 0, W, Ht]).attr("width", W).attr("height", Ht)
      .attr("role", "img").attr("aria-label", "Methods of disagreement (left, by telos) linked to the views of disagreement they presuppose (right, by domain)")
      .style("display", "block").style("max-width", "100%").style("height", "auto").style("margin", "0 auto");
    svg.append("rect").attr("width", W).attr("height", Ht).attr("fill", "transparent").on("click", () => unpin());

    svg.append("text").attr("class", "coltitle").attr("x", labelW).attr("y", 18).attr("text-anchor", "end").text("METHODS, by telos");
    svg.append("text").attr("class", "coltitle").attr("x", W - labelW).attr("y", 18).text("VIEWS, by domain");
    svg.append("text").attr("class", "colsub").attr("x", W / 2).attr("y", 18).attr("text-anchor", "middle").text("heavy = primary · dashed = contested pairing");

    const links = [];
    methods.forEach((m) => m.views.forEach((v, i) => { if (vSet.has(v)) links.push({ m: m.id, v, primary: i === 0, contested: i === 0 && m.conf.pair === "contested" }); }));
    const path = (l) => {
      const y1 = posL[l.m], y2 = posR[l.v], mx = (dotL + dotR) / 2;
      return `M${dotL},${y1} C${mx},${y1} ${mx},${y2} ${dotR},${y2}`;
    };
    const link = svg.append("g").selectAll("path").data(links).join("path").attr("class", "link")
      .attr("d", path).attr("stroke", (l) => H.teloColor[H.M[l.m].telos]).attr("stroke-width", (l) => (l.primary ? 2.2 : 1))
      .attr("stroke-dasharray", (l) => (l.contested ? "6,4" : null));

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
    item(left, "L"); item(right, "R");
    const items = svg.selectAll(".item");

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
    function pin(id) {
      pinned = id; focus([id]);
      const x = H.get(id), kind = H.kind(id);
      const n = kind === "method" ? x.views.filter((v) => vSet.has(v)).length : x.methods.filter((m) => mSet.has(m.id)).length;
      bar.innerHTML = `<span class="dot" style="display:inline-block;width:.7em;height:.7em;border-radius:50%;background:${H.colorOf(id)}"></span>
        <b>${x.name}</b><span class="hint">${kind === "method" ? `presupposes ${n} view${n === 1 ? "" : "s"}` : `assumed by ${n} method${n === 1 ? "" : "s"}`}</span>
        <button type="button" data-a="open">Read entry</button><button type="button" data-a="clear">Clear focus</button>`;
      bar.querySelector('[data-a=open]').onclick = () => H.open(id);
      bar.querySelector('[data-a=clear]').onclick = unpin;
      if (opts.onPin) opts.onPin(id);
    }
    function unpin() { pinned = null; focus(null); idle(); if (opts.onPin) opts.onPin(null); }

    items.style("cursor", "pointer")
      .on("mouseenter", (ev, r) => { if (!pinned) focus([r.id]); H.tip(H.tipFor(r.id), ev); })
      .on("mousemove", (ev, r) => H.tip(H.tipFor(r.id), ev))
      .on("mouseleave", () => { if (!pinned) focus(null); else focus([pinned]); H.tip(null); })
      .on("click", (ev, r) => { ev.stopPropagation(); H.tip(null); if (pinned === r.id) H.open(r.id); else pin(r.id); });
    const groupIds = (side, gid) => (side === "L" ? methods.filter((m) => m.telos === gid) : views.filter((v) => v.domain === gid)).map((x) => x.id);
    headL.style("cursor", "pointer").on("mouseenter", (ev, r) => { if (!pinned) focus(groupIds("L", r.id)); }).on("mouseleave", () => { if (!pinned) focus(null); });
    headR.style("cursor", "pointer").on("mouseenter", (ev, r) => { if (!pinned) focus(groupIds("R", r.id)); }).on("mouseleave", () => { if (!pinned) focus(null); });

    if (opts.pin && (posL[opts.pin] || posR[opts.pin])) pin(opts.pin);
    return { pin, unpin };
  };
})();
