'use strict';
(() => {

/* ================================================================
   DATA — word pools
   ================================================================ */

// ~top 200 english words
const WORDS_COMMON = ('the be to of and a in that have i it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us is was are been has had were said did may should very much before too through where after right think also' +
  ' still such here between both under never world hand life eyes down while might great old off same tell being does set three state high every last another seems came against small found men long place');
// clean split + dedupe
const COMMON = [...new Set(WORDS_COMMON.split(/\s+/).filter(Boolean))];

// extension to roughly the top 1000; standard = common + this
const WORDS_EXT = ('become leave put mean keep let begin seem help talk turn start show hear play run move live believe hold bring happen write provide sit stand lose pay meet include continue learn change lead understand watch follow stop create speak read allow add spend grow open walk win offer remember love consider appear buy wait serve send expect build stay fall cut reach remain suggest raise pass sell require report decide pull return explain hope develop carry break receive agree support hit produce eat cover catch draw choose cause point listen realize wonder join wish share save drop push visit finish drive rise sleep laugh throw enjoy plan count teach reduce answer improve check accept prepare occur exist argue prove wear form base apply seek fill act relate contain fit study manage protect note claim treat handle guess repeat forget deliver deny obtain publish assume maintain reflect intend impose measure prefer arrive rely afford earn depend achieve invite settle react remove attend belong compare complain describe design destroy determine engage establish examine expand explore express extend focus gain generate identify ignore imagine increase indicate influence inform insist introduce involve lack lay lift limit link locate marry match matter mention mind miss notice observe order own participate perform permit persuade pick point pour predict present preserve press pretend prevent print promise propose provide publish pursue quote raise range reach realize recall recognize recommend record recover refer refuse regard release remind repeat replace represent request respond restore result retain reveal review reward roll rush satisfy secure select separate settle shake shift shine shoot shout sign signal solve sort sound specify spread spring stare state stick stress stretch strike struggle submit succeed suffer supply suppose survive suspect sustain swim switch tend test threaten throw touch track trade train transfer transform travel trust vary vote warn wash wave weigh welcome whisper wind wrap' +
  ' person man woman child eye hand place case week company system program question government number night point home water room mother area money story fact month lot study book job word business issue side kind head house service friend father power hour game line end member law car city community name president team minute idea body information parent face level office door health art war history party result morning reason research girl guy moment air teacher force education foot boy age policy process music market sense nation plan college interest death experience effect street image phone data cost industry paper space ground event official matter center couple site project activity star table court oil situation cell price bed order value building action model season society tax director position player record paper piece land century card food top type wife rule tone bank farm crime stage class nature care field development role effort rate heart drug show leader light voice wind letter news test store sound size army bird attack size camera glass hair skin sport board fire fish sky sea river tree animal machine plant garden mountain village stone bridge road train station wall window floor roof kitchen chair picture clock watch shoe shirt pocket bottle box coin king queen soldier doctor nurse artist writer singer actor dream truth peace culture language science method theory detail scale item unit weight length height depth speed motion energy metal wood cloth wire tool engine wheel button screen device signal network code file page site link user search result system access memory' +
  ' little important different small large next early young few public bad same able best better sure free low late hard major strong possible whole real black white clear easy full special certain personal difficult available likely short single medical current wrong private past foreign fine common poor natural significant similar hot dead central happy serious ready simple left physical general blue dark various entire close legal religious cold final main green nice huge popular traditional cultural deep flat quick quiet rich safe sharp slow smooth soft warm wet wide wild bright broad busy calm cheap clean modern narrow proud raw rough smart tall thick thin tight tiny usual brave sweet bitter loud pale plain rare steep strict vast brief crazy eager exact fair fresh gentle grand harsh humble solid steady vague vivid worthy' +
  ' often however almost always sometimes together again away enough far instead maybe perhaps probably quickly slowly soon suddenly today tomorrow yesterday usually already especially exactly finally immediately nearly rarely recently simply truly twice above across ahead along among around behind below beneath beside beyond during except inside near outside since toward within without');
const STANDARD = [...new Set(COMMON.concat(WORDS_EXT.split(/\s+/).filter(Boolean)))];

const BRUTAL = ('labyrinthine sesquipedalian perspicacious obsequious grandiloquent circumlocution juxtaposition quintessential idiosyncrasy obfuscation antediluvian magnanimous surreptitious perfunctory ubiquitous cacophony ephemeral serendipity anachronism apocryphal byzantine capricious deleterious ebullient fastidious garrulous hegemony iconoclast insouciant intransigent lugubrious mellifluous nefarious ostentatious parsimonious penultimate pernicious pertinacious phlegmatic precocious promulgate quixotic recalcitrant sanctimonious soporific sycophant tantamount truculent unctuous vicissitude vituperative avuncular bellicose cantankerous demagogue equivocate flabbergasted gargantuan hapless ignominious juggernaut kaleidoscopic lackadaisical machination nomenclature onomatopoeia paradigmatic quintessence rambunctious schadenfreude tempestuous unprecedented verisimilitude wherewithal yesteryear zeitgeist bureaucracy connoisseur dilettante entrepreneur fluorescent gubernatorial hierarchical iridescent jurisprudence liaison millennium nauseous occurrence peripheral questionnaire renaissance silhouette threshold unnecessary maneuver mischievous rhythm asymptotic thermodynamic electromagnetic photosynthesis metamorphosis extraterrestrial incomprehensible compartmentalize interdisciplinary counterintuitive disproportionate misappropriation notwithstanding congratulations acknowledgment discombobulated perpendicular parliamentary auspicious clandestine convalescent effervescent exacerbate facetious gregarious harbinger immutable inexorable loquacious munificent obstreperous palimpsest quandary reticent salubrious taciturn umbrage vociferous winsome antithetical bombastic cognizant didactic esoteric fortuitous heuristic ineffable juxtapose kinetic luminous myriad nebulous ominous pragmatic quizzical resilient sonorous tenacious undulate vehement whimsical zealous').split(/\s+/).filter(Boolean);

const CODE_SNIPPETS = [
  'const x = arr.map(v => v * 2);',
  'if (a !== b) return null;',
  'for (let i = 0; i < n; i++) sum += i;',
  'const { id, name } = payload;',
  'async function load() { await fetch(url); }',
  'try { parse(input); } catch (err) { log(err); }',
  'items.filter(x => x.active).length',
  'return a ?? b ?? defaultValue;',
  'let total = prices.reduce((a, b) => a + b, 0);',
  'const ok = /^[a-z]+$/.test(word);',
  'obj[key] = value ?? fallback;',
  'while (stack.length) node = stack.pop();',
  'export default function App() {}',
  'map.set(key, (map.get(key) || 0) + 1);',
  'const [head, ...rest] = list;',
  'setTimeout(() => resolve(true), 100);',
  'if (!user?.profile?.email) throw new Error("bad");',
  'grid[y][x] = grid[x][y];',
  'console.log(`count: ${count}`);',
  'class Node { constructor(val) { this.val = val; } }',
  'return items.sort((a, b) => a.rank - b.rank);',
  'const cache = new Map();',
  "str.split(' ').reverse().join(' ')",
  'if (i % 2 === 0) evens.push(i);',
  "document.querySelector('#app')",
  'arr.slice(0, mid).concat(rest)',
  "x => x != null && x !== ''",
  'const sum = (...ns) => ns.reduce((a, n) => a + n, 0);',
];

const QUOTES = {
  short: [
    'brevity is the soul of wit.',
    'all that we see or seem is but a dream within a dream.',
    'the unexamined life is not worth living.',
    'fortune favors the bold.',
    'no man ever steps in the same river twice.',
    'we are all in the gutter, but some of us are looking at the stars.',
    'beware; for i am fearless, and therefore powerful.',
  ],
  medium: [
    'it is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
    'you have power over your mind, not outside events. realize this, and you will find strength.',
    'if you know the enemy and know yourself, you need not fear the result of a hundred battles.',
    'do i contradict myself? very well then i contradict myself, i am large, i contain multitudes.',
    "why, sometimes i've believed as many as six impossible things before breakfast.",
    'he who fights with monsters should look to it that he himself does not become a monster. and if you gaze long into an abyss, the abyss also gazes into you.',
    'there is nothing either good or bad, but thinking makes it so.',
  ],
  long: [
    'call me ishmael. some years ago, never mind how long precisely, having little or no money in my purse, and nothing particular to interest me on shore, i thought i would sail about a little and see the watery part of the world.',
    'it was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of light, it was the season of darkness.',
    'i went to the woods because i wished to live deliberately, to front only the essential facts of life, and see if i could not learn what it had to teach, and not, when i came to die, discover that i had not lived.',
    'we hold these truths to be self-evident, that all men are created equal, that they are endowed by their creator with certain unalienable rights, that among these are life, liberty and the pursuit of happiness.',
    'my name is ozymandias, king of kings; look on my works, ye mighty, and despair! nothing beside remains. round the decay of that colossal wreck, boundless and bare, the lone and level sands stretch far away.',
    "the artist is the creator of beautiful things. to reveal art and conceal the artist is art's aim. the critic is he who can translate into another manner or a new material his impression of beautiful things.",
  ],
};

/* ================================================================
   DATA — the abuse
   Guardrails: every line attacks the typing, never the person.
   No slurs, nothing about body/identity, nothing bleak. "delete
   the app" is the ceiling. mild never draws from unhinged.
   ================================================================ */

const HECKLES = {
  STALL: {
    mild: ["we're all waiting.", 'any time now.', 'the cursor is blinking at you.', '{sec} seconds of silence. say something.'],
    standard: ['did you fall asleep.', 'the word is right there.', "keys go down. that's the whole job.", 'hello? the test started.'],
    unhinged: ["TYPE. it's the one thing you're here to do.", 'move your hands, you absolute muppet.', 'is the keyboard unplugged, or are you?', "i've seen screensavers with more output."],
  },
  LONG_STALL: {
    mild: ['take your time. we have nowhere to be.', 'still here. still waiting.', 'a moment of silence for your momentum.', "the test has not paused. that's just you."],
    standard: ['{sec} seconds. i could have typed it {sec} times.', "blink twice if you're okay.", 'four seconds is a nap in typing years.', 'we lost the plot somewhere around the spacebar.'],
    unhinged: ['an intermission. nobody asked for an intermission.', "i've seen roadkill with more momentum.", 'fucking hello?? anyone home?', '{sec} seconds. glaciers are lapping you.'],
  },
  TYPO: {
    mild: ['hm.', 'bold typo.', "that's a choice.", "'{word}' doesn't have one of those."],
    standard: ['what the hell was that.', 'wrong. confidently wrong.', 'your fingers are freelancing again.', "'{typed}' is not a letter that word needs."],
    unhinged: ['wrong key. wrong hand. possibly wrong hobby.', "that letter isn't even NEAR the right one.", "fucking hell. '{word}'. it's right there.", 'you had one letter to hit.'],
  },
  TYPO_STREAK: {
    mild: ['several choices in a row.', "we've drifted.", 'the word has left the building.', "let's regroup."],
    standard: ["that's {n} in two seconds. officially a pattern.", 'your accuracy is a cry for help.', 'christ, use your other hand.', "you're typing in a different language now."],
    unhinged: ["you're just hitting keys at random now.", 'stop. breathe. aim. you type like a fire alarm.', 'fucking hell — same fingers, same mistakes.', '{n} misses in two seconds. the keyboard did nothing to you.'],
  },
  BACKSPACE_SPAM: {
    mild: ['the backspace key is tired.', 'forward is also a direction.', 'measure twice, type once.', "we're editing more than writing."],
    standard: ['{n} backspaces in two seconds. impressive, in a way.', "you're mostly backspace by volume.", "deleting it won't delete the memory.", 'undo is not a typing technique.'],
    unhinged: ['just bulldoze the whole sentence, why not.', 'you type two and delete three. the math never lands.', 'ctrl+a, delete, reflect on your choices.', 'the backspace key is filing a complaint.'],
  },
  WORD_FAILED: {
    mild: ['noted.', 'that one goes in the report.', "'{word}'. you've now failed that word {n} times.", 'a word was attempted.'],
    standard: ['that word beat you.', "'{word}' has a spelling. use it.", 'committed, with errors. like most decisions here.', 'the red underline is not a decoration.'],
    unhinged: ['the word won. the word always wins.', 'fucking hell. again. same word.', 'delete the app. delete the keyboard. start over.', "'{word}', {n} failures deep. it's a rivalry now."],
  },
  SLOWDOWN: {
    mild: ["we've slowed.", 'losing steam?', 'the pace was better a minute ago.', 'downhill, and not in the fast way.'],
    standard: ['{wpm} wpm. genuinely.', 'your hands are lagging behind your excuses.', 'this started so well.', "the first ten seconds wrote a check you can't cash."],
    unhinged: ['type faster, you absolute muppet.', 'i have seen glaciers with better wpm.', 'down to {wpm} wpm. the keyboard is not the problem.', "my grandmother types faster, and she's asleep."],
  },
  SURPRISINGLY_GOOD: {
    mild: ['huh.', 'that was... fine.', 'no notes. weird.', "keep that up and i'm out of material."],
    standard: ['{wpm} wpm? who is this?', "okay. don't let it go to your head.", 'a broken clock, and so on.', 'suspiciously competent all of a sudden.'],
    unhinged: ["who the hell is typing right now? it isn't you.", 'fine. FINE. that was good. shut up.', "{wpm} wpm. blink twice if you've been replaced.", 'deeply suspicious. keep going.'],
  },
};

// injected sentences: lowercase, no punctuation, 1–6 words, keyed by
// the player state they mock so injection feels aimed, not random
const INJECT = {
  generic: [
    'you are quite slow', 'my grandmother types faster', 'that was not a word',
    'i have seen glaciers move faster', 'stop', 'please stop',
    'your fingers are decorative', 'the keyboard is not the problem',
    'this is painful to watch', 'even the backspace is tired',
    'you are not built for this', 'a monkey with two thumbs',
    'the words deserve better', 'certified slow by a computer',
    'the caret is bored', 'dial up was faster',
    'you type like wet cardboard', 'somewhere a teacher is crying',
    'the space bar carries you', 'autocorrect gave up on you',
    'you are losing to a sentence', 'every word a small disaster',
    'the letters fear nothing from you', 'i made these words easier',
    'type like you mean it', 'your wpm has a bedtime',
    'reading ahead will not save you', 'the next word goes badly too',
    'home row misses you', 'the keyboard is not a toy',
  ],
  stall: [
    'why did you stop', 'the pause is not helping', 'stopping makes it worse',
    'you were almost mediocre', 'the words are still here',
  ],
  sloppy: [
    'you cannot spell', 'the letters have an order', 'accuracy is not optional',
    'aim then press', 'so many wrong letters',
  ],
  slow: [
    'faster would be nice', 'glaciers file complaints about you',
    'i have met turtles with deadlines', 'pick up the pace',
    'slow is a choice apparently',
  ],
};

// results eulogies, bucketed by wpm bracket then cruelty
const EULOGY = {
  f: { // < 40
    mild: ["well. it's a baseline.", '{wpm} wpm. we can only go up from here.'],
    standard: ['{wpm} wpm. my condolences to the keyboard.', "that wasn't typing, that was a slow leak."],
    unhinged: ["{wpm} wpm. i've seen dial-up handshakes finish faster.", 'that was a eulogy for momentum itself. devastating. historic.'],
  },
  d: { // 40–70
    mild: ['perfectly medium. congratulations, i suppose.', "that was a typing test. that's the nicest thing i can say."],
    standard: ['{wpm} wpm — aggressively average.', "the dictionary definition of 'fine'. the sad one."],
    unhinged: ['{wpm} wpm and you still looked stressed. incredible.', 'behind the middle of the pack, waving at it.'],
  },
  c: { // 70–100
    mild: ["respectable. don't make it weird.", 'solid. almost interesting.'],
    standard: ['decent. your accuracy still filed a complaint: {acc}%.', 'look at you. functional.'],
    unhinged: ['okay. fine. good, even. i hate saying it.', '{wpm} wpm at {acc}%. a functioning typist. barely.'],
  },
  b: { // 100–120
    mild: ["genuinely quick. i'll allow it.", 'fast. hm. noted.'],
    standard: ['fast enough that i almost respect it. almost.', '{wpm} wpm. the keyboard finally has a colleague.'],
    unhinged: ['fucking hell, where was THIS the whole time?', "{wpm} wpm. i'd apologize for the heckling, but you clearly needed it."],
  },
  a: { // > 120: suspicion, not compliments
    mild: ['{wpm} wpm. suspiciously rehearsed.', 'fine. show-off.'],
    standard: ['{wpm}? either you practice or you cheat. neither is charming.', 'nobody needs to type that fast. what are you running from?'],
    unhinged: ['{wpm} wpm. nobody types that fast honestly. lawyer up.', "suspicious. i'm flagging this internally."],
  },
};

const PB_BEAT = {
  mild: "a personal best. i'm not saying it twice.",
  standard: "new personal best. fine. it's in the ledger.",
  unhinged: 'a new pb. wonderful. now the bar is higher and so is the fall.',
  silent: 'new personal best: {wpm} wpm.',
};
const PERSONAL_WORST = {
  mild: 'below your own average by {d} wpm. the quiet kind of sad.',
  standard: '{d} wpm under your own average. beaten by yourself.',
  unhinged: 'your past self types faster than you. your PAST self. sit with that.',
};

/* ================================================================
   STORAGE — single namespaced key, everything guarded
   ================================================================ */

const KEY = 'hostility.v1';
const DEFAULTS = {
  mode: 'time', time: 30, wordCount: 25, quote: 'medium',
  complexity: 'standard', punctuation: false, numbers: false,
  cruelty: 'standard', injection: true, liveWpm: true, sound: false,
};

function loadStore() {
  let raw = null;
  try { raw = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { /* locked-down browser */ }
  const st = raw && typeof raw === 'object' ? raw : {};
  st.settings = Object.assign({}, DEFAULTS, st.settings || {});
  st.bests = st.bests || {};
  st.tests = st.tests || 0;
  st.wpmSum = st.wpmSum || 0;
  // first visit follows the OS preference; after that we honour their choice
  if (st.theme !== 'light' && st.theme !== 'dark') {
    st.theme = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return st;
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* degrade gracefully */ }
}

const store = loadStore();

/* ================================================================
   DOM refs + shared state
   ================================================================ */

const $ = id => document.getElementById(id);
const el = {
  bar: $('settingsBar'), stage: $('stage'), area: $('typingArea'),
  viewport: $('viewport'), words: $('words'), caret: $('caret'),
  toast: $('heckleToast'), margin: $('marginHeckle'), hint: $('hint'),
  overlay: $('focusOverlay'), ghost: $('ghost'), live: $('liveStats'),
  progress: $('progress'), progressFill: $('progressFill'),
  results: $('results'),
  resetOverlay: $('resetOverlay'), resetArc: $('resetArc'), resetRing: $('resetRing'),
  resetGlow: $('resetGlow'), resetLabel: $('resetLabel'),
  themeToggle: $('themeToggle'),
};

// read a resolved CSS custom property (so JS colour effects follow the theme)
function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
const body = document.body;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const S = {
  set: store.settings,
  words: [], wordEls: [], baseTexts: [],
  wi: 0,
  running: false, finished: false, runId: 0,
  startAt: 0, endAt: 0, lastKeyAt: 0,
  keyLog: [],                     // {t, ok} per character keystroke
  ks: { correct: 0, incorrect: 0 }, // keystroke totals for accuracy
  typoTimes: [], bsTimes: [],
  samples: [], errSeconds: new Set(), sampleSec: 0,
  failCounts: {},
  sinceInject: 0, nextInjectAt: 12,
  misery: 0,
  resultsAt: 0,
  lastPaceCheck: 0, lastLive: 0, lastMiseryApply: 0,
  caretPos: { x: 0, y: 0, h: 32 },
  lineH: 0,
};

const H = { last: {}, lastGlobal: 0, decks: {}, toastTimer: 0, marginTimer: 0, toastVisible: false, marginVisible: false, side: 'left', lastInject: '' };

/* ================================================================
   UTILITIES
   ================================================================ */

const rand = n => Math.floor(Math.random() * n);
const pick = arr => arr[rand(arr.length)];
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function lerpHex(a, b, t) {
  const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, '0')).join('');
}
const storedAvg = () => store.tests > 0 ? store.wpmSum / store.tests : 0;
const accPct = () => {
  const t = S.ks.correct + S.ks.incorrect;
  return t ? Math.round(S.ks.correct / t * 100) : 100;
};

// wpm over a trailing window, from the keystroke log
function rollingWpm(ms, onlyCorrect) {
  const from = performance.now() - ms;
  let n = 0;
  for (let i = S.keyLog.length - 1; i >= 0; i--) {
    if (S.keyLog[i].t < from) break;
    if (!onlyCorrect || S.keyLog[i].ok) n++;
  }
  return (n / 5) / (ms / 60000);
}

/* ================================================================
   AUDIO — synthesized, no files
   ================================================================ */

let actx = null;
let keyEventTime = 0;          // performance-clock timestamp of the keystroke being sounded
const AUDIO_LOOKAHEAD = 0.02;  // constant offset (s) each sound sits behind its keypress
// lazily create the context and keep it resumed. browsers start it suspended
// until a user gesture, so we also resume it on the first interaction (below).
function audioCtx() {
  try {
    if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume();
  } catch (e) { actx = null; }
  return actx;
}

function sfx(kind) {
  if (!S.set.sound) return;
  const ctx = audioCtx();
  if (!ctx) return;
  try {
    // Schedule relative to WHEN THE KEY WAS ACTUALLY PRESSED, not when this
    // handler happened to run. We map the keydown's performance-clock timestamp
    // onto the audio clock (both tick at real-time) and add a small constant
    // lookahead. So every sound sits AUDIO_LOOKAHEAD behind its keypress, even
    // if the main thread stalled first — the rhythm stays locked to the typing
    // instead of drifting. Clamp to now so we never schedule in the past.
    const sinceEvent = keyEventTime ? Math.max(0, (performance.now() - keyEventTime) / 1000) : 0;
    const t = Math.max(ctx.currentTime, ctx.currentTime - sinceEvent + AUDIO_LOOKAHEAD);
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    if (kind === 'click') {
      // crisp, short keypress tick — a punchy transient reads as tightly 1:1
      // with the keypress; slight pitch randomness so a fast run isn't robotic
      const f = 760 + Math.random() * 220;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t);
      osc.frequency.exponentialRampToValueAtTime(f * 0.7, t + 0.016);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.2, t + 0.003); // fast attack avoids a pop
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.038);
      osc.start(t); osc.stop(t + 0.045);
    } else { // dull thunk on error — low, with a downward pitch drop
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(68, t + 0.1);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.32, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.17);
      osc.start(t); osc.stop(t + 0.18);
    }
  } catch (e) { /* no audio available */ }
}

