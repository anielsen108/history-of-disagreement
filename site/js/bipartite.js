/* Two-column taxonomy: methods grouped by aim (telos), views grouped by where the dispute lives (domain).
   Every label is horizontal. A thread means "this method presupposes this view".

   The diagram opens calm. Each group is shut and shows as one row, and only primary threads are drawn, so the
   first screen is a few groups joined by a few bands. A click on a group opens it and shows its members.
   Threads between two shut groups are bundled into one band whose width grows with the number of methods it carries.
   "Show all links" adds the secondary threads.

   Squares are methods and aims; circles are views and domains. A thread takes the colour of the view's domain.
   Heavy thread = the method's primary view; dashed = a primary pairing scholars contest.
   Rows inside an open group are ordered by the average height of their partners (a few barycentre sweeps).
   Click a name to focus it; click it again, or press "Read entry", to open the entry.
   opts.filtered = true applies the shared filter state (HOD.filters); opts.to hides entries dated after that year. */
(function () {
  const H = window.HOD;
  let allLinks = false;
  // Which column the views take. Set HOD.viewsLeft in data/taxonomy.js; "Swap sides" in the diagram flips it for the visit.
  let viewsLeft = H.viewsLeft !== false;
  // Open groups, as "t:<telos>" and "d:<domain>". The set lasts for the page, so a redraw keeps what the reader opened.
  const open = new Set();
  const tk = (m) => "t:" + m.telos, dk = (v) => "d:" + v.domain;
  // Open the group of an entry and the groups of its partners, so a link to one entry shows its threads name to name.
  H.bipExpand = (ids) => ids.forEach((id) => {
    if (H.M[id]) { open.add(tk(H.M[id])); H.M[id].views.forEach((v) => open.add(dk(H.V[v]))); }
    else if (H.V[id]) { open.add(dk(H.V[id])); H.V[id].methods.forEach((x) => open.add(tk(H.M[x.id]))); }
  });
  H.bipAllLinks = (on) => { allLinks = on; };
  H.bipOpenAll = () => { H.teloi.forEach((t) => open.add("t:" + t.id)); H.domains.forEach((d) => open.add("d:" + d.id)); };

  H.drawBipartite = function (host, opts = {}) {
    const F = opts.filtered ? H.filters : {};
    const methods = H.methods.filter((m) => H.keepM(m, F) && (opts.to == null || m.date <= opts.to));
    const views = H.views.filter((v) => H.keepV(v, F) && (opts.to == null || v.date <= opts.to));
    const vSet = new Set(views.map((v) => v.id));

    host.innerHTML = "";
    const bar = document.createElement("div"); bar.className = "focusbar"; host.append(bar);
    const scroller = document.createElement("div"); scroller.className = "bip-scroll"; host.append(scroller);
    const VL = viewsLeft;
    const groupsV = H.domains.filter((d) => views.some((v) => v.domain === d.id));
    const groupsM = H.teloi.filter((t) => methods.some((m) => m.telos === t.id));
    let pinned = null;
    const redraw = (pin) => H.drawBipartite(host, Object.assign({}, opts, { pin: pin === undefined ? pinned : pin }));
    const anyOpen = () => groupsM.some((g) => open.has("t:" + g.id)) || groupsV.some((g) => open.has("d:" + g.id));
    const controls = () => `<button type="button" class="swap" data-a="groups">${anyOpen() ? "Close all groups" : "Open all groups"}</button>
      <button type="button" data-a="swap" title="Put ${VL ? "methods" : "views"} on the left">⇄ Swap sides</button>
      <label class="primtoggle"><input type="checkbox" ${allLinks ? "checked" : ""}> Show all links</label>`;
    const wire = () => {
      bar.querySelector("[data-a=swap]").onclick = () => { viewsLeft = !viewsLeft; redraw(); };
      bar.querySelector("[data-a=groups]").onclick = () => { if (anyOpen()) { open.clear(); redraw(null); } else { H.bipOpenAll(); redraw(); } };
      bar.querySelector(".primtoggle input").onchange = (e) => { allLinks = e.target.checked; redraw(); };
    };
    const idle = () => {
      bar.innerHTML = `<span class="hint">${opts.filtered && H.filtersActive() ? "The filters are hiding some entries. " : ""}Click a group to open it. Click a name to focus it.</span>${controls()}`;
      wire();
    };
    if (!methods.length && !views.length) { bar.innerHTML = ""; scroller.innerHTML = "<p class='meta' style='padding:1rem'>Nothing matches these filters.</p>"; return {}; }

    const W = 1120, labelW = 250, dotL = labelW + 8, dotR = W - labelW - 8;
    const rowH = 18, headH = 30, top = 44;
    const isOpen = (key) => open.has(key);
    // The row a thread ends on: the entry itself when its group is open, the group otherwise.
    const endM = (m) => (isOpen(tk(m)) ? m.id : tk(m)), endV = (v) => (isOpen(dk(v)) ? v.id : dk(v));

    const agg = new Map();
    methods.forEach((m) => m.views.forEach((v, i) => {
      if (!vSet.has(v) || (i > 0 && !allLinks)) return;
      const a = endM(m), b = endV(H.V[v]), k = a + "|" + b;
      const l = agg.get(k) || { a, b, n: 0, prim: 0, contested: 0, domain: H.V[v].domain };
      l.n++; if (i === 0) { l.prim++; if (m.conf.pair === "contested") l.contested++; }
      agg.set(k, l);
    }));
    const links = [...agg.values()];

    // Column layout. Each group takes a heading row, and its members when it is open. The shorter column is spread to match.
    const byDate = (a, b) => H.get(a).date - H.get(b).date;
    const ordV = Object.fromEntries(groupsV.map((d) => [d.id, views.filter((v) => v.domain === d.id).map((v) => v.id).sort(byDate)]));
    const ordM = Object.fromEntries(groupsM.map((t) => [t.id, methods.filter((m) => m.telos === t.id).map((m) => m.id).sort(byDate)]));
    const natural = (groups, ord, pre) => groups.reduce((s, g) => s + headH + (isOpen(pre + g.id) ? ord[g.id].length * rowH : 0), 0);
    const hV = natural(groupsV, ordV, "d:"), hM = natural(groupsM, ordM, "t:"), body = Math.max(hV, hM);
    const Ht = top + body + 14;
    const place = (groups, ord, pre, h) => {
      const gap = groups.length > 1 ? (body - h) / (groups.length - 1) : 0;
      const rows = []; let y = top;
      groups.forEach((g) => {
        const key = pre + g.id, o = isOpen(key);
        rows.push({ head: true, id: g.id, key, y, open: o, cy: y + 17 });
        y += headH;
        if (o) ord[g.id].forEach((id) => { rows.push({ id, key: id, y: y + rowH / 2, cy: y + rowH / 2 }); y += rowH; });
        y += gap;
      });
      return rows;
    };
    const ys = (rows) => Object.fromEntries(rows.filter((r) => !r.head || !r.open).map((r) => [r.key, r.cy]));
    let rowsV = place(groupsV, ordV, "d:", hV), rowsM = place(groupsM, ordM, "t:", hM);
    let yV = ys(rowsV), yM = ys(rowsM);
    const bary = (ord, mine, theirs, other) => {
      for (const g in ord) {
        const k = {};
        ord[g].forEach((id) => {
          let s = 0, w = 0;
          links.forEach((l) => { if (l[mine] === id) { const q = l.prim ? 2 : 1; s += q * other[l[theirs]]; w += q; } });
          k[id] = w ? s / w : Infinity; // unlinked rows (views with no method) sink to the foot of their group
        });
        ord[g].sort((a, b) => (k[a] === k[b] ? byDate(a, b) : k[a] - k[b]));
      }
    };
    for (let i = 0; i < 4; i++) {
      bary(ordV, "b", "a", yM); rowsV = place(groupsV, ordV, "d:", hV); yV = ys(rowsV);
      bary(ordM, "a", "b", yV); rowsM = place(groupsM, ordM, "t:", hM); yM = ys(rowsM);
    }
    const left = VL ? rowsV : rowsM, right = VL ? rowsM : rowsV;
    const sideV = VL ? "L" : "R"; // the side that holds views

    const svg = d3.select(scroller).append("svg").attr("class", "bip")
      .attr("viewBox", [0, 0, W, Ht]).attr("width", W).attr("height", Ht)
      .attr("role", "img").attr("aria-label", VL ? "Views of what disagreement is about, grouped by where the dispute lives, linked to the methods that presuppose them, grouped by aim" : "Methods of disagreement, grouped by aim, linked to the views they presuppose, grouped by where the dispute lives")
      .style("display", "block").style("max-width", "100%").style("height", "auto").style("margin", "0 auto");
    svg.append("rect").attr("width", W).attr("height", Ht).attr("fill", "transparent").on("click", () => unpin());
    idle();

    const tM = "METHODS, by aim", tV = "VIEWS, by where it lives";
    svg.append("text").attr("class", "coltitle").attr("x", labelW).attr("y", 18).attr("text-anchor", "end").text(VL ? tV : tM);
    svg.append("text").attr("class", "coltitle").attr("x", W - labelW).attr("y", 18).text(VL ? tM : tV);
    svg.append("text").attr("class", "colsub").attr("x", W / 2).attr("y", 18).attr("text-anchor", "middle")
      .text(`${allLinks ? "heavy = primary view" : "primary views only"} · dashed = contested · wider = more methods`);

    const path = (l) => {
      const y1 = VL ? yV[l.b] : yM[l.a], y2 = VL ? yM[l.a] : yV[l.b], mx = (dotL + dotR) / 2;
      return `M${dotL},${y1} C${mx},${y1} ${mx},${y2} ${dotR},${y2}`;
    };
    const link = svg.append("g").selectAll("path").data(links).join("path").attr("class", (l) => "link" + (l.n > 1 ? " band" : ""))
      .attr("d", path).attr("stroke", (l) => H.domainColor[l.domain])
      .attr("stroke-width", (l) => (l.n === 1 ? (l.prim ? 2.2 : 1) : Math.min(10, 1.2 + 1.5 * Math.sqrt(l.n))))
      .attr("stroke-dasharray", (l) => (l.n === 1 && l.contested ? "6,4" : null));

    const mark = (g, x, y, col, sq, r, hollow) => (sq
      ? g.append("rect").attr("x", x - r).attr("y", y - r).attr("width", 2 * r).attr("height", 2 * r).attr("rx", 1)
      : g.append("circle").attr("cx", x).attr("cy", y).attr("r", r)).attr("fill", hollow ? "none" : col).attr("stroke", col).attr("stroke-width", 1.4);

    const head = (rows, side) => svg.append("g").selectAll("g").data(rows.filter((r) => r.head)).join("g").attr("class", (r) => "ghead" + (r.open ? "" : " shut"))
      .each(function (r) {
        const g = d3.select(this), isV = side === sideV;
        const col = isV ? H.domainColor[r.id] : H.teloColor[r.id];
        const name = isV ? H.D[r.id].name : H.T[r.id].name;
        const x0 = side === "L" ? 0 : W - labelW;
        g.append("rect").attr("class", "gbox").attr("x", x0).attr("y", r.y + 8).attr("width", labelW).attr("height", 18).attr("rx", 3).attr("fill", col).attr("opacity", 0.14);
        g.append("text").attr("x", side === "L" ? labelW - 6 : x0 + 6).attr("y", r.y + 21)
          .attr("text-anchor", side === "L" ? "end" : "start").style("fill", col).text((r.open ? "▾ " : "▸ ") + name.toUpperCase());
        if (!r.open) mark(g, side === "L" ? dotL : dotR, r.cy, col, !isV, 4.6);
        g.append("title").text((isV ? H.D[r.id].gloss : H.T[r.id].gloss) + (r.open ? " Click to close the group." : " Click to open the group."));
      });
    head(left, "L"); head(right, "R");

    const item = (rows, side) => svg.append("g").selectAll("g").data(rows.filter((r) => !r.head)).join("g")
      .attr("class", (r) => "item" + (side === sideV && !H.V[r.id].methods.length ? " orphan" : ""))
      .each(function (r) {
        const g = d3.select(this), x = side === "L" ? dotL : dotR, isV = side === sideV;
        const col = H.colorOf(r.id), orphan = isV && !H.V[r.id].methods.length;
        g.append("rect").attr("class", "hit").attr("x", side === "L" ? 0 : dotR - 6).attr("y", r.y - 8).attr("width", labelW + 14).attr("height", 16);
        mark(g, x, r.y, col, !isV, 3.4, orphan);
        g.append("text").attr("x", side === "L" ? labelW : dotR + 8).attr("y", r.y).attr("dy", "0.34em")
          .attr("text-anchor", side === "L" ? "end" : "start").text(orphan ? (side === "L" ? "(no method)  " + H.get(r.id).name : H.get(r.id).name + "  (no method)") : H.get(r.id).name);
      });
    item(left, "L"); item(right, "R");
    const items = svg.selectAll(".item"), allHeads = svg.selectAll(".ghead");

    function focus(keys) {
      if (!keys) { svg.classed("focus", false); link.classed("on", false); items.classed("on", false); allHeads.classed("on", false); return; }
      const on = new Set(keys), lit = new Set(keys);
      links.forEach((l) => { if (on.has(l.a) || on.has(l.b)) { lit.add(l.a); lit.add(l.b); } });
      svg.classed("focus", true);
      link.classed("on", (l) => on.has(l.a) || on.has(l.b));
      items.classed("on", (r) => lit.has(r.key));
      allHeads.classed("on", (r) => lit.has(r.key));
      link.filter(".on").raise();
    }
    // The focused item carries a highlight and an upright "open" badge, so the second click reads as "open".
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
      const x = H.get(id), isM = !!H.M[id];
      const other = (isM ? VL : !VL) ? "left" : "right";
      const shut = links.some((l) => (l.a === id || l.b === id) && (l.a.includes(":") || l.b.includes(":")));
      bar.innerHTML = `${H.mark(id)}<b>${x.name}</b><span class="hint">${isM ? `presupposes what is lit on the ${other}` : `is assumed by what is lit on the ${other}`}${shut ? ". Open a lit group to see its members" : ""}</span>
        <button type="button" data-a="open">Read entry</button><button type="button" data-a="seq" title="Load ${H.esc(H.strip(x.name))} and everything lit into a reading sequence">Read these in sequence</button><button type="button" data-a="clear">Clear focus</button>${controls()}`;
      bar.querySelector("[data-a=open]").onclick = () => H.open(id);
      // The sequence is the focused entry, then every entry its lit threads reach, in the order of the column they sit in.
      bar.querySelector("[data-a=seq]").onclick = () => {
        const partners = isM ? x.views.filter((v, i) => vSet.has(v) && (allLinks || i === 0))
          : methods.filter((m) => m.views.some((v, i) => v === id && (allLinks || i === 0))).map((m) => m.id);
        const rank = (p) => { const k = H.M[p] ? [H.teloi.findIndex((t) => t.id === H.M[p].telos), H.M[p].date] : [H.domains.findIndex((d) => d.id === H.V[p].domain), H.V[p].date]; return k[0] * 1e5 + k[1]; };
        H.startSeq([id, ...partners.sort((p, q) => rank(p) - rank(q))], H.strip(x.name) + " and its threads");
      };
      bar.querySelector("[data-a=clear]").onclick = unpin;
      wire();
      if (opts.onPin) opts.onPin(id);
    }
    function unpin() { pinned = null; focus(null); badge(null); idle(); if (opts.onPin) opts.onPin(null); }

    items.style("cursor", "pointer")
      .on("mouseenter", (ev, r) => { if (!pinned) focus([r.id]); H.tip(H.tipFor(r.id), ev); })
      .on("mousemove", (ev, r) => H.tip(H.tipFor(r.id), ev))
      .on("mouseleave", () => { if (!pinned) focus(null); else focus([pinned]); H.tip(null); })
      .on("click", (ev, r) => { ev.stopPropagation(); H.tip(null); if (pinned === r.id) H.open(r.id); else pin(r.id); });
    const members = (r) => (r.key[0] === "d" && r.key[1] === ":" ? views.filter((v) => v.domain === r.id) : methods.filter((m) => m.telos === r.id)).map((x) => x.id);
    allHeads.style("cursor", "pointer")
      .on("mouseenter", (ev, r) => { if (!pinned) focus(r.open ? members(r) : [r.key]); })
      .on("mouseleave", () => { if (!pinned) focus(null); })
      .on("click", (ev, r) => {
        ev.stopPropagation();
        // Closing the group of the focused entry clears the focus, since the entry is no longer on screen.
        const drop = r.open && pinned && members(r).includes(pinned);
        if (r.open) open.delete(r.key); else open.add(r.key);
        redraw(drop ? null : pinned);
      });

    const has = (id) => items.filter((r) => r.id === id).size() > 0;
    if (opts.pin && has(opts.pin)) pin(opts.pin);
    else if (opts.pin && opts.onPin) opts.onPin(null);
    return { pin: (id) => { if (!has(id)) { H.bipExpand([id]); return redraw(id); } pin(id); }, unpin };
  };
})();
