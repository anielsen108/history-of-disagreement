/* Diagnose a dispute (stasis-style questionnaire) and the mismatch finder. */
(function () {
  const H = window.HOD;

  const QUESTIONS = [
    { d: "epistemic", q: "Do you disagree about what happened, what is the case, or what will happen?" },
    { d: "linguistic", q: "Are you using the same words to mean different things, or arguing over what to call something?" },
    { d: "axiological", q: "Do you weigh what matters differently, even where you agree on the facts?" },
    { d: "interest", q: "Is something scarce at stake: money, time, land, a job, a share?" },
    { d: "power", q: "Is the real question who gets to decide, or who has standing to speak?" },
    { d: "psyche", q: "Are fear, pride, hurt or a need for safety driving the exchange?" },
    { d: "relational", q: "Does it feel as if respect, identity or the relationship itself is on the line?" },
    { d: "contemplative", q: "Is something sacred at stake, or is someone (perhaps you) holding on to being right?" },
    { d: "generative", q: "Could the disagreement itself be useful, as a source of new ideas or a check on error?" }
  ];
  const GOALS = [
    ["truth", "Find out what is true"], ["decision", "Reach a decision together"], ["settlement", "Agree on terms"],
    ["understanding", "Understand each other"], ["plurality", "Keep both views alive"], ["release", "Stop being gripped by the fight"],
    ["formation", "Learn or train through it"], ["victory", "Win"]
  ];
  // what would end the dispute, as seen from inside each domain
  H.domainSatisfier = {
    epistemic: "evidence, a test, or a better argument", linguistic: "agreed definitions, or a dispute over usage made explicit",
    axiological: "a choice of priorities, or an arrangement for coexistence", interest: "a deal both can accept",
    power: "a decision procedure both accept as legitimate", psyche: "safety and being heard",
    relational: "recognition, respect and repair", contemplative: "letting go of the position, or reverence for what is at stake",
    generative: "keeping the tension productive and leaving it open"
  };
  // Questions and goals follow the one order of groups used on every page.
  QUESTIONS.sort((a, b) => H.domains.findIndex((d) => d.id === a.d) - H.domains.findIndex((d) => d.id === b.d));
  GOALS.sort((a, b) => H.teloi.findIndex((t) => t.id === a[0]) - H.teloi.findIndex((t) => t.id === b[0]));
  const STASIS_ORDER = ["epistemic", "linguistic", "axiological", "power"];

  function diagnose(form, out) {
    const w = {};
    QUESTIONS.forEach((x) => { w[x.d] = +(form.querySelector(`[name=q-${x.d}]:checked`) || { value: 0 }).value; });
    const goal = form.querySelector("[name=goal]").value;
    const total = Object.values(w).reduce((a, b) => a + b, 0);
    if (!total) { out.innerHTML = `<p class="meta">Answer at least one question with “yes” or “somewhat”.</p>`; return; }
    const doms = H.domains.filter((d) => w[d.id]).sort((a, b) => w[b.id] - w[a.id]);
    const scored = H.methods.map((m) => {
      let s = 0; const why = new Set();
      m.views.forEach((v, i) => { const d = H.V[v].domain; if (w[d]) { s += w[d] * (i === 0 ? 2 : 1); why.add(H.D[d].name.toLowerCase()); } });
      if (m.telos === goal) s += 4;
      if (m.telos === "victory" && goal !== "victory") s -= 3;
      return { m, s, why: [...why] };
    }).filter((x) => x.s > 0).sort((a, b) => b.s - a.s || b.m.date - a.m.date).slice(0, 8);
    const stasisHit = STASIS_ORDER.filter((d) => w[d]);
    out.innerHTML = `
      <h2>Where the dispute lives</h2>
      <div class="diag-doms">${doms.map((d) => `<div class="diag-dom" style="border-color:${H.domainColor[d.id]}">
        <b style="color:${H.domainColor[d.id]}">${d.name}</b> <span class="meta">${w[d.id] === 2 ? "strongly" : "partly"}</span>
        <p>${d.gloss}</p><p class="meta">Would be ended by: ${H.domainSatisfier[d.id]}.</p>
        <p class="rel"><b>Views here</b>${H.views.filter((v) => v.domain === d.id).map((v) => H.link(v.id)).join(", ")}</p></div>`).join("")}</div>
      ${stasisHit.length > 1 ? `<p class="note">Stasis theory’s rule of order applies. Settle the earlier question before the later one: ${stasisHit.map((d) => H.D[d].name.toLowerCase()).join(" → ")}. A dispute argued at two stases at once usually has each party winning on a different question.</p>` : ""}
      ${doms.length > 2 ? `<p class="note">Several domains are live at once. Expect each party to experience the other’s “solution” as missing the point. The <a href="#mismatch">mismatch finder</a> below can show where.</p>` : ""}
      <h2>Methods that fit</h2>
      <ol class="diag-methods">${scored.map(({ m, why }) => `<li>${H.link(m.id)} <span class="meta">· aim: ${H.T[m.telos].name.toLowerCase()}${m.telos === goal ? " (matches your goal)" : ""} · addresses ${why.join(", ")}</span>
        <div class="meta">${m.failure ? "Watch for: " + m.failure : ""}</div></li>`).join("")}</ol>
      <p><a class="btn primary" href="taxonomy.html?only=${[...scored.map((x) => x.m.id), ...new Set(scored.flatMap((x) => x.m.views.filter((v) => w[H.V[v].domain])))].join(",")}">Show these in the diagram →</a>
        <span class="meta">The diagram opens with only these methods and the views they rest on in the places you marked.</span></p>`;
  }

  function mismatch(form, out) {
    const a = form.querySelector("[name=va]").value, b = form.querySelector("[name=vb]").value;
    if (!a || !b) { out.innerHTML = ""; return; }
    const A = H.V[a], B = H.V[b];
    const both = H.methods.filter((m) => m.views.includes(a) && m.views.includes(b));
    const bothDom = H.methods.filter((m) => !both.includes(m) && m.views.some((v) => H.V[v].domain === A.domain) && m.views.some((v) => H.V[v].domain === B.domain));
    const same = a === b, sameDom = A.domain === B.domain;
    out.innerHTML = `
      ${same ? `<p>Both parties already share a diagnosis: <b>${A.name}</b>. Your disagreement is inside one frame, which is the easiest kind. Use the methods that presuppose it: ${A.methods.map((x) => H.link(x.id)).join(", ") || "none listed"}.</p>`
      : `<div class="mm-grid">
          <div class="diag-dom" style="border-color:${H.domainColor[A.domain]}"><b>Party A</b> thinks it is about <b>${A.name}</b> (${H.D[A.domain].name}).<p class="meta">A will be satisfied by ${H.domainSatisfier[A.domain]}.</p><p class="meta">A’s remedy: ${A.implies}</p></div>
          <div class="diag-dom" style="border-color:${H.domainColor[B.domain]}"><b>Party B</b> thinks it is about <b>${B.name}</b> (${H.D[B.domain].name}).<p class="meta">B will be satisfied by ${H.domainSatisfier[B.domain]}.</p><p class="meta">B’s remedy: ${B.implies}</p></div>
        </div>
        <p>${sameDom ? `You agree on the domain (${H.D[A.domain].name.toLowerCase()}) but not the diagnosis within it, so you are close: make the two diagnoses explicit and test which fits.`
          : `You are likely talking past each other. Each of A’s moves will look to B like a dodge, and the reverse. From A’s side the dispute ends with ${H.domainSatisfier[A.domain]}; from B’s, with ${H.domainSatisfier[B.domain]}. Neither can be achieved by doing more of the other.`}</p>
        <h3>Bridging methods</h3>
        ${both.length ? `<p>These methods presuppose both diagnoses at once: ${both.map((m) => H.link(m.id)).join(", ")}.</p>` : ""}
        ${bothDom.length ? `<p>${both.length ? "Also relevant, since they" : "No method presupposes both views exactly. These"} span both domains: ${bothDom.map((m) => H.link(m.id)).join(", ")}.</p>` : ""}
        ${!both.length && !bothDom.length ? `<p>No method in this survey spans both domains. Start with a meta-conversation about what the dispute is about. The <a href="methods.html#stasis">stasis</a> questions above are one way, and <a href="methods.html#difficult">the three conversations</a> another.</p>` : ""}`}`;
  }

  H.initDiagnose = function () {
    const form = document.getElementById("diag-form"), out = document.getElementById("diag-out");
    form.querySelector("#qs").innerHTML = QUESTIONS.map((x) => `<fieldset class="q"><legend>${H.dot(H.domainColor[x.d])}${x.q}</legend>
      ${[["2", "Yes"], ["1", "Somewhat"], ["0", "No"]].map(([v, l]) => `<label><input type="radio" name="q-${x.d}" value="${v}"${v === "0" ? " checked" : ""}> ${l}</label>`).join("")}</fieldset>`).join("");
    form.querySelector("[name=goal]").innerHTML = GOALS.map(([v, l]) => `<option value="${v}">${l}</option>`).join("");
    form.addEventListener("change", () => diagnose(form, out));
    form.addEventListener("submit", (e) => { e.preventDefault(); diagnose(form, out); });

    const mf = document.getElementById("mm-form"), mo = document.getElementById("mm-out");
    const opts = `<option value="">Choose…</option>` + H.domains.map((d) => `<optgroup label="${d.name}">${H.views.filter((v) => v.domain === d.id).map((v) => `<option value="${v.id}">${v.name}</option>`).join("")}</optgroup>`).join("");
    mf.querySelectorAll("select").forEach((s) => (s.innerHTML = opts));
    mf.addEventListener("change", () => mismatch(mf, mo));
    // permalink support: ?a=view&b=view
    const p = new URLSearchParams(location.search);
    if (p.get("a")) mf.querySelector("[name=va]").value = p.get("a");
    if (p.get("b")) mf.querySelector("[name=vb]").value = p.get("b");
    mismatch(mf, mo);
  };
})();
