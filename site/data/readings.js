/* Named readings for the most contested entries (about thirty).
   Each claim carries a status:
     attested  = stated in the primary source (locus given)
     consensus = broadly agreed by specialists (a representative work given)
     reading   = one named scholar's interpretation, which others dispute
     site      = this site's own judgment */
var HOD = window.HOD = window.HOD || {};
HOD.readings = {
  antilogic: [
    { claim: "Protagoras said that on every matter there are two logoi opposed to each other.", status: "attested", by: "Diogenes Laertius 9.51" },
    { claim: "Antilogic follows from the homo-mensura doctrine.", status: "reading", by: "G. B. Kerferd, The Sophistic Movement (1981), ch. 6" }
  ],
  elenchus: [
    { claim: "Socrates says he would rather be refuted than refute.", status: "attested", by: "Plato, Gorgias 458a" },
    { claim: "The elenchus can establish positive moral truths.", status: "reading", by: "Gregory Vlastos, ‘The Socratic Elenchus’ (1983); Hugh Benson, Socratic Wisdom (2000), argues that it only exposes inconsistency" },
    { claim: "Pairing the elenchus first with inconsistency and aporia follows Benson’s reading.", status: "site" }
  ],
  pyrrhonian: [
    { claim: "Scepticism is an ability to set out oppositions among appearances and thoughts.", status: "attested", by: "Sextus Empiricus, Outlines of Pyrrhonism 1.8" },
    { claim: "Pyrrho himself held a different, metaphysical doctrine, and Sextus’ scepticism owes him little beyond the name.", status: "reading", by: "Richard Bett, Pyrrho, His Antecedents, and His Legacy (2000)" }
  ],
  atthaka: [
    { claim: "The Aṭṭhakavagga belongs to the oldest stratum of the Pāli canon.", status: "consensus", by: "K. R. Norman, Pāli Literature (1983)" },
    { claim: "It preserves an anti-doctrinal strand that Madhyamaka later developed.", status: "reading", by: "Luis O. Gómez, ‘Proto-Mādhyamika in the Pāli Canon’, Philosophy East and West 26 (1976)" }
  ],
  kathavatthu: [
    { claim: "Tradition assigns the text to Moggaliputta Tissa’s council under Aśoka; specialists treat much of it as later accretion.", status: "consensus", by: "K. R. Norman, Pāli Literature (1983)" },
    { claim: "Its procedure is structurally close to the Socratic elenchus.", status: "site" }
  ],
  vada: [
    { claim: "Vāda is defined as debate that uses the means of knowledge and the five-membered syllogism.", status: "attested", by: "Nyāya-sūtra 1.2.1" },
    { claim: "The sūtra text took shape over several centuries, between about the 2nd c. BCE and the 2nd c. CE.", status: "consensus", by: "Matthew Dasti and Stephen Phillips, The Nyāya-sūtra: Selections (2017), introduction" }
  ],
  jalpa: [
    { claim: "Jalpa and vitaṇḍā protect truth as a hedge of thorns protects a seedling.", status: "attested", by: "Nyāya-sūtra 4.2.50" }
  ],
  prasanga: [
    { claim: "‘If I had any thesis, that fault would apply to me.’", status: "attested", by: "Nāgārjuna, Vigrahavyāvartanī 29" },
    { claim: "Nāgārjuna rejects only theses that ascribe intrinsic nature (svabhāva), and not every assertion.", status: "reading", by: "Jan Westerhoff, Nāgārjuna’s Madhyamaka (2009), ch. 9" }
  ],
  syadvada: [
    { claim: "The sevenfold scheme indexes each predication to a standpoint and contains no true contradiction.", status: "reading", by: "Jonardon Ganeri, ‘Jaina Logic and the Philosophical Basis of Pluralism’ (2002); Graham Priest, ‘Jaina Logic: A Contemporary Perspective’ (2008), reads it as paraconsistent" }
  ],
  liangxing: [
    { claim: "Only the Inner Chapters (1–7) are usually ascribed to Zhuangzi himself.", status: "consensus", by: "A. C. Graham, Chuang-tzŭ: The Inner Chapters (1981)" },
    { claim: "Zhuangzi is a perspectival relativist about shì and fēi.", status: "reading", by: "Chad Hansen, A Daoist Theory of Chinese Thought (1992); Graham (1981) stresses spontaneous response more than relativism" }
  ],
  saltiron: [
    { claim: "Huan Kuan compiled the record decades after the debate of 81 BCE and favoured the literati.", status: "reading", by: "Michael Loewe, Crisis and Conflict in Han China (1974), ch. 3" }
  ],
  machloket: [
    { claim: "A heavenly voice declares ‘these and these are the words of the living God’, and the law follows Hillel.", status: "attested", by: "Babylonian Talmud, Eruvin 13b" }
  ],
  munazara: [
    { claim: "The majlis of 932 between al-Sīrāfī and Abū Bishr Mattā is known from al-Tawḥīdī’s later account.", status: "attested", by: "Abū Ḥayyān al-Tawḥīdī, al-Imtāʿ wa-l-muʾānasa, night 8; trans. D. S. Margoliouth, JRAS (1905)" }
  ],
  khilaf: [
    { claim: "A judge who strives and is right earns two rewards; one who strives and errs earns one.", status: "attested", by: "Ṣaḥīḥ al-Bukhārī 7352" },
    { claim: "The khilāf genre anticipates Rawls’s burdens of judgment.", status: "site" }
  ],
  staged: [
    { claim: "Nahmanides’ Hebrew account and the Latin protocol of Barcelona (1263) each claim the debate went their way.", status: "consensus", by: "Robert Chazan, Barcelona and Beyond (1992)" }
  ],
  experimental: [
    { claim: "The experimental matter of fact was a political technology for making dispute safe after the civil wars.", status: "reading", by: "Steven Shapin and Simon Schaffer, Leviathan and the Air-Pump (1985)" }
  ],
  coffeehouse: [
    { claim: "In the bourgeois public sphere, status was bracketed and only the argument counted.", status: "reading", by: "Jürgen Habermas, The Structural Transformation of the Public Sphere (1962)" },
    { claim: "That sphere rested on the exclusion of women and workers, who formed counter-publics.", status: "reading", by: "Nancy Fraser, ‘Rethinking the Public Sphere’ (1990)" },
    { claim: "Actual coffeehouse talk was less open and less rational than Habermas’s ideal.", status: "reading", by: "Brian Cowan, The Social Life of Coffee (2005)" }
  ],
  adversarial: [
    { claim: "Defence counsel entered English felony trials only in the 1730s.", status: "reading", by: "John H. Langbein, The Origins of Adversary Criminal Trial (2003)" }
  ],
  debate: [
    { claim: "Ticketed London debating societies flourished in the 1770s–90s.", status: "reading", by: "Donna T. Andrew, London Debating Societies, 1776–1799 (1994)" }
  ],
  quaker: [
    { claim: "Secular consensus process in 1960s movements drew on Quaker practice.", status: "reading", by: "Francesca Polletta, Freedom Is an Endless Meeting (2002)" }
  ],
  palaver: [
    { claim: "Asante council politics worked by consensus, and this could ground a non-party polity.", status: "reading", by: "Kwasi Wiredu, Cultural Universals and Particulars (1996)" },
    { claim: "This idealises pre-colonial practice and lends cover to one-party rule.", status: "reading", by: "Emmanuel Chukwudi Eze, ‘Democracy or Consensus? A Response to Wiredu’ (1997)" }
  ],
  hegel: [
    { claim: "‘Thesis–antithesis–synthesis’ is not Hegel’s formula.", status: "reading", by: "Gustav E. Mueller, ‘The Hegel Legend of “Thesis-Antithesis-Synthesis”’, Journal of the History of Ideas 19 (1958)" }
  ],
  follett: [
    { claim: "Getting to Yes restates Follett’s integration with new cases.", status: "site" }
  ],
  deep_canvass: [
    { claim: "A ten-minute conversation durably reduced transphobia in a field experiment.", status: "reading", by: "David Broockman and Joshua Kalla, Science 352 (2016)" },
    { claim: "The earlier study by LaCour and Green (2014) was retracted in 2015.", status: "attested", by: "Science, retraction notice, 28 May 2015" }
  ],
  obligationes: [
    { claim: "Obligational disputation is a logical game of consistency maintenance.", status: "reading", by: "Catarina Dutilh Novaes, ‘Medieval Obligationes as Logical Games of Consistency Maintenance’, Synthese 145 (2005)" }
  ],
  /* views */
  perspectival: [
    { claim: "The parable of the blind men and the elephant appears in the Pāli canon.", status: "attested", by: "Udāna 6.4" },
    { claim: "Grouping Mill and Nietzsche with Jain many-sidedness is this site’s choice.", status: "site" }
  ],
  dialectical: [
    { claim: "‘War is father of all’ and ‘justice is strife’.", status: "attested", by: "Heraclitus, DK B53 and B80" },
    { claim: "The wording and order of the fragments are reconstructions.", status: "consensus", by: "Charles H. Kahn, The Art and Thought of Heraclitus (1979)" }
  ],
  attachment: [
    { claim: "Suffering in dispute comes from grasping at views.", status: "attested", by: "Sutta Nipāta, Aṭṭhakavagga (Sn 4.3–4.13)" },
    { claim: "This is an early form of the Madhyamaka stance.", status: "reading", by: "Gómez (1976)" }
  ],
  shi_fei: [
    { claim: "Every ‘this’ is someone else’s ‘that’.", status: "attested", by: "Zhuangzi, ch. 2 (Qiwulun)" },
    { claim: "Shì and fēi are indexical terms of approval and disapproval.", status: "reading", by: "Chad Hansen (1992); A. C. Graham (1981)" }
  ],
  ikhtilaf: [
    { claim: "‘The disagreement of my community is a mercy’ has no sound chain of transmission.", status: "consensus", by: "noted by Tāj al-Dīn al-Subkī (d. 1370) and later hadith critics" }
  ],
  divine_plurality: [
    { claim: "The minority view is recorded so that a later court may rely on it.", status: "attested", by: "Mishnah, Eduyot 1:5" }
  ],
  character: [
    { claim: "Grouping the Mishnah’s ‘for the sake of Heaven’ with Socratic examination of a life is this site’s reading.", status: "site" }
  ],
  priors: [
    { claim: "Agents with common priors cannot agree to disagree.", status: "attested", by: "Robert Aumann, ‘Agreeing to Disagree’, Annals of Statistics 4 (1976)" },
    { claim: "Most actual disagreements are therefore not honest.", status: "reading", by: "Tyler Cowen and Robin Hanson, ‘Are Disagreements Honest?’ (2004)" }
  ],
  error: [
    { claim: "Calling this the default account of disagreement is this site’s judgment.", status: "site" }
  ]
};