// resume/warm the audio context on the first real user gesture so the very
// first keystroke isn't swallowed by the browser's autoplay policy
function unlockAudio() { if (S.set.sound) audioCtx(); }
window.addEventListener('pointerdown', unlockAudio);
window.addEventListener('keydown', unlockAudio);

/* ================================================================
   WORD GENERATION
   ================================================================ */

function pool() {
  return S.set.complexity === 'common' ? COMMON
    : S.set.complexity === 'brutal' ? BRUTAL : STANDARD;
}

function genWords(n, exact) {
  let list = [];
  if (S.set.complexity === 'code') {
    while (list.length < n) list = list.concat(pick(CODE_SNIPPETS).split(' '));
  } else {
    const p = pool();
    let prev = '';
    for (let i = 0; i < n; i++) {
      let w = pick(p);
      if (w === prev) w = pick(p);
      prev = w;
      list.push(w);
    }
    list = decorate(list);
  }
  if (exact) list.length = Math.min(list.length, n);
  return list;
}

// punctuation / numbers sprinkling (skipped for code + quote modes)
function decorate(list) {
  const out = [];
  for (let w of list) {
    if (S.set.punctuation) {
      const r = Math.random();
      if (r < 0.06) w = `"${w}"`;
      else if (r < 0.11) w += "'s";
      else if (r < 0.22) w += ',';
      else if (r < 0.3) w += '.';
    }
    out.push(w);
    if (S.set.numbers && Math.random() < 0.08) out.push(String(rand(9999) + 1));
  }
  return out;
}

