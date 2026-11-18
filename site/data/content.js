/* Primary-text excerpts, reading paths, the gap gallery, and the worked example. */
var HOD = window.HOD = window.HOD || {};

/* Short excerpts. `tr` names the translation; public-domain translations are preferred. */
HOD.excerpts = [
  { id: "x-heraclitus", entry: "dialectical", who: "Heraclitus", src: "fr. DK B53", tr: "trans. after Kahn 1979",
    text: "War is father of all and king of all; and some he has shown as gods, others men; some he has made slaves, others free." },
  { id: "x-euthyphro", entry: "unmeasurable", who: "Plato", src: "Euthyphro 7b–c", tr: "trans. Benjamin Jowett (1892)",
    text: "And what sort of difference creates enmity and anger? Suppose for example that you and I, my good friend, differ about a number; do differences of this sort make us enemies and set us at variance with one another? Do we not go at once to arithmetic, and put an end to them by a sum?" },
  { id: "x-gorgias", entry: "elenchus", who: "Plato", src: "Gorgias 458a", tr: "trans. Benjamin Jowett (1892)",
    text: "I am one of those who are very willing to be refuted if I say anything which is not true, and very willing to refute any one else who says what is not true, and quite as ready to be refuted as to refute; for I hold that this is the greater gain of the two." },
  { id: "x-topics", entry: "aristotelian_dialectic", who: "Aristotle", src: "Topics I.1, 100a18–21", tr: "trans. W. A. Pickard-Cambridge (1928)",
    text: "Our treatise proposes to find a line of inquiry whereby we shall be able to reason from opinions that are generally accepted about every problem propounded to us, and also shall ourselves, when standing up to an argument, avoid saying anything that will obstruct us." },
  { id: "x-sextus", entry: "pyrrhonian", who: "Sextus Empiricus", src: "Outlines of Pyrrhonism 1.8", tr: "trans. Annas & Barnes (2000)",
    text: "Scepticism is an ability to set out oppositions among things which appear and are thought of in any way at all." },
  { id: "x-analects", entry: "zhengming", who: "Confucius", src: "Analects 13.3", tr: "trans. James Legge (1861)",
    text: "If names be not correct, language is not in accordance with the truth of things. If language be not in accordance with the truth of things, affairs cannot be carried on to success." },
  { id: "x-avot", entry: "machloket", who: "Mishnah", src: "Avot 5:17", tr: "translation adapted from Sefaria",
    text: "Every dispute that is for the sake of Heaven will in the end endure; and one that is not for the sake of Heaven will not in the end endure. Which is a dispute for the sake of Heaven? The dispute of Hillel and Shammai. And which is not for the sake of Heaven? The dispute of Korah and all his company." },
  { id: "x-eruvin", entry: "divine_plurality", who: "Babylonian Talmud", src: "Eruvin 13b", tr: "translation adapted from Sefaria",
    text: "For three years Beit Shammai and Beit Hillel disagreed. … A Divine Voice emerged and proclaimed: Both these and those are the words of the living God. However, the halakha follows Beit Hillel." },
  { id: "x-nagarjuna", entry: "prasanga", who: "Nāgārjuna", src: "Vigrahavyāvartanī 29", tr: "trans. Westerhoff (2010)",
    text: "If I had any thesis, that fault would apply to me. But I do not have any thesis." },
  { id: "x-hobbes", entry: "arbitration", who: "Thomas Hobbes", src: "Leviathan ch. 5 (1651)", tr: "original English",
    text: "And therefore, as when there is a controversy in an account, the parties must by their own accord set up for right reason the reason of some arbitrator, or judge, to whose sentence they will both stand, or their controversy must either come to blows, or be undecided, for want of a right reason constituted by Nature." },
  { id: "x-milton", entry: "free_discussion", who: "John Milton", src: "Areopagitica (1644)", tr: "original English",
    text: "And though all the winds of doctrine were let loose to play upon the earth, so Truth be in the field, we do injuriously by licensing and prohibiting to misdoubt her strength. Let her and Falsehood grapple; who ever knew Truth put to the worse, in a free and open encounter?" },
  { id: "x-leibniz", entry: "calculemus", who: "G. W. Leibniz", src: "The Art of Discovery (1685)", tr: "trans. Wiener (1951)",
    text: "The only way to rectify our reasonings is to make them as tangible as those of the Mathematicians, so that we can find our error at a glance, and when there are disputes among persons, we can simply say: Let us calculate, without further ado, to see who is right." },
  { id: "x-hume", entry: "faction", who: "David Hume", src: "“Of Parties in General” (1741)", tr: "original English",
    text: "Real factions may be divided into those from interest, from principle, and from affection." },
  { id: "x-madison", entry: "faction", who: "James Madison", src: "Federalist No. 10 (1787)", tr: "original English",
    text: "The latent causes of faction are thus sown in the nature of man. … But the most common and durable source of factions has been the various and unequal distribution of property." },
  { id: "x-mill", entry: "free_discussion", who: "John Stuart Mill", src: "On Liberty, ch. 2 (1859)", tr: "original English",
    text: "He who knows only his own side of the case, knows little of that. His reasons may be good, and no one may have been able to refute them. But if he is equally unable to refute the reasons on the opposite side; if he does not so much as know what they are, he has no ground for preferring either opinion." },
  { id: "x-marx", entry: "class", who: "Marx & Engels", src: "Manifesto of the Communist Party (1848)", tr: "trans. Samuel Moore (1888)",
    text: "The history of all hitherto existing society is the history of class struggles." },
  { id: "x-peirce", entry: "peirce", who: "C. S. Peirce", src: "“The Fixation of Belief” (1877)", tr: "original English",
    text: "To satisfy our doubts, therefore, it is necessary that a method should be found by which our beliefs may be determined by nothing human, but by some external permanency—by something upon which our thinking has no effect." },
  { id: "x-wittgenstein", entry: "hinges", who: "Ludwig Wittgenstein", src: "On Certainty §§611–612", tr: "trans. Paul & Anscombe (1969)",
    text: "Where two principles really do meet which cannot be reconciled with one another, then each man declares the other a fool and heretic. I said I would ‘combat’ the other man,—but wouldn’t I give him reasons? Certainly; but how far do they go? At the end of reasons comes persuasion." },
  { id: "x-rogers", entry: "rogerian", who: "Carl Rogers", src: "“Communication: Its Blocking and Its Facilitation” (1951)", tr: "original English",
    text: "Each person can speak up for himself only after he has first restated the ideas and feelings of the previous speaker accurately, and to that speaker’s satisfaction." },
  { id: "x-follett", entry: "follett", who: "Mary Parker Follett", src: "“Constructive Conflict” (1925)", tr: "original English",
    text: "As conflict—difference—is here in the world, as we cannot avoid it, we should, I think, use it." }
];

