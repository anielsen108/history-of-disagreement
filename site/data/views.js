/* Views: accounts of what disagreement is "really about".
   domain — where the disagreement is said to live (see taxonomy.js).
   implies — the remedy the diagnosis recommends. */
var HOD = window.HOD = window.HOD || {};
HOD.views = [
// ───────────────────────────── Epistemic ─────────────────────────────
{ id: "error", name: "Error & ignorance", domain: "epistemic", date: -400, when: "Socrates onward",
  who: "Plato; Aquinas; most of the rationalist tradition",
  summary: "Two contradictory claims cannot both be true, so at least one party is wrong. Disagreement is a symptom of error, and error is a privation, a lack of knowledge. Socratic intellectualism adds that no one errs willingly. Correct the belief and the dispute dissolves. This is the default account, so pervasive it is rarely stated.",
  implies: "Inquiry, refutation, instruction.",
  quote: { t: "No one goes willingly toward the bad.", src: "Plato, Protagoras 358c–d" },
  cite: [["plato", "Protagoras 358c–d"]] },

{ id: "aporia", name: "Inconsistency & aporia", domain: "epistemic", date: -430, when: "Socratic elenchus",
  who: "Socrates; Vlastos; Hamblin",
  summary: "The disagreement that matters is within a person, among beliefs they already hold. An interlocutor is shown that their commitments cannot all stand. The external opponent is only the occasion for internal disagreement. Formal dialectic later makes this precise as a commitment store that has to stay consistent.",
  implies: "Elenchus, obligational games, commitment-tracking.",
  cite: [["vlastos1983"], ["hamblin1970"]] },

{ id: "endoxa", name: "Disputed reputable opinion", domain: "epistemic", date: -350, when: "Aristotle",
  who: "Aristotle",
  summary: "Some questions belong to things that ‘admit of being otherwise’, where only probable premises are available. Reputable opinions conflict, and working through the puzzles (diaporēsai) on both sides is how one approaches first principles. Disagreement is the normal texture of practical and dialectical reasoning, not a sign that someone has blundered.",
  implies: "Dialectic, rhetoric, the method of endoxa (Nicomachean Ethics VII.1).",
  quote: { t: "For those who wish to get clear of difficulties it is advantageous to discuss the difficulties well.", src: "Aristotle, Metaphysics III.1, 995a27–28" },
  cite: [["aristotle", "Topics 100b21–23; Metaphysics 995a24–b4; NE 1145b2–7"]] },

{ id: "perspectival", name: "Partial perspectives", domain: "epistemic", date: -450, when: "Protagoras; Jain anekānta; Mill; Nietzsche",
  who: "Protagoras; Jain logicians; J. S. Mill; Nietzsche",
  summary: "Each party sees a real aspect of something larger. The blind men are each right about the elephant and wrong only in saying ‘only’. Mill’s secular version holds that conflicting doctrines ‘share the truth between them’. Nietzsche’s holds that ‘there is only a perspective seeing’, and that the more eyes we bring to a thing, the more complete our ‘objectivity’.",
  implies: "Standpoint indexing, both-sides argument, synthesis.",
  quote: { t: "There is only a perspective seeing, only a perspective ‘knowing’.", src: "Nietzsche, Genealogy III.12" },
  cite: [["matilal1981"], ["udana", "6.4"], ["mill1859", "ch. 2"], ["nietzsche1887", "III.12"]] },

{ id: "equipollence", name: "Undecidability", domain: "epistemic", date: 180, when: "Pyrrhonism; Kant’s antinomies",
  who: "Sextus Empiricus; Immanuel Kant",
  summary: "Some disputes are interminable because the arguments on each side are of equal force (isostheneia). For Sextus this is a reason to suspend judgment. For Kant, the antinomies show reason in conflict with itself whenever it overreaches experience. The dispute is a structural feature of the question, not a fault of the disputants.",
  implies: "Suspension; critique of the question; demarcation.",
  cite: [["sextus", "PH 1.8, 1.165"], ["kant1781", "A405–567/B432–595; A738/B766"]] },

{ id: "calculation", name: "Calculation error", domain: "epistemic", date: 1685, when: "Leibniz",
  who: "G. W. Leibniz",
  summary: "With an adequate notation, every dispute would be a mistake in calculation, checkable like a sum. Disagreement is an artefact of natural language’s imprecision.",
  implies: "Formalisation; ‘Calculemus!’",
  quote: { t: "Let us calculate, without further ado, to see who is right.", src: "Leibniz, The Art of Discovery (1685)" },
  cite: [["leibniz1685"]] },

{ id: "inquiry", name: "Unfinished inquiry", domain: "epistemic", date: 1877, when: "Peirce; Dewey",
  who: "C. S. Peirce",
  summary: "Disagreement is the state of a community whose inquiry has not yet converged. Under the method of science, the opinion ‘fated to be ultimately agreed to by all who investigate’ is what we mean by truth. Disagreement is therefore temporal, not permanent.",
  implies: "Better experiments; patience; fallibilism.",
  cite: [["peirce1877"], ["peirce1878"]] },

{ id: "burdens", name: "Burdens of judgment", domain: "epistemic", date: 1993, when: "Rawls 1993 (anticipated by ʿilm al-khilāf)",
  who: "John Rawls",
  summary: "Reasonable people disagree without any of them being irrational or ill-willed. Evidence is complex and conflicting. People weigh considerations differently. Concepts are vague at the edges. Total life experience shapes judgment. Normative considerations pull both ways, and every institution must select among values. Reasonable pluralism is the natural outcome of free reason, not a disaster.",
  implies: "Toleration; public reason; deliberation without expectation of convergence.",
  cite: [["rawls1993", "Lecture II §2"]] },

{ id: "priors", name: "Divergent priors & models", domain: "epistemic", date: 1976, when: "Aumann 1976; Cowen & Hanson 2004",
  who: "Robert Aumann; Robin Hanson; Tyler Cowen; CFAR",
  summary: "Bayesian agents with common priors whose posteriors are common knowledge cannot agree to disagree. Persistent disagreement therefore implies different priors, private information that has not been shared, or something other than honest truth-seeking. Cowen and Hanson draw the uncomfortable conclusion that most disagreements are not honest, because each party gives its own judgment more weight than it should. The practical version breaks the dispute down into world-models and finds the crux.",
  implies: "Share evidence; locate cruxes; bet; update.",
  cite: [["aumann1976"], ["cowen2004"], ["sabien2017"]] },

{ id: "peer", name: "Higher-order evidence", domain: "epistemic", date: 2005, when: "Kelly 2005; Christensen 2007; Elga 2007",
  who: "Thomas Kelly; David Christensen; Adam Elga",
  summary: "Suppose you learn that an epistemic peer, someone as informed and as able as you, disagrees. Should you move toward their view? Conciliationists (Christensen, Elga) say yes: ‘equal weight’. Steadfast views (Kelly) say the first-order evidence still counts. Here disagreement is itself evidence, and evidence about one’s own reliability.",
  implies: "Calibrated humility; or principled steadfastness.",
  cite: [["kelly2005"], ["christensen2007"], ["elga2007"]] },

{ id: "paradigm", name: "Incommensurable paradigms", domain: "epistemic", date: 1962, when: "Kuhn 1962",
  who: "Thomas Kuhn",
  summary: "Across a revolution, scientists ‘practice their trades in different worlds’. They disagree about which problems matter, what counts as a solution and what terms mean, so that there is no neutral algorithm of choice. Persuasion across paradigms resembles conversion.",
  implies: "Translation, exemplars, time; not a crucial experiment.",
  cite: [["kuhn1962", "chs. 10, 12"]] },

// ───────────────────────────── Linguistic ─────────────────────────────
{ id: "names", name: "Disorder of names", domain: "linguistic", date: -250, when: "Confucius; Xunzi; Later Mohists",
  who: "Confucius; Xunzi; the Mohists",
  summary: "Disputes arise when names no longer track realities and roles. For the Mohists, every bian is about whether a name fits. For Xunzi, deviant sophists who ‘confuse names’ create disorder that a true king must correct.",
  implies: "Rectify names, by sage convention or by disputation.",
  quote: { t: "If names are not correct, speech will not accord with things.", src: "Analects 13.3" },
  cite: [["analects", "13.3"], ["hutton2014", "ch. 22"], ["graham1978"]] },

{ id: "equivocation", name: "Equivocation & verbal dispute", domain: "linguistic", date: -350, when: "Aristotle; Abelard; James 1907; Chalmers 2011",
  who: "Aristotle; Peter Abelard; William James; David Chalmers",
  summary: "The parties use one word in two senses and so do not really contradict each other. Aristotle classes homonymy first among the fallacies dependent on language. Abelard reconciles authorities by distinguishing senses. In James’s squirrel case, whether a man ‘goes round’ a squirrel depends on what ‘round’ means. Chalmers proposes the ‘method of elimination’: ban the contested word and see whether a dispute remains.",
  implies: "Distinguo; taboo the word; restate without the term.",
  cite: [["aristotle", "Sophistical Refutations 165b23–166a7"], ["abelard", "Prologue"], ["james1907", "Lecture II"], ["chalmers2011"]] },

{ id: "attitude", name: "Disagreement in attitude", domain: "linguistic", date: 1944, when: "Stevenson 1944, 1948",
  who: "C. L. Stevenson",
  summary: "Stevenson distinguishes disagreement in belief, about how things are, from disagreement in attitude, about what to favour. Ethical disputes are chiefly the latter, carried on in language that sounds descriptive. Belief-change can shift attitude, but nothing guarantees it will.",
  implies: "Separate belief from attitude; persuasive definitions are moves, not findings.",
  cite: [["stevenson1944"], ["stevenson1948"]] },

{ id: "metaling", name: "Metalinguistic negotiation", domain: "linguistic", date: 2013, when: "Plunkett & Sundell 2013",
  who: "David Plunkett; Tim Sundell",
  summary: "Many apparently factual disputes, such as whether Secretariat is an ‘athlete’ or whether waterboarding is ‘torture’, are disputes about how a word ought to be used. These disputes are real and important because words have practical consequences. A verbal dispute is not therefore a merely verbal one.",
  implies: "Make the normative question about usage explicit (conceptual engineering).",
  cite: [["plunkett2013"]] },

{ id: "hinges", name: "Hinges & language-games", domain: "linguistic", date: 1951, when: "Wittgenstein, <i>On Certainty</i> (written 1949–51)",
  who: "Ludwig Wittgenstein",
  summary: "Some propositions are not conclusions but hinges on which doubting turns. When two parties’ hinges differ, reasons run out. ‘Where two principles really do meet which cannot be reconciled with one another, then each man declares the other a fool and heretic.’ ‘At the end of reasons comes persuasion.’",
  implies: "Show rather than prove; conversion; patient description of the other’s game.",
  cite: [["wittgenstein1969", "§§341–343, 609–612"]] },

{ id: "vocabularies", name: "Clash of final vocabularies", domain: "linguistic", date: 1989, when: "Rorty 1979, 1989",
  who: "Richard Rorty",
  summary: "Everyone carries a ‘final vocabulary’, words beyond which they have only circular argument. Disputes between vocabularies are not settled by evidence. One vocabulary is redescribed in terms of another, or the conversation simply continues. Edifying philosophy aims to keep the conversation going, not to end it with truth.",
  implies: "Redescription; irony; keep the conversation going.",
  cite: [["rorty1979", "ch. 8"], ["rorty1989", "ch. 4"]] },

{ id: "differend", name: "The differend", domain: "linguistic", date: 1983, when: "Lyotard 1983",
  who: "Jean-François Lyotard",
  summary: "A differend is a conflict between parties that cannot be equitably resolved because no rule of judgment applies to both. To settle it in one party’s idiom wrongs the other, whose harm cannot be stated in that idiom. Litigation presupposes a shared genre; a differend is precisely where none exists.",
  implies: "Bear witness; find idioms for what cannot yet be phrased.",
  cite: [["lyotard1983"]] },

{ id: "validity", name: "Contested validity claims", domain: "linguistic", date: 1981, when: "Habermas 1981",
  who: "Jürgen Habermas",
  summary: "Speech acts implicitly claim truth, rightness and sincerity. Disagreement occurs when a hearer rejects one of these claims, which tells us which kind of argument the disagreement requires: theoretical discourse, practical discourse, or the test of consistent conduct over time.",
  implies: "Discourse; ideal speech situation.",
  cite: [["habermas1981", "vol. 1, ch. 3"]] },

// ───────────────────────────── Axiological ─────────────────────────────
{ id: "unmeasurable", name: "What cannot be measured", domain: "axiological", date: -399, when: "Plato, Euthyphro",
  who: "Socrates (Euthyphro 7b–d)",
  summary: "Socrates observes that disputes about number, size and weight are ended by counting, measuring and weighing. The disputes that cause anger and enmity concern the just and unjust, the noble and shameful, the good and bad, for which we have no agreed standard of decision. It is the earliest explicit statement that value disagreements differ in kind.",
  implies: "Find a measure, or accept enduring enmity.",
  cite: [["plato", "Euthyphro 7b–d"]] },

{ id: "warring_gods", name: "Value pluralism", domain: "axiological", date: 1919, when: "Weber 1917/19; Berlin 1958",
  who: "Max Weber; Isaiah Berlin",
  summary: "The ultimate values of life are irreconcilable. ‘The various value spheres of the world stand in irreconcilable conflict with each other.’ Berlin adds that goods are many, cannot be measured on one scale, and conflict, so that tragic loss is built into choice. Disagreement may be neither error nor confusion, but the correct perception of real incompatibility.",
  implies: "Choose and own the choice; build institutions for coexistence.",
  quote: { t: "Many old gods ascend from their graves… and resume their eternal struggle with one another.", src: "Weber, Science as a Vocation" },
  cite: [["weber1919"], ["berlin1958"]] },

{ id: "foundations", name: "Moral foundations", domain: "axiological", date: 2009, when: "Graham, Haidt & Nosek 2009; Haidt 2012",
  who: "Jonathan Haidt and collaborators",
  summary: "Moral judgment rests on a few intuitive foundations: care, fairness, loyalty, authority, sanctity and, later, liberty. Political camps weight these differently. Reasoning mostly follows intuition, like a rider on an elephant, so disputes conducted in one camp’s foundations do not land in the other’s.",
  implies: "Moral reframing; humility about one’s own foundations.",
  cite: [["graham2009"], ["haidt2012"]] },

{ id: "sacred", name: "Sacred values", domain: "axiological", date: 2003, when: "Tetlock 2003; Atran & Axelrod 2008",
  who: "Philip Tetlock; Scott Atran; Robert Axelrod",
  summary: "Some values are protected from trade-offs, and offering money for them provokes moral outrage, not interest. Rational-choice bargaining backfires here. Symbolic gestures such as apology or recognition can open paths that material concessions close. Much ‘interest’ conflict is sacred-value conflict misdiagnosed.",
  implies: "Symbolic concessions; reframing; never price the sacred.",
  cite: [["tetlock2003"], ["atran2008"]] },

// ───────────────────────────── Interest ─────────────────────────────
{ id: "interests", name: "Interests beneath positions", domain: "interest", date: 1925, when: "Follett 1925; Fisher & Ury 1981",
  who: "Mary Parker Follett; Roger Fisher; William Ury",
  summary: "What people say they want, their positions, is a strategy for what they need, their interests. Positions are often incompatible where the interests behind them are not. Disagreement is about allocation, and allocation is a design problem.",
  implies: "Ask why; invent options; integrative bargaining.",
  cite: [["follett1925"], ["fisher1981"]] },

{ id: "faction", name: "Faction & party", domain: "interest", date: 1741, when: "Hume 1741; Madison 1787",
  who: "David Hume; James Madison",
  summary: "Hume sorts real factions into those from interest, those from principle (‘abstract speculative principle’, which he finds peculiar to modern times) and those from affection. Madison: the ‘latent causes of faction are thus sown in the nature of man’, and ‘the most common and durable source’ is the unequal distribution of property. These causes cannot be removed, so their effects must be controlled by an extended republic.",
  implies: "Institutional design that multiplies and balances factions.",
  cite: [["hume1741"], ["federalist10"]] },

{ id: "strategic", name: "Mixed-motive game", domain: "interest", date: 1960, when: "Nash 1950; Schelling 1960",
  who: "Thomas Schelling; John Nash",
  summary: "Conflict is rarely pure. The parties have a common interest in avoiding mutual loss and a conflicting interest over how to divide gains. What looks like argument is often signalling, commitment and the search for a focal point.",
  implies: "Bargaining analysis; credible commitments; focal points.",
  cite: [["schelling1960"], ["nash1950"]] },

{ id: "class", name: "Class interest & ideology", domain: "interest", date: 1848, when: "Marx & Engels 1848",
  who: "Karl Marx; Friedrich Engels",
  summary: "‘The history of all hitherto existing society is the history of class struggles.’ Ideas follow material positions, and the ruling ideas are the ideas of the ruling class. Many intellectual disagreements are class antagonisms that do not recognise themselves as such.",
  implies: "Ideology critique; organising; changing the material base.",
  cite: [["marx1848"]] },

// ───────────────────────────── Power ─────────────────────────────
{ id: "agon", name: "Contest & honour", domain: "power", date: -450, when: "archaic and classical Greece onward",
  who: "Greek agonistic culture; the sophists; Schopenhauer",
  summary: "Argument is a form of combat whose stake is standing. The contest is good in itself as an arena of excellence (Hesiod’s ‘good Eris’). In its degenerate form it is vanity defended by any means. What is at issue is not the proposition but who prevails before an audience.",
  implies: "Rules, judges, audiences; or withdrawal from the arena.",
  cite: [["kerferd1981"], ["schopenhauer1864"]] },

{ id: "sovereign", name: "War & sovereignty", domain: "power", date: 1651, when: "Hobbes 1651",
  who: "Thomas Hobbes",
  summary: "Private judgment about right and wrong is the seed of civil war. Dispute is a pre-political condition that only a sovereign arbiter can end. ‘Right reason’ is whatever reason the parties have agreed to treat as authoritative.",
  implies: "Arbitration; delegation of judgment.",
  cite: [["hobbes1651", "chs. 5, 13, 18"]] },

{ id: "friend_enemy", name: "Friend & enemy", domain: "power", date: 1932, when: "Schmitt 1932",
  who: "Carl Schmitt",
  summary: "The specifically political distinction is between friend and enemy. Any opposition, whether religious, moral or economic, becomes political when it is intense enough to group people as friends and enemies. Liberal discussion hopes to dissolve the political into endless conversation and therefore misunderstands it.",
  implies: "Decision, not debate (Schmitt); or agonistic taming (Mouffe).",
  cite: [["schmitt1932"]] },

{ id: "hegemony", name: "Hegemony", domain: "power", date: 2000, when: "Gramsci; Laclau & Mouffe; Mouffe 2000",
  who: "Chantal Mouffe",
  summary: "Every social order is a contingent hegemonic articulation, and every consensus excludes. Disagreement is the trace of what the current settlement suppresses. The goal is to legitimise it, not dissolve it.",
  implies: "Agonistic institutions; counter-hegemonic struggle.",
  cite: [["mouffe2000"], ["mouffe2005"]] },

{ id: "powerknow", name: "Power / knowledge", domain: "power", date: 1976, when: "Nietzsche 1887; Foucault 1976–80",
  who: "Friedrich Nietzsche; Michel Foucault",
  summary: "Each society has its ‘regime of truth’, which governs the types of discourse it accepts as true and who is authorised to say what counts. Disputes over truth are also struggles over the rules that produce truth. Who may speak is decided before what is said.",
  implies: "Genealogy; problematisation; attention to who is authorised to speak.",
  cite: [["foucault1980"], ["nietzsche1887"]] },

// ───────────────────────────── Psyche ─────────────────────────────
{ id: "vanity", name: "Vanity & obstinacy", domain: "psyche", date: 1831, when: "the Aṭṭhakavagga; Montaigne; Schopenhauer",
  who: "Schopenhauer; Montaigne; the Buddha of Sn 4",
  summary: "Most people cannot bear to be shown wrong. Once a position is stated, defending it becomes a matter of self-regard, and the original question is abandoned. Montaigne thought obstinacy and heat of opinion the surest sign of a weak mind.",
  implies: "Lower the stakes of being wrong; or exploit them (eristic).",
  cite: [["schopenhauer1864"], ["montaigne", "III.8"]] },

{ id: "needs", name: "Unmet needs", domain: "psyche", date: 1990, when: "Burton 1990; Rosenberg 1999",
  who: "John Burton; Marshall Rosenberg",
  summary: "Beneath interests lie universal human needs: security, identity, recognition, autonomy, meaning. These cannot be bargained over, but they can be satisfied, and they rarely truly conflict. Conflict is what unmet needs sound like.",
  implies: "Needs-based dialogue; ‘provention’ (Burton’s coinage).",
  cite: [["burton1990"], ["rosenberg2003"]] },

{ id: "threat", name: "Threat & defensiveness", domain: "psyche", date: 1951, when: "Rogers 1951; Rapoport 1960; Miller & Rollnick",
  who: "Carl Rogers; Anatol Rapoport",
  summary: "A person who feels threatened cannot hear. Evaluation is experienced as threat, and threat produces rigidity. Many disagreements persist because each side’s argument raises the other’s defences. The obstacle is affective, not logical.",
  implies: "Restate before rebutting; reduce threat; evoke rather than argue.",
  cite: [["rogers1952"], ["rapoport1960"]] },

{ id: "small_diff", name: "Narcissism of small differences", domain: "psyche", date: 1930, when: "Freud 1917–30",
  who: "Sigmund Freud",
  summary: "Communities with adjoining territories, and those related to each other in other ways, are especially prone to feud and ridicule. Hostility is greatest between those who are nearly alike. Disagreement here does not track distance of views. It serves the group’s cohesion and its narcissism.",
  implies: "Notice how close the opponent is.",
  cite: [["freud1930", "ch. 5"]] },

{ id: "mimetic", name: "Mimetic rivalry", domain: "psyche", date: 1972, when: "Girard 1961–72",
  who: "René Girard",
  summary: "We desire what the model desires, so imitation makes rivals of those who are alike. As rivalry escalates, the object disappears and the rivals become doubles, each mirroring the other’s violence. Communities resolve the crisis by uniting against a scapegoat.",
  implies: "Recognise the double; refuse the scapegoat.",
  cite: [["girard1972"]] },

{ id: "argumentative", name: "Argumentative reasoning", domain: "psyche", date: 2011, when: "Mercier & Sperber 2011; Kahan 2012",
  who: "Hugo Mercier; Dan Sperber; Dan Kahan",
  summary: "Reasoning evolved to produce and evaluate arguments in social exchange, not to find truth alone. Individuals show myside bias when producing arguments and are better at judging others’ arguments. Groups that argue can outperform individuals. Kahan adds identity-protective cognition: numerate partisans polarise more on politicised facts, not less.",
  implies: "Argue in groups with real diversity; decouple facts from identity.",
  cite: [["mercier2011"], ["mercier2017"], ["kahan2012"]] },

{ id: "developmental", name: "Developmental form", domain: "psyche", date: 1994, when: "Kegan 1994; Chapman",
  who: "Robert Kegan; David Chapman",
  summary: "The same disagreement takes a different shape depending on how a person makes meaning. At a ‘self-authoring’ order, one is one’s ideology and conflict is between systems. At a ‘self-transforming’ order, one can hold one’s own system as object, so conflict becomes a sign of over-identification with a partial form. Chapman’s ‘meta-rationality’ treats the fit between frame and situation as the real question.",
  implies: "Hold your system as object; ask what each frame is for.",
  cite: [["kegan1994"], ["chapman"]] },

// ───────────────────────────── Relational ─────────────────────────────
{ id: "identity", name: "Identity", domain: "relational", date: 1979, when: "Tajfel & Turner 1979; Stone et al. 1999",
  who: "Henri Tajfel; John Turner; Douglas Stone",
  summary: "People derive self-esteem from group membership, and intergroup comparison drives conflict even over trivial distinctions (the minimal-group paradigm). In dyads, the ‘identity conversation’ asks what being wrong would say about me. To concede the point is to lose the self.",
  implies: "Decouple claim from identity; affirm before challenging.",
  cite: [["tajfel1979"], ["stone1999"]] },

{ id: "recognition", name: "Struggle for recognition", domain: "relational", date: 1807, when: "Hegel 1807; Honneth 1992",
  who: "G. W. F. Hegel; Axel Honneth",
  summary: "Self-consciousness exists only in being acknowledged, so the first conflict is a life-and-death struggle for recognition. Honneth turns this into a moral grammar of social conflict. Disrespect in love, rights and esteem drives struggles that present themselves as being about other things.",
  implies: "Recognition as remedy; attend to disrespect beneath the stated grievance.",
  cite: [["hegel1807", "§§178–196"], ["honneth1992"]] },

{ id: "relationship_level", name: "Relationship-level message", domain: "relational", date: 1967, when: "Watzlawick et al. 1967",
  who: "Paul Watzlawick; Janet Beavin Bavelas; Don Jackson",
  summary: "Every communication has a content aspect and a relationship aspect, and the latter classifies the former. Couples argue about the dishes while negotiating dominance and care. Each party also ‘punctuates’ the sequence differently (‘I withdraw because you nag’; ‘I nag because you withdraw’), so each sees the other as the cause.",
  implies: "Metacommunicate; change the pattern, not the topic.",
  cite: [["watzlawick1967"]] },

{ id: "harm", name: "Harm to relationship", domain: "relational", date: 1990, when: "Zehr 1990",
  who: "Howard Zehr; restorative and indigenous traditions",
  summary: "Conflict and crime are wounds in a web of relationships, not abstract violations. The question is not ‘who is right?’ or ‘what rule was broken?’ but ‘who was hurt, and what do they need?’",
  implies: "Repair; circles; reintegration.",
  cite: [["zehr1990"], ["braithwaite1989"]] },

{ id: "character", name: "Character & motive", domain: "relational", date: -430, when: "Plato; Avot 5:17; Nyāya",
  who: "Socrates; the Mishnah; Nyāya debaters",
  summary: "Disagreement tests who you are. The Mishnah judges a dispute by whether it is ‘for the sake of Heaven’, and Socratic examination is examination of a life. The worth of the exchange lies in the disputants’ intention and virtue more than in its outcome.",
  implies: "Purify motive; judge disputes by their spirit.",
  cite: [["mishnah", "Avot 5:17"], ["plato", "Laches 187e–188a"]] },

{ id: "polarization", name: "Affective polarisation", domain: "relational", date: 2012, when: "Iyengar et al. 2012; bridging systems 2015–",
  who: "Shanto Iyengar; platform designers",
  summary: "Partisans increasingly dislike and distrust each other, often more than their policy differences warrant. Disagreement becomes a sorting of social identity, amplified by engagement-ranked media. The measurable object is not belief distance but cross-group affect.",
  implies: "Bridging ranking; cross-cutting contact; de-sorting.",
  cite: [["iyengar2012"], ["ovadya2023"]] },

// ───────────────────────────── Sacred & contemplative ─────────────────────────────
{ id: "attachment", name: "Attachment to views", domain: "contemplative", date: -400, when: "Aṭṭhakavagga; Nāgārjuna; Sextus",
  who: "The Buddha (Sn 4); Nāgārjuna; Pyrrhonists",
  summary: "Suffering in dispute comes from grasping at views (diṭṭhi-upādāna), not from which view is right. Even right view held as a possession breeds conflict. The remedy is not a better position but release from positionality.",
  implies: "Non-dispute; emptiness of views; suspension.",
  cite: [["bodhi2017", "Sn 4.8–4.13"], ["westerhoff2010"], ["gomez1976"]] },

{ id: "shi_fei", name: "‘This’ and ‘that’", domain: "contemplative", date: -300, when: "Zhuangzi, ch. 2",
  who: "Zhuangzi",
  summary: "Every ‘this is so’ (shi) is made from a standpoint, and from the other side it is ‘that’ (bi). The Confucians and Mohists affirm what the other denies. The sage sees that ‘this’ and ‘that’ generate each other, and rests at the pivot from which both can be allowed.",
  implies: "Walking two roads; illumination.",
  cite: [["ziporyn2009", "ch. 2"]] },

{ id: "discernment", name: "Incomplete discernment", domain: "contemplative", date: 1656, when: "Quakers, 1650s–",
  who: "Society of Friends",
  summary: "Truth is one and is discerned together. Persisting disagreement means the gathered meeting has not yet waited long enough for the Light. A lone objector may be right, which is why a block is honoured.",
  implies: "Wait in silence; seek unity, not majority.",
  cite: [["sheeran1983"]] },

{ id: "divine_plurality", name: "Plurality willed from above", domain: "contemplative", date: 200, when: "Eruvin 13b; Talmud",
  who: "The Rabbis",
  summary: "‘These and these are the words of the living God.’ Contradictory rulings can both belong to revelation. Halakhic decision is necessary for practice, but the rejected opinion stays Torah, is studied, and may be revived. Disagreement is part of how revelation unfolds.",
  implies: "Record minority views; decide without declaring falsehood.",
  cite: [["bavli", "Eruvin 13b"], ["halbertal1997"], ["hidary2010"]] },

{ id: "ikhtilaf", name: "Disagreement as mercy", domain: "contemplative", date: 800, when: "classical fiqh, 8th c. onward",
  who: "Sunni jurists; Ibn Rushd",
  summary: "Diverse rulings reached by sincere ijtihād are each rewarded, even when mistaken. A saying attributed to the Prophet, ‘the disagreement of my community is a mercy’, is of weak attestation but culturally powerful. The schools’ plurality was understood as latitude for believers, not as scandal.",
  implies: "Tolerate madhhab difference; study khilāf.",
  cite: [["bukhari", "7352"], ["kamali2003"], ["ibnrushd"]] },

// ───────────────────────────── Generative ─────────────────────────────
{ id: "dialectical", name: "Strife as engine", domain: "generative", date: -500, when: "Heraclitus c. 500 BCE; Hegel 1807; Marx",
  who: "Heraclitus; Hegel; Marx",
  summary: "‘War is father of all and king of all.’ ‘Justice is strife.’ Opposition is the motor of becoming. Hegel makes contradiction the self-movement of the concept, and Marx locates it in material relations. Disagreement is how history and thought advance.",
  implies: "Sharpen, then sublate, the contradiction.",
  cite: [["heraclitus", "DK B53, B80"], ["hegel1807"]] },

{ id: "collision", name: "Collision with error", domain: "generative", date: 1644, when: "Milton 1644; Mill 1859",
  who: "John Milton; J. S. Mill",
  summary: "Truth unchallenged becomes dead dogma. Even a false dissent is useful, because it forces truth to be re-earned and therefore understood. Disagreement is the immune system of belief.",
  implies: "Free discussion; devil’s advocacy; protect dissent.",
  cite: [["milton1644"], ["mill1859", "ch. 2"]] },

{ id: "sociation", name: "Conflict as sociation", domain: "generative", date: 1908, when: "Simmel 1908; Coser 1956",
  who: "Georg Simmel; Lewis Coser",
  summary: "Conflict is a form of social relation, not its absence. It binds the antagonists, clarifies boundaries, and creates group cohesion. Cross-cutting conflicts can stitch a society together. A society without conflict would be a society without contact.",
  implies: "Institutionalise, don’t suppress; foster cross-cutting cleavages.",
  cite: [["simmel1908"], ["coser1956"]] },

{ id: "constructive", name: "Constructive difference", domain: "generative", date: 1925, when: "Follett 1925",
  who: "Mary Parker Follett",
  summary: "Follett asks us to think of conflict as friction in an engine. It is neither good nor bad in itself; it is the appearance of difference, and difference is the raw material of invention. Integration produces something new that neither party brought.",
  implies: "Integration over compromise.",
  cite: [["follett1925"]] }
];
