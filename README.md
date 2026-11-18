# History of Disagreement

A research project with two questions.

1. **How have people conducted conversations with disagreement?** The survey runs from ancient Greece to the present. It covers Socratic elenchus, sophistic antilogic, Aristotelian dialectic, the medieval *disputatio*, Talmudic *machloket*, Indian *vāda* traditions, early-modern rhetoric and the coffeehouse, parliamentary debate, pragma-dialectics, mediation, nonviolent communication, and online discourse.

2. **What has disagreement been framed as "really about"?** Each era offers its own diagnosis. Disagreement has been read as error to correct, a test of character, a path to truth, a contest of interests or power, a clash of values or identities, miscommunication, unmet needs, and differing models of the world.

## The website

`site/` is a static website (no build step) that presents both questions with a graphic taxonomy:

- **Method ↔ view diagram.** Two columns joined by threads, with all labels horizontal. Methods sit on the left, grouped by *telos*: truth, victory, formation, decision, settlement, understanding, plurality, release. Views sit on the right, grouped by *domain*: epistemic, linguistic, axiological, interest, power, psyche, relational, contemplative, generative. Each thread links a method to a view of disagreement it presupposes.
- **Lineage map.** Methods placed on a compressed time axis, one lane per family of practice, with lines of descent.
- **Table.** Every method against the nine domains, with each cell naming the views it presupposes, plus a telos × domain summary.
- Entry pages for 70 methods and 54 views, a combined timeline, and a bibliography of about 160 sources.

Preview locally with `cd site && python3 -m http.server`. To deploy on Netlify, connect the repo; `netlify.toml` publishes `site/` with no build command.

## Structure

- `site/data/*.js`: the single source of truth (methods, views, taxonomy axes, sources).
- `approaches/`: one note per method, **generated** from the data.
- `framings/`: one note per view, **generated** from the data.
- `sources/bibliography.md`: **generated**.
- `timeline.md`: **generated**.
- `scripts/export-markdown.mjs`: regenerates the notes (`node scripts/export-markdown.mjs`). Edit the data, not the generated Markdown.

## Status

First full draft. Known gaps are listed on the site’s About page. Contributions and corrections are welcome.