/* Reading paths: guided tours through the entries. */
HOD.paths = [
  { id: "dialectic", name: "Dialectic from Plato to Hegel and after", blurb: "How question-and-answer became a discipline, a game, a logic and a philosophy of history.",
    steps: ["elenchus", "platonic_dialectic", "aristotelian_dialectic", "munazara", "disputatio", "obligationes", "hegel", "formal_dialectic", "pragma"] },
  { id: "therapeutic", name: "The therapeutic turn", blurb: "How twentieth-century methods moved disagreement out of belief and into the psyche and the relationship.",
    steps: ["rogerian", "threat", "rapoport", "nvc", "needs", "problem_solving", "relationship_level", "difficult", "deep_canvass"] },
  { id: "refusing", name: "Refusing the fight", blurb: "Traditions that treat taking a position as the problem.",
    steps: ["atthaka", "attachment", "pyrrhonian", "prasanga", "liangxing", "shi_fei", "bohm"] },
  { id: "minority", name: "Keeping the minority", blurb: "Practices that decide without declaring the loser false.",
    steps: ["machloket", "divine_plurality", "khilaf", "ikhtilaf", "syadvada", "quaker", "agonism"] },
  { id: "computation", name: "Disagreement as computation", blurb: "From Leibniz’s ‘Calculemus!’ to bridging algorithms.",
    steps: ["calculemus", "calculation", "peirce", "priors", "adv_collab", "itt", "double_crux", "polis", "ai_mediated"] },
  { id: "power", name: "Power and the forum", blurb: "Who decides, and what happens to disagreement under a sovereign.",
    steps: ["staged", "arbitration", "sovereign", "parliament", "adversarial", "friend_enemy", "powerknow", "hegemony", "agonism"] },
  { id: "words", name: "Words, not things", blurb: "When the dispute is about language, and when it only seems to be.",
    steps: ["stasis", "zhengming", "bian", "equivocation", "attitude", "metaling", "hinges", "vocabularies", "differend"] }
];