const makeWord = (text, injected) => ({ text, typed: [], state: 'pending', hadError: false, injected: !!injected });

function buildWordEl(w) {
  const span = document.createElement('span');
  span.className = 'word' + (w.injected ? ' injected' : '');
  for (const ch of w.text) {
    const c = document.createElement('span');
    c.className = 'char pending';
    c.textContent = ch;
    span.appendChild(c);
  }
  return span;
}

function mountWords() {
  const frag = document.createDocumentFragment();
  S.wordEls = S.words.map(w => {
    const e = buildWordEl(w);
    frag.appendChild(e);
    return e;
  });
  el.words.textContent = '';
  el.words.appendChild(frag);
  el.words.style.transform = 'translateY(0)';
}

function extendIfNeeded() {
  if (S.set.mode !== 'time') return;
  if (S.words.length - S.wi >= 40) return;
  const texts = genWords(50, false);
  const frag = document.createDocumentFragment();
  for (const t of texts) {
    const w = makeWord(t);
    S.words.push(w);
    S.baseTexts.push(t);
    const e = buildWordEl(w);
    S.wordEls.push(e);
    frag.appendChild(e);
  }
  el.words.appendChild(frag);
}

/* ================================================================
   CARET + LINE SCROLL — reads and writes batched into one rAF
   ================================================================ */

let caretDirty = false;
function scheduleCaret() {
  if (caretDirty) return;
  caretDirty = true;
  requestAnimationFrame(updateCaretNow);
}

function lineHeight() {
  if (!S.lineH) S.lineH = parseFloat(getComputedStyle(el.words).lineHeight) || 48;
  return S.lineH;
}

