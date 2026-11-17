/* The two classifying axes.
   Methods are sorted by TELOS (what a disputation is for) and by FAMILY (whose lineage it belongs to).
   Views are sorted by DOMAIN (where the disagreement is said to live). */
var HOD = window.HOD = window.HOD || {};

HOD.teloi = [
  { id: "truth",       name: "Truth",        gloss: "Disagreement is a symptom of error; the exchange exists to remove it. Winning is incidental." },
  { id: "victory",     name: "Victory",      gloss: "The exchange is a contest. Its product is a winner, a reputation, or an audience persuaded." },
  { id: "formation",   name: "Formation",    gloss: "Disputation as gymnasium: the point is the trained disputant, not the settled question." },
  { id: "decision",    name: "Decision",     gloss: "A collective must act; disagreement is processed into a binding choice without being dissolved." },
  { id: "settlement",  name: "Settlement",   gloss: "Parties want different things; the exchange seeks terms both can accept." },
  { id: "understanding", name: "Understanding", gloss: "The exchange aims at accurate mutual comprehension and repaired relation; agreement is optional." },
  { id: "plurality",   name: "Plurality",    gloss: "Disagreement is to be preserved, recorded and honoured; closure is a loss." },
  { id: "release",     name: "Release",      gloss: "The goal is to be freed from the grip of positions: suspension, emptiness, the hinge of the Way." }
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
  { id: "axiological", name: "Axiological",  gloss: "It is really about values: rival goods, sacred commitments, incommensurable gods." },
  { id: "interest",   name: "Interest",      gloss: "It is really about what people want: stakes, resources, bargaining positions." },
  { id: "power",      name: "Power",         gloss: "It is really about who rules: domination, hegemony, sovereignty, the friend and the enemy." },
  { id: "psyche",     name: "Psyche",        gloss: "It is really about what is happening inside: needs, fear, vanity, envy, motivated cognition, developmental form." },
  { id: "relational", name: "Relational",    gloss: "It is really about us: identity, recognition, the relationship-level message beneath the content." },
  { id: "contemplative", name: "Contemplative", gloss: "It is really about attachment: clinging to views, a self that needs to be right, partial sight of a whole." },
  { id: "generative", name: "Generative",    gloss: "It is not a problem at all: disagreement is the engine of truth, history, sociation or law." }
];
