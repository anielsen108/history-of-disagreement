/* Change over time: for each period, the share of methods (or of all method→view links)
   falling in each domain. Horizontal stacked bars, all labels upright. */
(function () {
  const H = window.HOD;
  H.periods = [
    [-1e4, 0, "before 1 CE"], [0, 500, "1–500"], [500, 1100, "500–1100"], [1100, 1500, "1100–1500"],
    [1500, 1800, "1500–1800"], [1800, 1900, "1800–1900"], [1900, 1950, "1900–1950"], [1950, 1980, "1950–1980"], [1980, 3000, "1980–present"]
  ];
  H.driftRows = (mode, periods) => (periods || H.periods).map(([a, b, n]) => {
    const ms = H.methods.filter((m) => m.date >= a && m.date < b);
    const c = {}; let total = 0;
    ms.forEach((m) => (mode === "all" ? m.views : m.views.slice(0, 1)).forEach((v) => { const d = H.V[v].domain; c[d] = (c[d] || 0) + 1; total++; }));
    return { n, a, b, methods: ms.length, total, c };
  });
  H.drawDrift = function (host, mode = "primary", periods) {
    host.innerHTML = "";
    const rows = H.driftRows(mode, periods).filter((r) => r.total);
    const W = 760, L = 104, R = 86, rh = 30;
    const svg = d3.select(host).append("svg").attr("class", "drift").attr("viewBox", [0, 0, W, rows.length * rh + 8])
      .attr("role", "img").attr("aria-label", "Share of methods by domain of their primary view, per period")
      .style("width", "100%").style("height", "auto").style("display", "block");
    const unit = mode === "all" ? "presuppositions" : "methods";
    rows.forEach((r, i) => {
      let x = L;
      svg.append("text").attr("x", L - 8).attr("y", i * rh + 19).attr("text-anchor", "end").text(r.n);
      H.domains.forEach((d) => {
        const k = r.c[d.id] || 0; if (!k) return;
        const w = (W - L - R) * k / r.total;
        svg.append("rect").attr("class", "seg").attr("x", x).attr("y", i * rh + 4).attr("width", Math.max(w, 0.5)).attr("height", rh - 8).attr("fill", H.domainColor[d.id])
          .on("mousemove", (ev) => H.tip(`<b>${r.n}</b><br>${d.name}: ${k} of ${r.total} ${unit} (${Math.round(100 * k / r.total)}%)`, ev))
          .on("mouseleave", () => H.tip(null));
        const pct = Math.round(100 * k / r.total) + "%";
        if (w > 30) svg.append("text").attr("x", x + 4).attr("y", i * rh + 19).style("font-size", "11px").style("fill", "#fff").style("pointer-events", "none").text(w > d.name.length * 6.6 + 40 ? `${d.name} ${pct}` : pct);
        x += w;
      });
      svg.append("text").attr("x", W - R + 8).attr("y", i * rh + 19).style("fill", "var(--ink-3)").text(`${r.methods} method${r.methods === 1 ? "" : "s"}`);
    });
    return rows;
  };
})();