function updateCaretNow() {
  caretDirty = false;
  const w = S.words[S.wi], wordEl = S.wordEls[S.wi];
  if (!w || !wordEl) return;
  // --- reads ---
  const chars = wordEl.children;
  const ti = Math.min(w.typed.length, chars.length);
  let x, y, h;
  if (!chars.length) {
    x = wordEl.offsetLeft; y = wordEl.offsetTop; h = wordEl.offsetHeight || 32;
  } else if (ti < chars.length) {
    const c = chars[ti];
    x = wordEl.offsetLeft + c.offsetLeft; y = wordEl.offsetTop + c.offsetTop; h = c.offsetHeight;
  } else {
    const c = chars[chars.length - 1];
    x = wordEl.offsetLeft + c.offsetLeft + c.offsetWidth; y = wordEl.offsetTop + c.offsetTop; h = c.offsetHeight;
  }
  const lh = lineHeight();
  // keep the active line vertically centered: scroll once the caret
  // passes the first line, one line-height per line
  const line = Math.floor((y + h / 2) / lh);
  const scroll = Math.max(0, line - 1) * lh;
  // --- writes ---
  el.words.style.transform = `translateY(${-scroll}px)`;
  const cy = y - scroll;
  el.caret.style.transform = `translate(${x}px, ${cy}px)`;
  el.caret.style.height = h + 'px';
  S.caretPos = { x, y: cy, h };
  positionHeckles();
}

function positionHeckles() {
  const { x, y, h } = S.caretPos;
  const vTop = el.viewport.offsetTop;
  if (H.toastVisible) {
    // ~28px below and slightly right of the caret, clamped to the block
    const tw = el.toast.offsetWidth;
    const maxX = el.area.clientWidth - tw - 4;
    el.toast.style.left = Math.max(0, Math.min(x + 12, maxX)) + 'px';
    el.toast.style.top = (vTop + y + h + 10) + 'px';
  }
  if (H.marginVisible) el.margin.style.top = (vTop + y) + 'px';
}

/* ================================================================
   HECKLER — event bus with per-trigger cooldowns
   ================================================================ */

const TRIGGERS = {
  SLOWDOWN: { cd: 4000 },
  STALL: { cd: 2500 },
  LONG_STALL: { cd: 6000 },
  TYPO: { cd: 1500, chance: 0.35 }, // random so typo jabs stay unpredictable
  TYPO_STREAK: { cd: 3000 },
  BACKSPACE_SPAM: { cd: 5000 },
  WORD_FAILED: { cd: 2000 },
  SURPRISINGLY_GOOD: { cd: 8000 },
};

function fire(name, ctx = {}) {
  const def = TRIGGERS[name];
  if (!def || S.set.cruelty === 'silent' || !S.running) return;
  const now = performance.now();
  if (now - S.startAt < 1500) return;          // let them settle in
  if (now - H.lastGlobal < 800) return;        // global rate limit, all channels
  if (now - (H.last[name] || 0) < def.cd) return;
  if (def.chance && Math.random() > def.chance) return;
  const line = drawLine(name);
  if (!line) return;
  H.last[name] = now;
  H.lastGlobal = now;
  deliver(fillLine(line, ctx));
}

// draw without replacement: shuffled index deck per trigger+tier,
// refilled only when exhausted, so lines don't repeat early
function drawLine(trigger) {
  const tier = S.set.cruelty;
  const poolArr = (HECKLES[trigger] || {})[tier];
  if (!poolArr || !poolArr.length) return null;
  const key = trigger + '|' + tier;
  let deck = H.decks[key];
  if (!deck || !deck.length) deck = H.decks[key] = shuffle(poolArr.map((_, i) => i));
  return poolArr[deck.pop()];
}

function fillLine(str, ctx) {
  const base = {
    wpm: Math.round(rollingWpm(10000, true)),
    sec: Math.round((performance.now() - S.lastKeyAt) / 1000),
    acc: accPct(), n: 2, word: 'that', typed: '',
  };
  const c = Object.assign(base, ctx);
  return str.replace(/\{(\w+)\}/g, (m, k) => c[k] !== undefined ? String(c[k]) : m);
}

function marginFits() {
  return el.area.getBoundingClientRect().left >= 216;
}

function deliver(text) {
  // long jabs go to the margin when there's room; short ones ride the caret
  if ((text.length > 34 || Math.random() < 0.22) && marginFits()) showMargin(text);
  else showToast(text);
}

function showToast(text) {
  hideMargin(); // one heckle on screen at a time, across channels
  const show = () => {
    el.toast.textContent = text;
    H.toastVisible = true;
    positionHeckles();
    el.toast.classList.remove('out');
    el.toast.classList.add('in');
    clearTimeout(H.toastTimer);
    H.toastTimer = setTimeout(hideToast, 900 + rand(500));
  };
  if (H.toastVisible) { // fade the old one out first, never hard-swap
    el.toast.classList.remove('in');
    el.toast.classList.add('out');
    clearTimeout(H.toastTimer);
    H.toastTimer = setTimeout(show, 170);
  } else show();
}
function hideToast() {
  H.toastVisible = false;
  el.toast.classList.remove('in');
  el.toast.classList.add('out');
}

function hideMargin() {
  if (!H.marginVisible) return;
  clearTimeout(H.marginTimer);
  H.marginVisible = false;
  el.margin.classList.remove('in');
  el.margin.classList.add('out');
}

function showMargin(text) {
  if (H.toastVisible) hideToast();
  H.side = H.side === 'left' ? 'right' : 'left';
  el.margin.className = 'margin-heckle ' + H.side;
  el.margin.textContent = text;
  H.marginVisible = true;
  positionHeckles();
  el.margin.classList.remove('out');
  el.margin.classList.add('in');
  clearTimeout(H.marginTimer);
  H.marginTimer = setTimeout(hideMargin, 1600);
}

function hideHecklesNow() {
  clearTimeout(H.toastTimer);
  clearTimeout(H.marginTimer);
  H.toastVisible = H.marginVisible = false;
  el.toast.classList.remove('in', 'out');
  el.margin.classList.remove('in', 'out');
  el.toast.textContent = '';
  el.margin.textContent = '';
}

/* ================================================================
   WORD INJECTION — the centerpiece
   ================================================================ */

// minimum words between injections — a floor so a long slump can't fire them
// back-to-back. this is NOT a guaranteed cadence: an injection only actually
// happens on a slowdown (see isSlumping), so a good run gets none at all.
function rollInjectGap() {
  const c = S.set.cruelty;
  return c === 'mild' ? 10 + rand(4)
    : c === 'unhinged' ? 3 + rand(3)
    : 6 + rand(3);
}

function maybeInject() {
  const s = S.set;
  if (!s.injection || s.cruelty === 'silent' || s.mode === 'quote' || !S.running) return;
  S.sinceInject++;
  // minimum spacing since the last injection (a floor, not a schedule)
  if (S.sinceInject < S.nextInjectAt) return;
  // only unhinged is rude enough to inject while a heckle is on screen
  if (s.cruelty !== 'unhinged' && H.toastVisible) return;
  // the actual trigger: only inject when the player is flagging. a fast,
  // accurate run is left completely alone.
  if (!isSlumping()) return;
  const start = S.wi + 2; // ≥2 words ahead so nothing the player is inside moves
  const avail = S.words.length - start;
  if (avail < 1) return;
  const sentence = pickInjection(Math.min(avail, 6));
  if (!sentence) return;
  const parts = sentence.split(' ');
  for (let k = 0; k < parts.length; k++) {
    const idx = start + k;
    const nw = makeWord(parts[k], true);
    S.words[idx] = nw;
    const e = buildWordEl(nw);
    e.classList.add('inject-in'); // 200ms cross-fade on a word boundary
    S.wordEls[idx].replaceWith(e);
    S.wordEls[idx] = e;
  }
  S.sinceInject = 0;
  S.nextInjectAt = rollInjectGap();
  scheduleCaret();
}

// true when recent typing has slowed or gone sloppy relative to the player's
// own pace (or their stored average). deliberately returns false for a clean,
// fast run so injection never punishes someone who's doing well.
function isSlumping() {
  const now = performance.now();
  const elapsed = now - S.startAt;
  if (elapsed < 4000) return false;                // need a little history first
  const w3 = rollingWpm(3000, true);
  const w10 = rollingWpm(Math.min(elapsed, 10000), true);
  if (w10 > 15 && w3 < w10 * 0.8) return true;      // primary: pace fell ~20% below their own recent pace
  const avg = storedAvg();
  if (avg > 10 && w3 < avg * 0.7) return true;      // or a genuinely bad day vs their usual average (not merely below PB)
  const recent = S.keyLog.slice(-20);               // or a sloppy patch — errors aren't "doing well" either
  if (recent.length >= 12 && recent.filter(k => k.ok).length / recent.length < 0.85) return true;
  return false;
}

