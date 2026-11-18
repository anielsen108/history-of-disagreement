# History of Disagreement

A research project with two questions.

1. **How have people conducted conversations with disagreement?** The survey runs from ancient Greece to the present. It covers Socratic elenchus, sophistic antilogic, Aristotelian dialectic, the medieval *disputatio*, Talmudic *machloket*, Indian *vāda* traditions, early-modern rhetoric and the coffeehouse, parliamentary debate, pragma-dialectics, mediation, nonviolent communication, and online discourse.

2. **What has disagreement been framed as "really about"?** Each era offers its own diagnosis. Disagreement has been read as error to correct, a test of character, a path to truth, a contest of interests or power, a clash of values or identities, miscommunication, unmet needs, and differing models of the world.

## The website

`site/` is a static website (no build step) that presents both questions with a graphic taxonomy:

- **View ↔ method diagram.** Two columns joined by threads, with all labels horizontal. Views sit on the left, grouped by *domain*: epistemic, linguistic, power, axiological, interest, relational, psyche, contemplative, generative. Methods sit on the right, grouped by *telos*: truth, formation, victory, plurality, decision, settlement, understanding, release. Each thread links a view to a method that presupposes it. Group and row order are chosen to minimise crossings, and a toggle leaves only each method’s primary thread.
- **Lineage map.** Methods placed on a compressed time axis, one lane per family of practice, with lines of descent. It is drawn to the page width, with half the axis given to the years since 1900.
- **Table.** Every view against the eight teloi, with each cell naming the methods that presuppose it, plus a domain × telos summary.
- Entry pages for 74 methods and 55 views, a combined timeline, and a bibliography of about 170 sources.
- **Exploring.** Site-wide search (press `/`); facet filters by telos, domain and culture and a century slider with Play on the diagram; click to focus; permalinks for entries (`#e=id`), people (`#p=id`), terms (`#g=id`), tours (`#tour=path.n`) and filter state (`taxonomy.html?telos=…&to=…&focus=…`); an "Over time" chart of diagnoses by period.
- **Using.** *Diagnose* (stasis-style questions → domains → fitting methods) and a mismatch finder; *Compare* two methods side by side; a worked example running one dispute through five methods.
- **Reading.** Strongest critique and confidence flags on every method; primary-text excerpts; a glossary with hover cards in entry text; seven guided reading paths; an influence graph of about sixty people; a gap gallery sketching methods for the views no method presupposes.
- **Orienting.** A five-step welcome tour on a first visit (remembered in the browser, replayable) and a Help button on every page (or press `?`). The Methods and Views lists fold each entry to one line.
- **Keeping.** Private notes per entry (stored in the browser, exportable), a pre-filled GitHub issue link for corrections, a one-page printable chart, and open data as JSON and CSV in `site/data/open/`.

Preview locally with `cd site && python3 -m http.server`. To deploy on Netlify, connect the repo; `netlify.toml` publishes `site/` with no build command.

## Structure

- `site/data/*.js`: the single source of truth (methods, views, taxonomy axes, sources, extras such as critiques and confidence, people, glossary, and content: excerpts, paths, gaps and the worked example).
- `site/data/open/`: **generated** open data (`hod.json`, `methods.csv`, `views.csv`, `links.csv`, `people.csv`, `sources.csv`).
- `approaches/`: one note per method, **generated** from the data.
- `framings/`: one note per view, **generated** from the data.
- `sources/bibliography.md`: **generated**.
- `timeline.md`: **generated**.
- `scripts/lint-prose.mjs`: checks all site prose against the style sheet on the About page (banned words, em dashes, rhetorical questions, stacked hedges, “not X but Y”, long sentences and paragraphs, plus two read-aloud checks: repeated sentence openings and runs of very short sentences). Run it before committing; accepted exceptions go in `scripts/lint-allow.txt`.
- `site/data/readings.js`: named scholarly readings and claim status for the most contested entries.
- `scripts/export-markdown.mjs`: regenerates the notes and the open data (`node scripts/export-markdown.mjs`). Edit the data, not the generated Markdown.

## Status

First full draft. Known gaps are listed on the site’s About page. Contributions and corrections are welcome.
