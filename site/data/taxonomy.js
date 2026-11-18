/* The two classifying axes.
   Methods are sorted by TELOS (what a disputation is for) and by FAMILY (whose lineage it belongs to).
   Views are sorted by DOMAIN (where the disagreement is said to live).
   The ORDER of teloi and of domains is chosen to minimise thread crossings in the two-column
   diagram (found by exhaustive search over group orders), with one constraint: the generative
   domain stays last, because it alone denies that disagreement is a trouble. The order carries no ranking. */
var HOD = window.HOD = window.HOD || {};

/* Side order of the two-column diagram. true = views on the left, methods on the right; false = the reverse.
   This one line sets the default everywhere; the diagram's "Swap sides" button flips it for a visit. */
HOD.viewsLeft = false;

HOD.teloi = [
  { id: "truth",       name: "Truth",        gloss: "The parties treat disagreement as a sign that someone is wrong. They talk to remove the error, and winning is incidental." },
  { id: "formation",   name: "Formation",    gloss: "Disputation is a gymnasium. Its product is a trained disputant, and the question may stay open." },
  { id: "victory",     name: "Victory",      gloss: "The exchange is a contest. Its product is a winner, a reputation, or an audience persuaded." },
  { id: "plurality",   name: "Plurality",    gloss: "The parties keep the disagreement on record and honour it. Ending it would be a loss." },
  { id: "decision",    name: "Decision",     gloss: "A group must act. It turns disagreement into a binding choice and leaves the disagreement in place." },
  { id: "settlement",  name: "Settlement",   gloss: "Parties want different things; the exchange seeks terms both can accept." },
  { id: "understanding", name: "Understanding", gloss: "Each party tries to understand the other accurately and to repair the relationship. Agreement is optional." },
  { id: "release",     name: "Release",      gloss: "The parties seek freedom from the grip of positions, through suspension of judgment, emptiness, or the hinge of the Way." }
];

HOD.families = [
  { id: "greek",     name: "Greek & Roman" },
  { id: "indic",     name: "South Asian" },
  { id: "sinitic",   name: "Chinese" },
  { id: "jewish",    name: "Rabbinic" },
  { id: "islamic",   name: "Islamic" },
  { id: "latin",     name: "Latin scholastic" },
  { id: "civic",     name: "Early-modern civic & scientific" },
  { id: "forum",     name: "Parliament, court & debate hall" },
  { id: "spirit",    name: "Communal discernment" },
  { id: "negotiation", name: "Negotiation, mediation & peacemaking" },
  { id: "dialogic",  name: "Therapeutic & dialogic" },
  { id: "argument",  name: "Argumentation theory" },
  { id: "deliberative", name: "Deliberative democracy & platforms" },
  { id: "rationalist", name: "Rationalist & experimental" }
];

HOD.domains = [
  { id: "epistemic",  name: "Epistemic",     gloss: "It is really about what is true: evidence, inference, priors, perspective." },
  { id: "linguistic", name: "Linguistic",    gloss: "It is really about words: names, equivocation, attitudes dressed as beliefs, idioms with no common measure." },
  { id: "power",      name: "Power",         gloss: "It is really about who rules: domination, hegemony, sovereignty, the friend and the enemy." },
  { id: "axiological", name: "Axiological",  gloss: "It is really about values: rival goods, sacred commitments, incommensurable gods." },
  { id: "interest",   name: "Interest",      gloss: "It is really about what people want: stakes, resources, bargaining positions." },
  { id: "relational", name: "Relational",    gloss: "It is really about us: identity, recognition, the relationship-level message beneath the content." },
  { id: "psyche",     name: "Psyche",        gloss: "It is really about what is happening inside: needs, fear, vanity, envy, motivated cognition, developmental form." },
  { id: "contemplative", name: "Contemplative", gloss: "It is really about attachment: clinging to views, a self that needs to be right, partial sight of a whole." },
  { id: "generative", name: "Generative",    gloss: "It is no problem at all. Disagreement drives the growth of truth, history, social life or law." }
];