// bias the insult toward whatever the player is doing wrong right now
function pickInjection(maxLen) {
  const now = performance.now();
  let flavor = 'generic';
  const recent = S.keyLog.slice(-20);
  const recentAcc = recent.length ? recent.filter(k => k.ok).length / recent.length : 1;
  const avg = storedAvg();
  if (now - S.lastKeyAt > 1200) flavor = 'stall';
  else if (recentAcc < 0.85) flavor = 'sloppy';
  else if (avg > 10 && rollingWpm(10000, true) < avg * 0.75) flavor = 'slow';
  let cands = INJECT[flavor].filter(t => t.split(' ').length <= maxLen && t !== H.lastInject);
  if (!cands.length) cands = INJECT.generic.filter(t => t.split(' ').length <= maxLen && t !== H.lastInject);
  if (!cands.length) return null;
  const s = pick(cands);
  H.lastInject = s;
  return s;
}

/* ================================================================
   AMBIENT DEGRADATION — almost subliminal ui souring
   ================================================================ */

function updateMisery(now) {
  const recent = S.keyLog.slice(-30);
  const errFrac = recent.length >= 8 ? recent.filter(k => !k.ok).length / recent.length : 0;
  const idle = now - S.lastKeyAt;
  const idleF = idle > 1500 ? Math.min(1, (idle - 1500) / 4000) : 0;
  const avg = storedAvg();
  const slowF = (avg > 10 && S.keyLog.length > 20 && rollingWpm(10000, true) < avg * 0.7) ? 0.4 : 0;
  const target = Math.min(1, errFrac * 1.6 * 0.7 + idleF * 0.3 + slowF);
  S.misery += (target - S.misery) * 0.02; // creeps, never snaps
  if (now - S.lastMiseryApply < 150) return;
  S.lastMiseryApply = now;
  const m = S.misery, root = document.documentElement.style;
  if (m < 0.02) {
    root.removeProperty('--bg-live');
    root.removeProperty('--dim-live');
    root.removeProperty('--caret-live');
    return;
  }
  // lerp from the live theme colours toward their "soured" counterparts, so
  // the degradation reads correctly in both light and dark
  const cs = getComputedStyle(document.documentElement);
  const v = n => cs.getPropertyValue(n).trim();
  root.setProperty('--bg-live', lerpHex(v('--bg'), v('--bg-soured'), m));
  root.setProperty('--dim-live', lerpHex(v('--text-dim'), v('--dim-soured'), m));
  root.setProperty('--caret-live', lerpHex(v('--accent'), v('--error'), m));
}

function resetMisery() {
  S.misery = 0;
  const root = document.documentElement.style;
  root.removeProperty('--bg-live');
  root.removeProperty('--dim-live');
  root.removeProperty('--caret-live');
}

/* ================================================================
   INPUT
   ================================================================ */

function startRun() {
  S.running = true;
  S.startAt = performance.now();
  S.lastKeyAt = S.startAt;
  el.hint.hidden = true;
  body.classList.add('engaged');
  const id = ++S.runId;
  requestAnimationFrame(function loop() {
    if (!S.running || id !== S.runId) return;
    tick();
    requestAnimationFrame(loop);
  });
}

function handleChar(ch) {
  if (S.finished) return;
  if (!S.running) startRun();
  const now = performance.now();
  S.lastKeyAt = now;
  body.classList.add('engaged');
  const w = S.words[S.wi];
  if (!w) return;

  if (ch === ' ') {
    if (w.typed.length > 0) commitWord();
    return;
  }

  const wordEl = S.wordEls[S.wi];
  const pos = w.typed.length;
  if (pos < w.text.length) {
    const ok = ch === w.text[pos];
    w.typed.push(ch);
    const span = wordEl.children[pos];
    span.classList.remove('pending');
    span.classList.add(ok ? 'correct' : 'incorrect');
    S.ks[ok ? 'correct' : 'incorrect']++;
    S.keyLog.push({ t: now, ok });
    if (ok) sfx('click');
    else registerTypo(now, w, ch, span);
  } else if (pos - w.text.length < 8) { // extra chars appended as red ghosts
    w.typed.push(ch);
    const ghost = document.createElement('span');
    ghost.className = 'char incorrect extra';
    ghost.textContent = ch;
    wordEl.appendChild(ghost);
    S.ks.incorrect++;
    S.keyLog.push({ t: now, ok: false });
    registerTypo(now, w, ch, ghost);
  } else return;

  // words/quote modes end the moment the final word is typed clean
  if (S.set.mode !== 'time' && S.wi === S.words.length - 1 &&
      w.typed.length === w.text.length &&
      w.text.split('').every((c, i) => w.typed[i] === c)) {
    finish();
    return;
  }
  scheduleCaret();
}

function registerTypo(now, w, ch, span) {
  sfx('thunk');
  if (!reduceMotion) {
    span.classList.add('shake');
    span.addEventListener('animationend', () => span.classList.remove('shake'), { once: true });
  }
  S.typoTimes.push(now);
  fire('TYPO', { word: w.text, typed: ch });
  const streak = S.typoTimes.filter(t => now - t < 2000).length;
  if (streak >= 3) fire('TYPO_STREAK', { n: streak, word: w.text });
}

function commitWord() {
  const w = S.words[S.wi], wordEl = S.wordEls[S.wi];
  let bad = w.typed.length !== w.text.length;
  const lim = Math.min(w.typed.length, w.text.length);
  for (let i = 0; i < lim; i++) if (w.typed[i] !== w.text[i]) bad = true;
  w.state = 'done';
  w.hadError = bad;
  wordEl.classList.toggle('error', bad);
  if (bad) {
    const n = (S.failCounts[w.text] = (S.failCounts[w.text] || 0) + 1);
    fire('WORD_FAILED', { word: w.text, n });
  }
  S.wi++;
  if (S.set.mode !== 'time' && S.wi >= S.words.length) { finish(); return; }
  extendIfNeeded();
  maybeInject();
  scheduleCaret();
}

function handleBackspace(wholeWord) {
  if (S.finished || !S.words.length) return;
  const now = performance.now();
  if (S.running) {
    S.lastKeyAt = now;
    S.bsTimes.push(now);
    const n = S.bsTimes.filter(t => now - t < 2000).length;
    if (n >= 6) fire('BACKSPACE_SPAM', { n });
  }
  const w = S.words[S.wi], wordEl = S.wordEls[S.wi];
  if (w.typed.length === 0) {
    // travel into the previous word only if it was committed wrong
    const pw = S.words[S.wi - 1];
    if (pw && pw.state === 'done' && pw.hadError) {
      S.wi--;
      pw.state = 'pending';
      S.wordEls[S.wi].classList.remove('error');
    }
  } else if (wholeWord) {
    while (w.typed.length) popChar(w, wordEl);
  } else popChar(w, wordEl);
  scheduleCaret();
}

function popChar(w, wordEl) {
  const pos = w.typed.length - 1;
  if (pos >= w.text.length) wordEl.removeChild(wordEl.lastChild);
  else wordEl.children[pos].className = 'char pending';
  w.typed.pop();
}

/* ================================================================
   MAIN LOOP — timing, samples, stall + pace triggers (rAF only)
   ================================================================ */

function tick() {
  const now = performance.now();
  const elapsed = now - S.startAt;

  if (S.set.mode === 'time' && elapsed >= S.set.time * 1000) { finish(); return; }

  // one raw-wpm sample per elapsed second, used for consistency + sparkline
  const sec = Math.floor(elapsed / 1000);
  while (S.sampleSec < sec) { S.sampleSec++; pushSample(S.sampleSec); }

  const idle = now - S.lastKeyAt;
  if (idle > 4000) fire('LONG_STALL', { sec: Math.round(idle / 1000) });
  else if (idle > 1200) fire('STALL', { sec: Math.round(idle / 1000) });

  if (now - S.lastPaceCheck > 500) {
    S.lastPaceCheck = now;
    if (elapsed > 4000) {
      const w3 = rollingWpm(3000, true);
      const w10 = rollingWpm(Math.min(elapsed, 10000), true);
      // rolling 3s pace >25% under the rolling 10s average
      if (w10 > 15 && w3 < w10 * 0.75) fire('SLOWDOWN', { wpm: Math.round(w3) });
      const avg = storedAvg();
      if (avg > 10 && w10 > avg * 1.2) fire('SURPRISINGLY_GOOD', { wpm: Math.round(w10) });
    }
  }

  updateMisery(now);
  updateProgress(elapsed);

  if (now - S.lastLive > 250) { S.lastLive = now; renderLive(elapsed); }
  el.caret.classList.toggle('blink', idle > 750);
}