/* Gap gallery: the views no method presupposes, with a sketch of what a method might look like. */
HOD.gaps = {
  peer: { method: "Calibration rounds", sketch: ["Each party states a credence, not a verdict", "Each estimates the other’s track record on similar questions", "Both update by an agreed rule (equal weight, or weighted by record)", "Record the result and score it later"], why: "The epistemology of peer disagreement says what one should do on learning of disagreement, but no conversational method enacts it." },
  paradigm: { method: "Exemplar exchange", sketch: ["Each side presents a solved problem it regards as a model of good work", "Each tries to solve the other’s exemplar in its own terms", "Map where the attempt breaks down", "Treat the break as the boundary of translation, not as the opponent’s error"], why: "Kuhn says persuasion across paradigms works through exemplars and conversion. No method trains people in it." },
  attitude: { method: "Belief/attitude sorting", sketch: ["List every claim in the dispute", "Mark each as belief (how things are) or attitude (what to favour)", "Settle the belief claims by evidence", "Negotiate or vote on the attitude claims, openly as such"], why: "Stevenson’s distinction is widely cited but rarely used as a procedure." },
  metaling: { method: "Usage negotiation", sketch: ["Identify the contested word", "Ask what follows practically from each usage", "Choose the usage whose consequences both can live with, or coin a new term"], why: "Conceptual engineering is a research programme but not yet a conversational method." },
  vocabularies: { method: "Redescription swap", sketch: ["Each describes a shared event in their own final vocabulary", "Each re-describes it in the other’s", "Notice which words resist translation", "Keep talking; aim for a third vocabulary, not a verdict"], why: "Rorty’s ironist redescribes, but he never wrote it down as a method for two people." },
  differend: { method: "Witnessing circle", sketch: ["Suspend the forum’s rules of evidence", "Let the party who cannot state their wrong in the forum’s idiom try other idioms (story, image, silence)", "Record what could not be said", "Ask what idiom would be needed to judge it"], why: "Lyotard’s remedy is to bear witness and to seek new idioms. Truth commissions came closest, but no general method exists." },
  sacred: { method: "Symbolic-concession mapping", sketch: ["Ask each side what may never be traded", "Ask what gesture, such as apology, acknowledgement or ritual, would honour it", "Exchange gestures before discussing material terms"], why: "Atran and Axelrod show that symbolic concessions move sacred-value conflicts. They report cases and offer no protocol." },
  class: { method: "Interest audit", sketch: ["For each position, ask who gains materially if it prevails", "Make the gains visible to both sides", "Separate the material question from the ideological one and bargain over the first"], why: "Ideology critique analyses a conflict from outside. It gives the parties no way to talk it through." },
  small_diff: { method: "Distance check", sketch: ["Each side lists what it shares with the other", "Compare that list to what separates them", "Ask what the dispute does for each group’s cohesion"], why: "Freud diagnosed the pattern but proposed no talking cure for groups." },
  mimetic: { method: "Model naming", sketch: ["Name the object both parties want", "Ask whose desire each is imitating", "Name any third party being blamed by both", "Refuse the scapegoat explicitly"], why: "Girard’s theory implies renunciation of rivalry, but no method lets two rivals do it together." },
  argumentative: { method: "Engineered group reasoning", sketch: ["Assemble a group whose members disagree", "Each produces arguments; each evaluates the others’", "Pool the evaluations, not the productions"], why: "Mercier and Sperber show groups reason well under these conditions. The conditions are known; a named method is not." },
  developmental: { method: "Subject–object interview for two", sketch: ["Each asks the other what they could not bear to be wrong about", "Each identifies the system they are defending", "Each tries to hold that system as an object for a while"], why: "Kegan’s developmental account explains why some conflicts cannot be resolved at a given order of mind, but it offers no method for two people at different orders." },
  sociation: { method: "Cross-cutting design", sketch: ["Map the cleavages that divide a group", "Deliberately build teams across them", "Let conflict on one axis bind people allied on another"], why: "Simmel and Coser describe how conflicts that cut across one another hold a society together. Their account is about institutional design and offers no method for conversation." }
};

