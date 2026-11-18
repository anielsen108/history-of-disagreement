/* Two-column taxonomy: views (left, grouped by domain) ↔ methods (right, grouped by telos).
   Reading direction: a diagnosis on the left, the methods built on it on the right.
   Every label is horizontal. A thread means "this method presupposes this view".
   Heavy thread = the method's primary presupposition; dashed = a primary pairing scholars contest.
   Rows inside each group are ordered by the average height of their partners (a few barycentre
   sweeps), which removes most avoidable crossings; ties fall back to date.
   Click a name to focus it (all other threads fade); "Read entry" opens the full entry.
   opts.filter = { telos:Set, domain:Set, culture:Set, from:Number, to:Number } (all optional). */
(function () {
  const H = window.HOD;
  let primaryOnly = false;
  // Which column the views take. Set HOD.viewsLeft in data/taxonomy.js; "Swap sides" in the diagram flips it for the session.
  let viewsLeft = H.viewsLeft !== false;

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
    const toggle = () => `<button type="button" class="swap" data-a="swap" title="Put ${VL0 ? "methods" : "views"} on the left">⇄ Swap sides</button><label class="primtoggle"><input type="checkbox" ${primaryOnly ? "checked" : ""}> Primary threads only</label>`;
    const VL0 = viewsLeft;
    const wireToggle = () => { const sw = bar.querySelector("[data-a=swap]"); if (sw) sw.onclick = () => { viewsLeft = !viewsLeft; H.drawBipartite(host, Object.assign({}, opts, { pin: pinned })); };
      const c = bar.querySelector(".primtoggle input"); if (c) c.onchange = () => { primaryOnly = c.checked; svg.classed("prim", primaryOnly); }; };
    const idle = () => {
      const hidden = views.length < H.views.length || methods.length < H.methods.length;
      bar.innerHTML = `<span class="hint">${hidden ? "The filters are hiding some entries. " : ""}Click any name to focus it.</span>${toggle()}`;
      wireToggle();
    };
    if (!methods.length && !views.length) { bar.innerHTML = ""; scroller.innerHTML = "<p class='meta' style='padding:1rem'>Nothing matches these filters.</p>"; return {}; }

    const W = 1120, labelW = 250, dotL = labelW + 8, dotR = W - labelW - 8;
    const rowH = 18, headH = 30, top = 44;

    const links = [];
    methods.forEach((m) => m.views.forEach((v, i) => { if (vSet.has(v)) links.push({ m: m.id, v, primary: i === 0, contested: i === 0 && m.conf.pair === "contested" }); }));

    // Column layout. `order` maps group id -> ordered item ids; rows are spread to a common height.
    const VL = viewsLeft;
    const groupsV = H.domains.filter((d) => views.some((v) => v.domain === d.id));
    const groupsM = H.teloi.filter((t) => methods.some((m) => m.telos === t.id));
    const Ht = top + 16 + Math.max(groupsV.length * headH + views.length * rowH, groupsM.length * headH + methods.length * rowH);
    const place = (groups, order, n) => {
      const step = n ? (Ht - 16 - top - groups.length * headH) / n : rowH;
      const rows = []; let y = top;
      groups.forEach((g) => { rows.push({ head: true, id: g.id, y }); y += headH; order[g.id].forEach((id) => { rows.push({ id, y: y + step / 2 }); y += step; }); });
      return rows;
    };
    const pos = (rows) => Object.fromEntries(rows.filter((r) => !r.head).map((r) => [r.id, r.y]));
    const byDate = (a, b) => H.get(a).date - H.get(b).date;
    const ordV = Object.fromEntries(groupsV.map((d) => [d.id, views.filter((v) => v.domain === d.id).map((v) => v.id).sort(byDate)]));
    const ordM = Object.fromEntries(groupsM.map((t) => [t.id, methods.filter((m) => m.telos === t.id).map((m) => m.id).sort(byDate)]));
    let rowsV = place(groupsV, ordV, views.length), rowsM = place(groupsM, ordM, methods.length);
    let posV = pos(rowsV), posM = pos(rowsM);
    const bary = (ord, mine, theirs, other) => {
      for (const g in ord) {
        const k = {};
        ord[g].forEach((id) => {
          let s = 0, w = 0;
          links.forEach((l) => { if (l[mine] === id) { const q = l.primary ? 2 : 1; s += q * other[l[theirs]]; w += q; } });
          k[id] = w ? s / w : Infinity; // unlinked rows (views with no method) sink to the foot of their group
        });
        ord[g].sort((a, b) => (k[a] === k[b] ? byDate(a, b) : k[a] - k[b]));
      }
    };
    for (let i = 0; i < 4; i++) {
      bary(ordV, "v", "m", posM); rowsV = place(groupsV, ordV, views.length); posV = pos(rowsV);
      bary(ordM, "m", "v", posV); rowsM = place(groupsM, ordM, methods.length); posM = pos(rowsM);
    }
    const left = VL ? rowsV : rowsM, right = VL ? rowsM : rowsV;
    const sideV = VL ? "L" : "R"; // the side that holds views

    const svg = d3.select(scroller).append("svg").attr("class", "bip" + (primaryOnly ? " prim" : ""))
      .attr("viewBox", [0, 0, W, Ht]).attr("width", W).attr("height", Ht)
      .attr("role", "img").attr("aria-label", VL ? "Views of what disagreement is about (left, by domain) linked to the methods that presuppose them (right, by telos)" : "Methods of disagreement (left, by telos) linked to the views they presuppose (right, by domain)")
      .style("display", "block").style("max-width", "100%").style("height", "auto").style("margin", "0 auto");
    svg.append("rect").attr("width", W).attr("height", Ht).attr("fill", "transparent").on("click", () => unpin());
    idle();

    svg.append("text").attr("class", "coltitle").attr("x", labelW).attr("y", 18).attr("text-anchor", "end").text(VL ? "VIEWS, by domain" : "METHODS, by telos");
    svg.append("text").attr("class", "coltitle").attr("x", W - labelW).attr("y", 18).text(VL ? "METHODS, by telos" : "VIEWS, by domain");
    svg.append("text").attr("class", "colsub").attr("x", W / 2).attr("y", 18).attr("text-anchor", "middle").text("heavy = primary · dashed = contested pairing");

    const path = (l) => {
      const y1 = VL ? posV[l.v] : posM[l.m], y2 = VL ? posM[l.m] : posV[l.v], mx = (dotL + dotR) / 2;
      return `M${dotL},${y1} C${mx},${y1} ${mx},${y2} ${dotR},${y2}`;
    };
    const link = svg.append("g").selectAll("path").data(links).join("path").attr("class", (l) => "link" + (l.primary ? "" : " sec"))
      .attr("d", path).attr("stroke", (l) => H.domainColor[H.V[l.v].domain]).attr("stroke-width", (l) => (l.primary ? 2.2 : 1))
      .attr("stroke-dasharray", (l) => (l.contested ? "6,4" : null));

    const head = (rows, side) => svg.append("g").selectAll("g").data(rows.filter((r) => r.head)).join("g").attr("class", "ghead")
      .each(function (r) {
        const g = d3.select(this);
        const col = side === sideV ? H.domainColor[r.id] : H.teloColor[r.id];
        const name = side === sideV ? H.D[r.id].name : H.T[r.id].name;
        const x0 = side === "L" ? 0 : W - labelW;
        g.append("rect").attr("x", x0).attr("y", r.y + 8).attr("width", labelW).attr("height", 18).attr("rx", 3).attr("fill", col).attr("opacity", 0.14);
        g.append("text").attr("x", side === "L" ? labelW - 6 : x0 + 6).attr("y", r.y + 21)
          .attr("text-anchor", side === "L" ? "end" : "start").style("fill", col).text(name.toUpperCase());
        g.append("title").text(side === sideV ? H.D[r.id].gloss : H.T[r.id].gloss);
      });
    const headL = head(left, "L"), headR = head(right, "R");

    const item = (rows, side) => svg.append("g").selectAll("g").data(rows.filter((r) => !r.head)).join("g")
      .attr("class", (r) => "item" + (side === sideV && !H.V[r.id].methods.length ? " orphan" : ""))
      .each(function (r) {
        const g = d3.select(this), x = side === "L" ? dotL : dotR;
        const col = H.colorOf(r.id), orphan = side === sideV && !H.V[r.id].methods.length;
        g.append("rect").attr("class", "hit").attr("x", side === "L" ? 0 : dotR - 6).attr("y", r.y - 8).attr("width", labelW + 14).attr("height", 16);
        g.append("circle").attr("cx", x).attr("cy", r.y).attr("r", 3.4).attr("fill", orphan ? "none" : col).attr("stroke", col).attr("stroke-width", 1.4);
        g.append("text").attr("x", side === "L" ? labelW : dotR + 8).attr("y", r.y).attr("dy", "0.34em")
          .attr("text-anchor", side === "L" ? "end" : "start").text(orphan ? (side === "L" ? "(no method)  " + H.get(r.id).name : H.get(r.id).name + "  (no method)") : H.get(r.id).name);
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
    function badge(id) {
      svg.selectAll(".openbadge").remove();
      items.classed("pinned", (r) => r.id === id);
      if (!id) return;
      const g = items.filter((r) => r.id === id);
      const bb = g.select("text").node().getBBox(), isL = bb.x < W / 2, bw = 50;
      let bx = isL ? bb.x - bw - 8 : bb.x + bb.width + 8;
      bx = Math.max(1, Math.min(W - bw - 1, bx));
      const b = g.append("g").attr("class", "openbadge");
      b.append("rect").attr("x", bx).attr("y", bb.y + bb.height / 2 - 8).attr("width", bw).attr("height", 16).attr("rx", 8);
      b.append("text").attr("x", bx + bw / 2).attr("y", bb.y + bb.height / 2).attr("dy", "0.34em").attr("text-anchor", "middle").text("open ↗");
      b.append("title").text("Click again to open the entry");
    }
    function pin(id) {
      pinned = id; focus([id]); badge(id);
      const x = H.get(id), kind = H.kind(id);
      bar.innerHTML = `<span class="dot" style="display:inline-block;width:.7em;height:.7em;border-radius:50%;background:${H.colorOf(id)}"></span>
        <b>${x.name}</b><span class="hint">${kind === "method" ? `presupposes the views lit on the ${VL ? "left" : "right"}` : `is assumed by the methods lit on the ${VL ? "right" : "left"}`}</span>
        <button type="button" data-a="open">Read entry</button><button type="button" data-a="clear">Clear focus</button>${toggle()}`;
      bar.querySelector('[data-a=open]').onclick = () => H.open(id);
      bar.querySelector('[data-a=clear]').onclick = unpin;
      wireToggle();
      if (opts.onPin) opts.onPin(id);
    }
    function unpin() { pinned = null; focus(null); badge(null); idle(); if (opts.onPin) opts.onPin(null); }

    items.style("cursor", "pointer")
      .on("mouseenter", (ev, r) => { if (!pinned) focus([r.id]); H.tip(H.tipFor(r.id), ev); })
      .on("mousemove", (ev, r) => H.tip(H.tipFor(r.id), ev))
      .on("mouseleave", () => { if (!pinned) focus(null); else focus([pinned]); H.tip(null); })
      .on("click", (ev, r) => { ev.stopPropagation(); H.tip(null); if (pinned === r.id) H.open(r.id); else pin(r.id); });
    const groupIds = (side, gid) => (side === sideV ? views.filter((v) => v.domain === gid) : methods.filter((m) => m.telos === gid)).map((x) => x.id);
    headL.style("cursor", "pointer").on("mouseenter", (ev, r) => { if (!pinned) focus(groupIds("L", r.id)); }).on("mouseleave", () => { if (!pinned) focus(null); });
    headR.style("cursor", "pointer").on("mouseenter", (ev, r) => { if (!pinned) focus(groupIds("R", r.id)); }).on("mouseleave", () => { if (!pinned) focus(null); });

    if (opts.pin && (posV[opts.pin] || posM[opts.pin])) pin(opts.pin);
    return { pin, unpin };
  };
})();