function pushSample(secIdx) {
  const from = S.startAt + (secIdx - 1) * 1000;
  const to = S.startAt + secIdx * 1000;
  let n = 0, err = false;
  for (let i = S.keyLog.length - 1; i >= 0; i--) {
    const k = S.keyLog[i];
    if (k.t < from) break;
    if (k.t > to) continue;
    n++;
    if (!k.ok) err = true;
  }
  S.samples.push(n * 12); // chars/sec → wpm
  if (err) S.errSeconds.add(secIdx - 1);
}

// live readout: a prominent progress figure (countdown or word count) plus
// running wpm and accuracy. throttled to 250ms by the caller so digits don't
// strobe; tabular-nums in CSS keeps them from shifting width as they change.
function renderLive(elapsed) {
  if (!S.set.liveWpm) { el.live.textContent = ''; return; }
  let n = 0;
  for (const k of S.keyLog) if (k.ok) n++;
  const wpm = elapsed > 800 ? Math.round(n / 5 / (elapsed / 60000)) : 0;
  const primary = S.set.mode === 'time'
    ? `${Math.max(0, Math.ceil((S.set.time * 1000 - elapsed) / 1000))}s`
    : `${Math.min(S.wi, S.words.length)}/${S.words.length}`;
  el.live.innerHTML =
    `<span class="ls-primary">${primary}</span>` +
    `<span class="ls-item"><b>${wpm}</b> wpm</span>` +
    `<span class="ls-item"><b>${accPct()}</b>% acc</span>`;
}

// thin bar under the caret line; updated every frame (cheap scaleX, no layout)
function updateProgress(elapsed) {
  if (!S.set.liveWpm) return;
  const frac = S.set.mode === 'time'
    ? Math.min(1, elapsed / (S.set.time * 1000))
    : S.words.length ? Math.min(1, S.wi / S.words.length) : 0;
  el.progressFill.style.transform = `scaleX(${frac})`;
}

/* ================================================================
   TEST LIFECYCLE
   ================================================================ */

function newTest(repeat) {
  S.runId++;
  S.running = false;
  S.finished = false;
  S.wi = 0;
  S.keyLog = [];
  S.ks = { correct: 0, incorrect: 0 };
  S.typoTimes = [];
  S.bsTimes = [];
  S.samples = [];
  S.errSeconds = new Set();
  S.sampleSec = 0;
  S.failCounts = {};
  S.sinceInject = 0;
  S.nextInjectAt = rollInjectGap();
  S.lineH = 0;
  H.last = {};
  H.lastGlobal = 0;
  hideHecklesNow();
  resetMisery();
  body.classList.remove('engaged');

  let texts;
  if (repeat && S.baseTexts.length) {
    texts = S.baseTexts.slice();
  } else if (S.set.mode === 'quote') {
    texts = pick(QUOTES[S.set.quote] || QUOTES.medium).split(' ');
  } else if (S.set.mode === 'words') {
    texts = genWords(S.set.wordCount, true);
  } else {
    texts = genWords(90, false);
  }
  S.baseTexts = texts.slice();
  S.words = texts.map(t => makeWord(t));
  mountWords();

  abortHold();
  el.results.hidden = true;
  el.results.classList.remove('in');
  el.stage.hidden = false;
  el.hint.hidden = false;
  el.hint.textContent = 'start typing';
  el.live.textContent = '';
  el.progressFill.style.transform = 'scaleX(0)';
  body.classList.toggle('show-live', !!S.set.liveWpm);
  el.caret.classList.add('blink');
  scheduleCaret();
  el.ghost.focus();
}

function finish() {
  if (S.finished) return;
  S.finished = true;
  S.running = false;
  S.endAt = performance.now();
  body.classList.remove('engaged');
  hideHecklesNow();
  resetMisery();
  abortHold(); // if the timer ends mid-hold, drop the ring rather than reset

  const durSec = S.set.mode === 'time' ? S.set.time : Math.max(0.5, (S.endAt - S.startAt) / 1000);
  // capture the trailing partial second so short tests still get a curve
  const partial = (S.endAt - S.startAt) / 1000 - S.sampleSec;
  if (partial > 0.4) { S.sampleSec++; pushSample(S.sampleSec); }

  const stats = computeStats(durSec);
  const key = bestKey();
  const prevBest = store.bests[key] || 0;
  const beat = stats.wpm > prevBest;
  const avg = storedAvg();
  if (beat) store.bests[key] = stats.wpm;
  store.tests++;
  store.wpmSum += stats.wpm;
  save();

  renderResults(stats, { beat, prevBest, avg, durSec, best: store.bests[key] || stats.wpm });
}

function computeStats(durSec) {
  let correct = 0, incorrect = 0, extra = 0, missed = 0, rawChars = 0;
  let correctWords = 0, typedWords = 0;
  for (let i = 0; i <= S.wi && i < S.words.length; i++) {
    const w = S.words[i];
    const typedLen = w.typed.length;
    if (typedLen === 0 && i === S.wi) break;
    const lim = Math.min(typedLen, w.text.length);
    let wordOk = typedLen === w.text.length;
    for (let j = 0; j < lim; j++) {
      if (w.typed[j] === w.text[j]) correct++;
      else { incorrect++; wordOk = false; }
    }
    if (typedLen > w.text.length) { extra += typedLen - w.text.length; wordOk = false; }
    const committed = i < S.wi;
    if (committed) {
      missed += Math.max(0, w.text.length - typedLen);
      rawChars++; // the space
      typedWords++;
      if (wordOk) correctWords++;
    }
    rawChars += typedLen;
  }
  const min = durSec / 60;
  // wpm = correct chars (plus one space per clean word) / 5 / minutes
  const wpm = Math.round((correct + correctWords) / 5 / min);
  const raw = Math.round(rawChars / 5 / min);
  const acc = accPct();
  // consistency: coefficient of variation across per-second wpm samples,
  // flipped so that steadier typing scores higher
  let con = 0;
  if (S.samples.length >= 2) {
    const mean = S.samples.reduce((a, b) => a + b, 0) / S.samples.length;
    if (mean > 0) {
      const sd = Math.sqrt(S.samples.reduce((a, b) => a + (b - mean) ** 2, 0) / S.samples.length);
      con = Math.max(0, Math.min(100, Math.round((1 - sd / mean) * 100)));
    }
  }
  // peak = fastest single per-second sample the player hit during the run
  const peak = S.samples.length ? Math.round(Math.max(...S.samples)) : wpm;
  return { wpm, raw, acc, con, peak, correctWords, typedWords,
    correct, incorrect, extra, missed, durSec,
    samples: S.samples.slice(), errSeconds: new Set(S.errSeconds) };
}

function bestKey() {
  const s = S.set;
  const sub = s.mode === 'time' ? s.time : s.mode === 'words' ? s.wordCount : s.quote;
  const cx = s.mode === 'quote' ? 'quote' : s.complexity;
  return `${s.mode}|${sub}|${cx}|p${s.punctuation ? 1 : 0}n${s.numbers ? 1 : 0}`;
}

/* ================================================================
   RESULTS
   ================================================================ */

function modeSummary() {
  const s = S.set;
  const bits = [s.mode === 'time' ? `time ${s.time}` : s.mode === 'words' ? `words ${s.wordCount}` : `quote ${s.quote}`];
  if (s.mode !== 'quote') {
    bits.push(s.complexity);
    if (s.punctuation) bits.push('punct');
    if (s.numbers) bits.push('num');
  }
  bits.push(CRUELTY_LABELS[s.cruelty] || s.cruelty);
  return bits.join(' · ');
}

function pickEulogy(stats) {
  if (S.set.cruelty === 'silent') return `done. ${stats.wpm} wpm, ${stats.acc}% accuracy.`;
  const b = stats.wpm < 40 ? 'f' : stats.wpm < 70 ? 'd' : stats.wpm < 100 ? 'c' : stats.wpm <= 120 ? 'b' : 'a';
  return fillLine(pick(EULOGY[b][S.set.cruelty]), { wpm: stats.wpm, acc: stats.acc });
}

function pickPbLine(stats, { beat, prevBest, avg }) {
  const tier = S.set.cruelty;
  if (beat && prevBest > 0) return fillLine(PB_BEAT[tier], { wpm: stats.wpm });
  if (beat) return tier === 'silent' ? 'first result recorded.' : "first result recorded. the bar exists now. it's low, but it exists.";
  if (tier !== 'silent' && avg > 5 && stats.wpm < avg) {
    // PERSONAL_WORST: fires once, here, when the run lands under their average
    return fillLine(PERSONAL_WORST[tier], { d: Math.max(1, Math.round(avg - stats.wpm)) });
  }
  return `${Math.max(1, prevBest - stats.wpm)} wpm short of your best (${prevBest}).`;
}