/* Worked example: one dispute through five methods. */
HOD.example = {
  title: "The house in the will",
  case: "Three siblings inherit their mother’s house in equal shares. Ana, who lives abroad and has debts, wants to sell and split the money. Ben wants to keep it as a family home for holidays and for his children. Cleo nursed their mother through her last two years in that house. She says their mother promised it to her, though the will does not say so. Every conversation ends in shouting.",
  runs: [
    { m: "stasis", sees: "Four questions are tangled together. Fact: did the mother make a promise? Definition: is a spoken promise a ‘bequest’? Quality: does Cleo’s care create a claim in fairness? Jurisdiction: is this for the siblings, a court or the executor to decide? Ana argues jurisdiction (the will), Cleo argues quality (fairness), and Ben argues none of these. He is arguing about what the house is worth to the family.", misses: "It locates the issue but has nothing to say about the grief and rivalry driving the shouting." },
    { m: "elenchus", sees: "Each sibling holds beliefs that conflict with one another. Ana says she respects their mother’s wishes and that only the will counts. Cleo says the house should go to whoever cared most, yet she would not accept that rule for the mother’s jewellery. Questioning exposes these inconsistencies.", misses: "Exposed inconsistency humiliates, and humiliation hardens positions in a family." },
    { m: "principled", sees: "The positions (sell, keep, give to Cleo) hide interests. Ana needs cash, Ben wants continuity for his children, and Cleo wants recognition of her care. Options: Ben and Cleo buy out Ana’s share; the house is let and the rent shared; Cleo receives a larger share as recognition. Objective criteria: a valuation, and the legal default.", misses: "It treats recognition as one more interest to trade, when for Cleo being paid for her care may feel like an insult." },
    { m: "nvc", sees: "Behind the accusations (‘you abandoned Mum’, ‘you’re after the house’) are needs: Cleo’s for acknowledgement, Ana’s for security, Ben’s for belonging. Once named, the needs do not conflict. The strategies do.", misses: "Naming needs does not change the arithmetic. The house still cannot be both sold and kept." },
    { m: "double_crux", sees: "Ana believes the house will lose value and the money is needed now. Ben believes it will appreciate and the family will use it. Their shared crux is an empirical question about value and use, which a valuation and a frank look at how often anyone actually visits can test.", misses: "There is no crux for Cleo’s claim, because it is a demand for recognition and makes no claim about the world." }
  ],
  moral: "Each method sees a real part of the dispute, and each misses what the others see. Stasis theory sorts the questions. The elenchus exposes inconsistency. Principled negotiation finds the deal. NVC finds the people. Double crux finds the testable part. The dispute is about several things at once, so any single method will leave someone unheard. This is the practical case for the diagnostic and the mismatch finder."
};