function renderResults(stats, meta) {
  $('resWpm').textContent = stats.wpm;
  $('resAcc').textContent = stats.acc + '%';
  $('resRaw').textContent = stats.raw;
  $('resCon').textContent = stats.con + '%';
  $('resPeak').textContent = stats.peak;
  $('resBest').textContent = meta.best + (meta.beat ? ' ★' : '');
  $('resWords').textContent = `${stats.correctWords}/${stats.typedWords}`;
  $('resChars').textContent = `${stats.correct}/${stats.incorrect}/${stats.extra}/${stats.missed}`;
  $('resTime').textContent = Math.round(meta.durSec) + 's';
  $('resMode').textContent = modeSummary();
  $('resEulogy').textContent = pickEulogy(stats);
  $('resPb').textContent = pickPbLine(stats, meta);

  el.stage.hidden = true;
  el.results.hidden = false;
  S.resultsAt = performance.now(); // start of the grace window (see resultsLocked)
  requestAnimationFrame(() => {
    el.results.classList.add('in');
    drawSpark(stats);
  });
  // focus the primary action only AFTER the grace window, so trailing
  // momentum keystrokes can't activate it and skip past the stats
  setTimeout(() => { if (!el.results.hidden) $('btnNext').focus(); }, RESULTS_GRACE);
}

// wpm-per-second sparkline with a 400ms left-to-right reveal;
// red dots mark seconds that contained at least one error
function drawSpark(stats) {
  const cv = $('spark');
  const W = Math.max(280, cv.clientWidth), Hh = 120;
  const dpr = window.devicePixelRatio || 1;
  cv.width = W * dpr;
  cv.height = Hh * dpr;
  const g = cv.getContext('2d');
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  let s = stats.samples;
  if (s.length < 2) s = [stats.wpm, stats.wpm];
  const pad = 10;
  const max = Math.max(40, ...s) * 1.12;
  const X = i => pad + (W - 2 * pad) * (i / (s.length - 1));
  const Y = v => Hh - pad - (Hh - 2 * pad) * (v / max);
  const css = getComputedStyle(document.documentElement);
  const cAccent = css.getPropertyValue('--accent').trim();
  const cErr = css.getPropertyValue('--error').trim();
  const cBorder = css.getPropertyValue('--border').trim();
  const D = reduceMotion ? 1 : 400;
  const t0 = performance.now();
  (function frame() {
    const p = Math.min(1, (performance.now() - t0) / D);
    g.clearRect(0, 0, W, Hh);
    g.strokeStyle = cBorder;
    g.lineWidth = 1;
    g.beginPath(); g.moveTo(pad, Y(0)); g.lineTo(W - pad, Y(0)); g.stroke();
    g.setLineDash([3, 5]);
    g.beginPath(); g.moveTo(pad, Y(max / 2)); g.lineTo(W - pad, Y(max / 2)); g.stroke();
    g.setLineDash([]);
    const nVis = (s.length - 1) * p;
    const pts = [[X(0), Y(s[0])]];
    const full = Math.floor(nVis);
    for (let i = 1; i <= full; i++) pts.push([X(i), Y(s[i])]);
    const f = nVis - full;
    if (f > 0 && full + 1 < s.length) {
      pts.push([X(full) + (X(full + 1) - X(full)) * f, Y(s[full]) + (Y(s[full + 1]) - Y(s[full])) * f]);
    }
    // soft area fill under the curve, then the line on top
    g.beginPath();
    g.moveTo(pts[0][0], Y(0));
    for (const [x, y] of pts) g.lineTo(x, y);
    g.lineTo(pts[pts.length - 1][0], Y(0));
    g.closePath();
    g.fillStyle = 'rgba(139, 151, 173, 0.09)';
    g.fill();
    g.strokeStyle = cAccent;
    g.lineWidth = 2;
    g.lineJoin = 'round';
    g.beginPath();
    g.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
    g.stroke();
    g.fillStyle = cErr;
    for (const idx of stats.errSeconds) {
      if (idx < s.length && idx <= nVis) {
        g.beginPath();
        g.arc(X(idx), Y(s[idx]), 3, 0, Math.PI * 2);
        g.fill();
      }
    }
    if (p < 1) requestAnimationFrame(frame);
  })();
}

/* ================================================================
   SETTINGS BAR
   ================================================================ */

// display labels are deliberately innocuous — the roast is a surprise, so
// nothing here ("feedback", "surprises") telegraphs the joke. internal keys
// (cruelty, injection, unhinged…) stay unchanged so the rest of the code works.
const CRUELTY_LABELS = { mild: 'gentle', standard: 'normal', unhinged: 'max', silent: 'off' };
const SETTING_DEFS = [
  { key: 'mode', label: 'mode', options: ['time', 'words', 'quote'] },
  { key: 'time', label: 'time', options: [15, 30, 60, 120], show: s => s.mode === 'time' },
  { key: 'wordCount', label: 'words', options: [10, 25, 50, 100], show: s => s.mode === 'words' },
  { key: 'quote', label: 'quote', options: ['short', 'medium', 'long'], show: s => s.mode === 'quote' },
  { key: 'complexity', label: 'difficulty', options: ['common', 'standard', 'brutal', 'code'], show: s => s.mode !== 'quote' },
  { key: 'punctuation', label: 'punctuation', toggle: true, show: s => s.mode !== 'quote' && s.complexity !== 'code' },
  { key: 'numbers', label: 'numbers', toggle: true, show: s => s.mode !== 'quote' && s.complexity !== 'code' },
  { key: 'cruelty', label: 'feedback', options: ['mild', 'standard', 'unhinged', 'silent'], optionLabels: CRUELTY_LABELS },
  { key: 'injection', label: 'surprises', toggle: true, show: s => s.mode !== 'quote' && s.cruelty !== 'silent' },
  { key: 'liveWpm', label: 'live stats', toggle: true },
  { key: 'sound', label: 'sound', toggle: true },
];

function applySetting(key, value) {
  S.set[key] = value;
  save();
  renderSettings();
  newTest();
}

function renderSettings() {
  el.bar.textContent = '';
  for (const def of SETTING_DEFS) {
    if (def.show && !def.show(S.set)) continue;
    const group = document.createElement('div');
    group.className = 'set-group ' + (def.toggle ? 'toggle' : 'radio');
    if (def.toggle) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.setAttribute('role', 'switch');
      b.setAttribute('aria-checked', String(!!S.set[def.key]));
      b.textContent = def.label;
      b.addEventListener('click', e => {
        applySetting(def.key, !S.set[def.key]);
        if (e.detail === 0) { // keyboard activation: keep focus on the switch
          const sw = [...el.bar.querySelectorAll('[role="switch"]')].find(x => x.textContent === def.label);
          if (sw) sw.focus();
        }
      });
      group.appendChild(b);
    } else {
      const lab = document.createElement('span');
      lab.className = 'group-label';
      lab.textContent = def.label;
      group.appendChild(lab);
      const row = document.createElement('div');
      row.className = 'chip-row';
      group.appendChild(row);
      group.setAttribute('role', 'radiogroup');
      group.setAttribute('aria-label', def.label);
      def.options.forEach(opt => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'chip';
        b.setAttribute('role', 'radio');
        const selected = S.set[def.key] === opt;
        b.setAttribute('aria-checked', String(selected));
        b.tabIndex = selected ? 0 : -1; // roving tabindex per radio group
        b.textContent = (def.optionLabels && def.optionLabels[opt]) || String(opt);
        b.addEventListener('click', () => applySetting(def.key, opt));
        row.appendChild(b);
      });
      group.addEventListener('keydown', e => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault();
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        const i = def.options.indexOf(S.set[def.key]);
        const next = def.options[(i + dir + def.options.length) % def.options.length];
        applySetting(def.key, next);
        // re-render replaced the buttons; put focus on the new selection
        const groups = el.bar.querySelectorAll('[role="radiogroup"]');
        for (const gEl of groups) {
          if (gEl.getAttribute('aria-label') === def.label) {
            const sel = gEl.querySelector('[aria-checked="true"]');
            if (sel) sel.focus();
          }
        }
      });
    }
    el.bar.appendChild(group);
  }
}

/* ================================================================
   GLOBAL KEY + FOCUS HANDLING
   ================================================================ */

const RESULTS_GRACE = 900;          // ms after results appear during which restart/next is ignored
const HOLD_MS = 650;                // hold Tab this long, mid-test, to wind up a reset
const RESET_PAUSE = 500;            // ms beat after a hold-reset before a still-held Tab can fire again
const RING_CIRC = 2 * Math.PI * 52; // circumference of the r=52 progress ring

// swallow keystrokes for a beat after results render, so momentum typing at the
// end of a round can't immediately trigger a new test and blow past the stats
function resultsLocked() {
  return !el.results.hidden && performance.now() - S.resultsAt < RESULTS_GRACE;
}

/* ---- hold-to-reset: a centered charging ring winds up over HOLD_MS. releasing
   early winds it back down and cancels; only a completed hold resets the test.
   rAF-driven, so it stays smooth and never resets on a single stray tap. ---- */
let holdStart = 0, holdRaf = 0, holdReleasing = false, releaseFrom = 0, releaseStart = 0;
let resetPauseUntil = 0;                    // set after a hold-reset; blocks auto-repeat resets for a beat
let holdC0 = '#8b97ad', holdC1 = '#d9534f'; // ring colours (accent → error), captured per-theme at beginHold

function beginHold() {
  if (holdStart || holdReleasing) return;      // already winding
  if (!(S.running && !S.finished)) return;      // only mid-run
  holdStart = performance.now();
  holdC0 = cssVar('--accent'); holdC1 = cssVar('--error'); // freeze theme colours for this hold
  el.resetLabel.textContent = 'hold to reset';
  el.resetOverlay.classList.remove('complete');
  el.resetOverlay.hidden = false;
  requestAnimationFrame(() => el.resetOverlay.classList.add('in'));
  holdRaf = requestAnimationFrame(holdTick);
}

// map linear time-progress → visual progress with a strong ease-out, so the
// ring fills and grows fast at first, then crawls — "struggles" — as it nears
// the reset. purely cosmetic: the reset itself still fires at HOLD_MS exactly.
function visualEase(p) { return 1 - (1 - p) * (1 - p); }

function holdTick() {
  const now = performance.now();
  if (holdReleasing) {
    const rp = Math.min(1, (now - releaseStart) / 220);
    drawRing(releaseFrom * (1 - rp * (2 - rp)));  // ease-out wind-down to zero
    if (rp >= 1) { endHoldVisual(); return; }
  } else {
    const p = Math.min(1, (now - holdStart) / HOLD_MS);
    drawRing(visualEase(p));                        // visual eased; completion still keyed on raw p
    if (p >= 1) { completeHold(); return; }
  }
  holdRaf = requestAnimationFrame(holdTick);
}

// v is the already-eased visual progress [0..1]
function drawRing(v) {
  el.resetArc.style.strokeDashoffset = RING_CIRC * (1 - v);
  el.resetArc.style.stroke = lerpHex(holdC0, holdC1, v); // accent → alarm red as it charges
  el.resetGlow.style.opacity = 0.12 + v * 0.55;
  // the ring swells as it charges; because v is eased, the growth visibly slows
  // near the end (skipped under reduced motion)
  el.resetRing.style.transform = reduceMotion ? '' : `scale(${1 + v * 0.16})`;
}

function completeHold() {
  drawRing(1);
  el.resetLabel.textContent = 'reset';
  el.resetOverlay.classList.add('complete');
  cancelAnimationFrame(holdRaf);
  holdRaf = 0; holdStart = 0; holdReleasing = false;
  // let the burst play for a beat, then spin up the fresh test
  setTimeout(() => {
    el.resetOverlay.hidden = true;
    el.resetOverlay.classList.remove('in', 'complete');
    newTest();
    // hold the line for a beat so a still-pressed Tab doesn't immediately
    // steamroll into the next reset and kill the effect
    resetPauseUntil = performance.now() + RESET_PAUSE;
  }, 170);
}

function releaseHold() {
  if (!holdStart || holdReleasing) return;
  holdReleasing = true;
  releaseStart = performance.now();
  releaseFrom = visualEase(Math.min(1, (releaseStart - holdStart) / HOLD_MS)); // wind down from the shown value
}

// hard-cancel with no wind-down (used when the run ends or a new test starts)
function abortHold() {
  if (!holdStart && !holdReleasing && el.resetOverlay.hidden) return;
  endHoldVisual();
}

function endHoldVisual() {
  cancelAnimationFrame(holdRaf);
  holdRaf = 0; holdStart = 0; holdReleasing = false;
  el.resetOverlay.classList.remove('in', 'complete');
  el.resetOverlay.hidden = true;
  drawRing(0);
}

document.addEventListener('keydown', e => {
  const resultsOpen = !el.results.hidden;
  if ((e.key === 'Tab' && !e.shiftKey) || e.key === 'Escape') {
    e.preventDefault();
    if (resultsOpen) {
      if (!resultsLocked()) newTest();       // fresh start once the stats have settled
    } else if (S.running && !S.finished) {
      // mid-run: only Tab, HELD, resets. a stray tap does nothing, and Esc is
      // inert here on purpose so it can't nuke a run by accident.
      if (e.key === 'Tab' && !e.repeat) beginHold();
    } else if (performance.now() >= resetPauseUntil) {
      newTest();                              // nothing started yet — just reshuffle (after any post-reset pause)
    }
    return;
  }
  const inWidgets = e.target.closest && e.target.closest('.settings, .results, .theme-toggle');
  if (inWidgets && ['Enter', ' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    // block the focused results button from firing during the grace window
    if (resultsOpen && (e.key === 'Enter' || e.key === ' ') && resultsLocked()) { e.preventDefault(); return; }
    return;
  }
  if (resultsOpen) {
    if (e.key === 'Enter' && !resultsLocked()) { e.preventDefault(); newTest(); }
    return;
  }
  if (e.key === 'Backspace') {
    e.preventDefault();
    handleBackspace(e.ctrlKey || e.metaKey);
    if (document.activeElement !== el.ghost) el.ghost.focus();
    return;
  }
  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
    e.preventDefault();
    keyEventTime = e.timeStamp || performance.now(); // for jitter-free sound scheduling
    if (document.activeElement !== el.ghost) el.ghost.focus();
    handleChar(e.key);
  }
});

// mobile/IME path: desktop keydowns are preventDefault-ed above, so the
// input event only fires for soft keyboards — no double handling
el.ghost.addEventListener('input', e => {
  keyEventTime = e.timeStamp || performance.now();
  if (e.inputType === 'insertText' && e.data) {
    for (const ch of e.data) handleChar(ch);
  } else if (e.inputType === 'deleteContentBackward') {
    handleBackspace(false);
  } else if (e.inputType === 'deleteWordBackward') {
    handleBackspace(true);
  }
  el.ghost.value = '';
});

el.ghost.addEventListener('focus', () => {
  el.area.classList.remove('unfocused');
  el.overlay.hidden = true;
});
el.ghost.addEventListener('blur', () => {
  body.classList.remove('engaged');
  if (!el.results.hidden) return;
  el.area.classList.add('unfocused');
  el.overlay.hidden = false;
});
el.area.addEventListener('mousedown', e => { e.preventDefault(); el.ghost.focus(); });
// keep the ghost input focused when settings are clicked with the mouse;
// keyboard focus (shift-tab / arrows) is unaffected
el.bar.addEventListener('mousedown', e => e.preventDefault());

// releasing Tab before the ring fills cancels the reset; blurring the window
// (e.g. alt-tab while holding) also cancels so the ring can't get stuck on
document.addEventListener('keyup', e => { if (e.key === 'Tab') releaseHold(); });
window.addEventListener('blur', abortHold);

document.addEventListener('mousemove', () => body.classList.remove('engaged'), { passive: true });
window.addEventListener('resize', () => { S.lineH = 0; scheduleCaret(); });

$('btnNext').addEventListener('click', () => { if (!resultsLocked()) newTest(); });
$('btnRepeat').addEventListener('click', () => { if (!resultsLocked()) newTest(true); });
$('btnSettings').addEventListener('click', () => {
  if (resultsLocked()) return;
  newTest();
  const first = el.bar.querySelector('.chip');
  if (first) first.focus();
});

/* ================================================================
   THEME
   ================================================================ */

const ICON_SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M4 12H2M22 12h-2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"/></svg>';
const ICON_MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 13.2A8.3 8.3 0 1 1 10.8 3.5a6.5 6.5 0 0 0 9.7 9.7z"/></svg>';

function applyTheme(theme) {
  const light = theme === 'light';
  document.documentElement.classList.toggle('light', light);
  // icon shows the current theme; label states the action
  el.themeToggle.innerHTML = light ? ICON_SUN : ICON_MOON;
  el.themeToggle.setAttribute('aria-label', light ? 'switch to dark theme' : 'switch to light theme');
}

// don't steal focus from the typing input when clicking the toggle mid-test
el.themeToggle.addEventListener('mousedown', e => e.preventDefault());
el.themeToggle.addEventListener('click', () => {
  store.theme = store.theme === 'light' ? 'dark' : 'light';
  save();
  document.documentElement.classList.add('theme-anim');
  applyTheme(store.theme);
  setTimeout(() => document.documentElement.classList.remove('theme-anim'), 260);
});

/* ================================================================
   INIT
   ================================================================ */

applyTheme(store.theme);
renderSettings();
newTest();

})();
