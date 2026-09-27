/* =========================================================================
   Cyber404 Career Finder — script.js
   -------------------------------------------------------------------------
   Everything in this file runs entirely in the browser. No data ever
   leaves the page: answers are kept in memory only and are erased the
   moment the tab is closed or the quiz is reset.

   File map (search for these section headers):
     1. CAREER TRACK DATA
     2. QUIZ QUESTION DATA
     3. TRACK ICONS
     4. APPLICATION STATE
     5. DOM ELEMENT CACHE
     6. INITIALIZATION
     7. SCREEN NAVIGATION
     8. HOME SCREEN RENDERING
     9. QUIZ FLOW (startQuiz, showQuestion, selectAnswer, next/previous)
    10. RESULT CALCULATION (calculateResults)
    11. RESULT RENDERING (showResults + helpers)
    12. RESET
    13. SHARE
    14. SMALL UTILITIES
   ========================================================================= */


/* =========================================================================
   1. CAREER TRACK DATA
   -------------------------------------------------------------------------
   This is the single source of truth for the five career tracks. Every
   piece of UI copy about a track (its name, description, skills list and
   roadmap) is pulled from this object, so updating a track only ever
   requires editing it in one place.
   ========================================================================= */

// Fixed display order used throughout the app (charts, "explore other
// tracks" lists, etc.) so the UI is predictable rather than re-sorting
// itself unexpectedly.
const TRACK_ORDER = ["BLUE", "RED", "DFIR", "APPCLOUD", "GRC"];

const CAREER_TRACKS = {
  BLUE: {
    id: "BLUE",
    name: "Blue Team / SOC",
    short: "Blue Team",
    color: "#38BDF8",
    emoji: "🛡️",
    description:
      "People interested in monitoring systems, analyzing alerts and logs, detecting suspicious activity, investigating security events and defending organizations.",
    whyText:
      "You're drawn to keeping a constant watch over systems, catching suspicious activity early, and defending organizations before small issues turn into big ones.",
    strengths: [
      "Monitoring systems and spotting anomalies",
      "Investigating suspicious activity",
      "Working with logs and security alerts",
      "Reacting quickly and calmly under pressure",
      "Defensive, protect-and-detect thinking"
    ],
    skills: [
      "Networking",
      "Linux",
      "Windows",
      "SIEM",
      "Log Analysis",
      "Threat Detection",
      "Incident Handling",
      "Security Monitoring"
    ],
    roadmap: [
      "Networking Fundamentals",
      "Linux & Windows Fundamentals",
      "Cybersecurity Fundamentals",
      "Logs & Security Events",
      "SIEM",
      "SOC Labs",
      "Blue Team / SOC"
    ]
  },

  RED: {
    id: "RED",
    name: "Red Team / Offensive Security",
    short: "Red Team",
    color: "#F16472",
    emoji: "🎯",
    description:
      "People interested in finding vulnerabilities, understanding how attacks work, testing systems ethically and thinking like an attacker.",
    whyText:
      "You're drawn to thinking like an attacker: probing systems for weaknesses, testing defenses on purpose, and understanding exactly how a break-in happens.",
    strengths: [
      "Thinking like an attacker",
      "Finding weaknesses before they're exploited",
      "Hands-on technical experimentation",
      "Curiosity about how systems break",
      "Offensive, adversarial problem-solving"
    ],
    skills: [
      "Networking",
      "Linux",
      "Web Fundamentals",
      "Nmap",
      "Burp Suite",
      "OWASP",
      "Vulnerability Assessment",
      "Privilege Escalation",
      "Penetration Testing"
    ],
    roadmap: [
      "Networking",
      "Linux",
      "Web Fundamentals",
      "Security Fundamentals",
      "Reconnaissance",
      "Web Security",
      "Vulnerability Assessment",
      "Pentesting Labs",
      "Offensive Security"
    ]
  },

  DFIR: {
    id: "DFIR",
    name: "Digital Forensics & Incident Response",
    short: "DFIR",
    color: "#B79CFB",
    emoji: "🕵️",
    description:
      "People interested in investigating what happened after a security incident, analyzing evidence, recovering information and reconstructing events.",
    whyText:
      "You're drawn to the investigative side of security: recovering evidence, reconstructing timelines, and working out exactly what happened after an incident.",
    strengths: [
      "Investigating after an incident occurs",
      "Piecing together digital evidence",
      "Reconstructing timelines from data",
      "Attention to detail and precision",
      "Methodical, evidence-driven thinking"
    ],
    skills: [
      "Operating Systems",
      "File Systems",
      "Digital Evidence",
      "Disk Forensics",
      "Memory Forensics",
      "Timeline Analysis",
      "Incident Response",
      "Autopsy",
      "Evidence Handling"
    ],
    roadmap: [
      "Operating Systems",
      "File Systems",
      "Digital Evidence",
      "Disk Forensics",
      "Memory Forensics",
      "Timeline Analysis",
      "Incident Response",
      "DFIR Labs"
    ]
  },

  APPCLOUD: {
    id: "APPCLOUD",
    name: "Application & Cloud Security",
    short: "App & Cloud",
    color: "#34D399",
    emoji: "☁️",
    description:
      "People interested in securing applications, APIs, cloud infrastructure and software development environments.",
    whyText:
      "You're drawn to the intersection of building and securing: making sure applications, APIs and cloud systems are safe by design, not as an afterthought.",
    strengths: [
      "Interest in how software and cloud systems are built",
      "Securing applications and APIs",
      "Comfort with modern development environments",
      "Preventing issues before they reach production",
      "Bridging security with engineering"
    ],
    skills: [
      "HTML",
      "JavaScript",
      "HTTP",
      "Web Architecture",
      "OWASP Top 10",
      "API Security",
      "Cloud Fundamentals",
      "AWS/Azure/GCP Security",
      "Secure Coding",
      "DevSecOps"
    ],
    roadmap: [
      "Programming/Web Fundamentals",
      "HTTP & Web Architecture",
      "Application Security",
      "OWASP",
      "API Security",
      "Cloud Fundamentals",
      "Cloud Security",
      "DevSecOps"
    ]
  },

  GRC: {
    id: "GRC",
    name: "GRC & Security Management",
    short: "GRC",
    color: "#FBBF6A",
    emoji: "📋",
    description:
      "People interested in risk management, security policies, compliance frameworks, audits, governance and organizational security.",
    whyText:
      "You're drawn to the bigger picture: managing risk, shaping policy, and making sure security decisions actually align with how an organization operates.",
    strengths: [
      "Understanding risk at an organizational level",
      "Interest in policies, standards and frameworks",
      "Clear written and verbal communication",
      "Big-picture, strategic thinking",
      "Aligning security with business goals"
    ],
    skills: [
      "Risk Management",
      "Security Policies",
      "Governance",
      "Compliance",
      "Auditing",
      "NIST",
      "ISO 27001",
      "Security Controls",
      "Documentation",
      "Communication"
    ],
    roadmap: [
      "Cybersecurity Fundamentals",
      "Risk Management",
      "Security Policies",
      "Security Controls",
      "NIST / ISO 27001",
      "Compliance",
      "Auditing",
      "GRC"
    ]
  }
};


/* =========================================================================
   2. QUIZ QUESTION DATA
   -------------------------------------------------------------------------
   15 questions, each with exactly 4 options. Every option carries a
   "scores" object that awards weighted points to one or more of the five
   tracks (BLUE, RED, DFIR, APPCLOUD, GRC).

   Balance note: across the full set of 15 questions, every track has a
   "full-weight" (3-point) option in exactly 12 questions and is absent
   from the other 3 — so every track has the exact same maximum possible
   score (see computeMaxPossiblePerTrack). This is what keeps the quiz
   from favoring one track just because it appears more often.

   "theme" is a short label describing what the question is really
   probing. It's used on the results page to point to a couple of the
   specific questions that most shaped the user's top match.
   ========================================================================= */

const QUESTIONS = [
  {
    id: 1,
    theme: "core interests",
    text: "🖥️ Imagine your first day working in cybersecurity. Which job sounds most fun to you?",
    options: [
      { text: "👀 Watching computers all day and stopping bad guys before they cause harm", scores: { BLUE: 3, DFIR: 1 } },
      { text: "🔓 Trying to break into systems like a hacker, to find weak spots first", scores: { RED: 3 } },
      { text: "🧩 Figuring out exactly what happened after something bad already happened", scores: { DFIR: 3, BLUE: 1 } },
      { text: "📋 Helping a company understand its risks and stay safe overall", scores: { GRC: 3 } }
    ]
  },
  {
    id: 2,
    theme: "problem-solving style",
    text: "🧩 Which of these puzzles sounds the most fun to solve?",
    options: [
      { text: "🔍 Finding one weird line hidden inside thousands of computer records", scores: { BLUE: 3, DFIR: 1 } },
      { text: "🐞 Spotting the one mistake a programmer left in an app by accident", scores: { APPCLOUD: 3, RED: 2 } },
      { text: "🧵 Putting together a full story from small, scattered clues", scores: { DFIR: 3 } },
      { text: "🎯 Working out exactly how a hacker's trick worked", scores: { RED: 3, BLUE: 1 } }
    ]
  },
  {
    id: 3,
    theme: "incident investigation",
    text: "🚨 A company sees something strange happening on one of its computers. Which part would you want to handle?",
    options: [
      { text: "📜 Going through alerts and records to find out what caused it", scores: { BLUE: 3, DFIR: 1 } },
      { text: "🔎 Checking the computer itself for clues about what happened", scores: { DFIR: 3, BLUE: 1 } },
      { text: "💻 Checking if the app running on it had a bug that let this happen", scores: { APPCLOUD: 3 } },
      { text: "📋 Reviewing which safety rule should have stopped this earlier", scores: { GRC: 3, BLUE: 1 } }
    ]
  },
  {
    id: 4,
    theme: "defensive instincts",
    text: "📊 You're looking at a screen full of security warnings. What's your first move?",
    options: [
      { text: "⚡ Quickly sort out which warnings are real dangers and which aren't", scores: { BLUE: 3 } },
      { text: "🥷 Think like a hacker — how would they sneak past this exact setup?", scores: { RED: 3, BLUE: 1 } },
      { text: "⚙️ Check if the warnings mean an app or service is set up wrong", scores: { APPCLOUD: 3, BLUE: 1 } },
      { text: "📋 Ask if so many warnings means a rule needs to change", scores: { GRC: 3 } }
    ]
  },
  {
    id: 5,
    theme: "attacker mindset",
    text: "😈 What's the most interesting part of hacking to you?",
    options: [
      { text: "🔓 The actual tricks hackers use to break into systems", scores: { RED: 3 } },
      { text: "🕵️ How investigators track a hacker's footsteps after an attack", scores: { DFIR: 3, RED: 1 } },
      { text: "🐛 How just one bad line of code can let hackers in", scores: { APPCLOUD: 3, RED: 1 } },
      { text: "⚖️ How companies decide which threats to worry about first", scores: { GRC: 3 } }
    ]
  },
  {
    id: 6,
    theme: "digital evidence",
    text: "💻 You get a laptop that was used in a cyber attack. What sounds most fun to dig into?",
    options: [
      { text: "🗂️ Recovering deleted files to see exactly what the user did", scores: { DFIR: 3 } },
      { text: "👁️ Checking if security tools noticed the attack while it happened", scores: { BLUE: 3, DFIR: 1 } },
      { text: "📲 Finding out if a risky app on the laptop caused the attack", scores: { APPCLOUD: 3, DFIR: 1 } },
      { text: "📝 Writing a clear report that explains exactly what you found", scores: { GRC: 3, DFIR: 1 } }
    ]
  },
  {
    id: 7,
    theme: "building & breaking software",
    text: "🛠️ Which project would you rather join?",
    options: [
      { text: "🕳️ Testing a brand-new app to find hidden security problems before it launches", scores: { RED: 3, APPCLOUD: 2 } },
      { text: "🤖 Building tools that automatically catch unsafe code before it goes live", scores: { APPCLOUD: 3 } },
      { text: "📈 Watching a website's traffic to spot people trying to misuse it", scores: { BLUE: 3, APPCLOUD: 1 } },
      { text: "🔌 Investigating an attack that started from one risky plugin", scores: { DFIR: 3, APPCLOUD: 1 } }
    ]
  },
  {
    id: 8,
    theme: "cloud & modern infrastructure",
    text: "☁️ A company is moving everything to the cloud. Which part of that interests you most?",
    options: [
      { text: "🔧 Setting everything up safely and correctly from the very start", scores: { APPCLOUD: 3 } },
      { text: "👀 Watching the new setup closely for anything unusual", scores: { BLUE: 3, APPCLOUD: 1 } },
      { text: "🧨 Testing the new setup for weak spots before hackers find them", scores: { RED: 3, APPCLOUD: 1 } },
      { text: "📋 Deciding clearly who is responsible for keeping what secure", scores: { GRC: 3, APPCLOUD: 1 } }
    ]
  },
  {
    id: 9,
    theme: "governance & risk",
    text: "⚖️ Which of these jobs sounds most satisfying to you?",
    options: [
      { text: "🥇 Deciding which security risks a company should fix first", scores: { GRC: 3 } },
      { text: "📏 Checking whether an incident broke one of the company's rules", scores: { DFIR: 3, GRC: 1 } },
      { text: "🔔 Watching for early warning signs that something is about to fail", scores: { BLUE: 3, GRC: 1 } },
      { text: "🕳️ Working out exactly how a missing rule let a hacker succeed", scores: { RED: 3, GRC: 1 } }
    ]
  },
  {
    id: 10,
    theme: "working style",
    text: "🗓️ Which kind of workday sounds best to you?",
    options: [
      { text: "🧠 Spending hours alone, deeply focused on one tricky problem", scores: { RED: 3 } },
      { text: "📁 Carefully turning evidence you found into a clear, detailed report", scores: { DFIR: 3 } },
      { text: "📜 Writing and improving the rules that keep a company safe", scores: { GRC: 3 } },
      { text: "🔧 Building tools that catch unsafe code before it's ever used", scores: { APPCLOUD: 3 } }
    ]
  },
  {
    id: 11,
    theme: "learning preferences",
    text: "📚 When learning something new in tech, what do you enjoy most?",
    options: [
      { text: "🖥️ Setting up your own mini computer lab and watching how it behaves", scores: { BLUE: 3 } },
      { text: "💥 Breaking something on purpose, just to see how and why it fails", scores: { RED: 3 } },
      { text: "🏗️ Building small projects, then making them harder to break", scores: { APPCLOUD: 3, RED: 1 } },
      { text: "📖 Reading guides and best practices to understand the \"right\" way", scores: { GRC: 3 } }
    ]
  },
  {
    id: 12,
    theme: "incident response",
    text: "🚑 A cyber attack is happening right now. Which task would you jump in for?",
    options: [
      { text: "📶 Watching the network to see if the hacker is still inside", scores: { BLUE: 3 } },
      { text: "🔑 Figuring out exactly how the hacker got in", scores: { RED: 3, APPCLOUD: 1 } },
      { text: "🧊 Keeping the affected computers untouched so evidence isn't lost", scores: { DFIR: 3 } },
      { text: "🩹 Checking if the software needs an urgent fix right now", scores: { APPCLOUD: 3, RED: 1 } }
    ]
  },
  {
    id: 13,
    theme: "preferred output",
    text: "🏆 Which result would you be most proud to create?",
    options: [
      { text: "🚨 An alert that stops an attack the moment it's happening", scores: { BLUE: 3 } },
      { text: "🎯 A working demo that proves a security weakness is real", scores: { RED: 3 } },
      { text: "🗺️ A clear timeline that shows exactly what happened, step by step", scores: { DFIR: 3 } },
      { text: "📊 A report that helps company leaders make a smart decision", scores: { GRC: 3 } }
    ]
  },
  {
    id: 14,
    theme: "reading about breaches",
    text: "📰 You read a news story about a big company getting hacked. What catches your eye first?",
    options: [
      { text: "🔓 The exact trick the hackers used to break in", scores: { RED: 3 } },
      { text: "🕵️ How investigators figured out what data was actually stolen", scores: { DFIR: 3 } },
      { text: "🧱 Which old or unfixed software made the hack possible", scores: { APPCLOUD: 3 } },
      { text: "💸 The fines and trouble the company now faces", scores: { GRC: 3 } }
    ]
  },
  {
    id: 15,
    theme: "long-term direction",
    text: "🔮 A few years from now, what would you love to be known for?",
    options: [
      { text: "🛡️ The person your team trusts to catch threats first", scores: { BLUE: 3 } },
      { text: "🔍 The expert who can figure out any incident from the evidence", scores: { DFIR: 3 } },
      { text: "☁️ The specialist who keeps apps and cloud systems safe", scores: { APPCLOUD: 3 } },
      { text: "🧭 The person who guides how a company handles risk", scores: { GRC: 3 } }
    ]
  }
];


/* =========================================================================
   3. TRACK ICONS
   -------------------------------------------------------------------------
   Small hand-drawn line icons (no external icon library) used on the
   home screen track cards and the results screen. Each is a simple
   24x24 SVG that inherits its color from CSS (currentColor).
   ========================================================================= */

const TRACK_ICONS = {
  BLUE:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z"/><path d="M9 12.2l2 2 4-4.2"/></svg>',
  RED:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.6"/><path d="M12 1.6v3M12 19.4v3M1.6 12h3M19.4 12h3"/></svg>',
  DFIR:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="2.5" width="10.5" height="14" rx="1.2"/><path d="M6.8 6.5h5M6.8 9.5h5M6.8 12.5h2.5"/><circle cx="16" cy="16" r="3.6"/><path d="M18.6 18.6L21.5 21.5"/></svg>',
  APPCLOUD:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.2 18a4 4 0 01-.4-7.98A5 5 0 0116.9 8.3 4.4 4.4 0 0117.4 18H7.2z"/><path d="M9.8 12.2l-1.6 1.6 1.6 1.6M14.2 12.2l1.6 1.6-1.6 1.6"/></svg>',
  GRC:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5.5" y="4" width="13" height="17" rx="1.6"/><rect x="9" y="2" width="6" height="3.2" rx="0.8"/><path d="M8.5 12.8l2.3 2.3 4.7-5"/></svg>'
};


/* =========================================================================
   4. APPLICATION STATE
   -------------------------------------------------------------------------
   All quiz state lives in this one object, in memory only. Nothing here
   is written to cookies, localStorage or any server.
   ========================================================================= */

const quizState = {
  currentQuestionIndex: 0,
  // answers[i] holds the selected option index (0-3) for QUESTIONS[i],
  // or null if that question hasn't been answered yet.
  answers: new Array(QUESTIONS.length).fill(null),
  lastResults: null, // populated by calculateResults() once the quiz ends
  // Entered once on the home screen, kept in memory only (never sent
  // anywhere) and reused on retake so the person isn't asked twice.
  userName: ""
};


/* =========================================================================
   5. DOM ELEMENT CACHE
   -------------------------------------------------------------------------
   Populated once in init() so the rest of the code doesn't repeatedly
   query the DOM.
   ========================================================================= */

const dom = {};

function cacheDomElements() {
  dom.screens = {
    home: document.getElementById("screen-home"),
    quiz: document.getElementById("screen-quiz"),
    results: document.getElementById("screen-results")
  };

  dom.startButton = document.getElementById("start-quiz-btn");
  dom.trackPreviewGrid = document.getElementById("track-preview-grid");
  dom.nameInput = document.getElementById("user-name-input");
  dom.nameError = document.getElementById("name-entry-error");

  dom.questionCounter = document.getElementById("question-counter");
  dom.progressBar = document.getElementById("progress-bar");
  dom.progressFill = document.getElementById("progress-fill");
  dom.questionFieldset = document.getElementById("question-fieldset");
  dom.questionLegend = document.getElementById("question-legend");
  dom.optionsContainer = document.getElementById("options-container");
  dom.validationMessage = document.getElementById("validation-message");
  dom.backButton = document.getElementById("back-btn");
  dom.nextButton = document.getElementById("next-btn");

  dom.resultsContent = document.getElementById("results-content");
  dom.retakeButton = document.getElementById("retake-btn");
  dom.downloadButton = document.getElementById("download-btn");
  dom.shareButton = document.getElementById("share-btn");
  dom.actionStatus = document.getElementById("action-status");

  dom.confettiCanvas = document.getElementById("confetti-canvas");
}


/* =========================================================================
   6. INITIALIZATION
   ========================================================================= */

function init() {
  cacheDomElements();
  renderTrackPreviews();

  dom.startButton.addEventListener("click", handleStartClick);
  dom.nameInput.addEventListener("input", hideNameError);
  dom.nameInput.addEventListener("keydown", (event) => {
    // The name field isn't inside a <form>, so Enter never submits
    // anything on its own — we just use it as a shortcut for "Start".
    if (event.key === "Enter") {
      event.preventDefault();
      handleStartClick();
    }
  });

  dom.backButton.addEventListener("click", previousQuestion);
  dom.nextButton.addEventListener("click", nextQuestion);
  dom.retakeButton.addEventListener("click", resetQuiz);
  dom.downloadButton.addEventListener("click", downloadResultImage);
  dom.shareButton.addEventListener("click", shareResult);

  // Event delegation: one listener handles clicks/changes for whichever
  // 4 options happen to be rendered for the current question.
  dom.optionsContainer.addEventListener("change", (event) => {
    if (event.target && event.target.name === "quiz-option") {
      selectAnswer(Number(event.target.value));
    }
  });

  showScreen("home");
}

document.addEventListener("DOMContentLoaded", init);


/* =========================================================================
   7. SCREEN NAVIGATION
   -------------------------------------------------------------------------
   Only one of the three top-level screens is visible at a time. We use
   the native `hidden` attribute rather than custom CSS classes — it's
   supported everywhere and keeps the CSS simple.
   ========================================================================= */

function showScreen(name) {
  Object.keys(dom.screens).forEach((key) => {
    dom.screens[key].hidden = key !== name;
  });
  // Move focus to the newly shown screen's heading so keyboard and
  // screen-reader users land somewhere sensible after a navigation.
  const heading = dom.screens[name].querySelector("h1, h2");
  if (heading) {
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: false });
  }
  window.scrollTo({ top: 0, behavior: "auto" });
}


/* =========================================================================
   8. HOME SCREEN RENDERING
   ========================================================================= */

function renderTrackPreviews() {
  const cards = TRACK_ORDER.map((trackId) => {
    const track = CAREER_TRACKS[trackId];
    return `
      <li class="track-card" style="--track-color:${track.color}">
        <span class="track-card__icon">${TRACK_ICONS[trackId]}</span>
        <span class="track-card__name">${track.name}</span>
        <span class="track-card__desc">${track.description}</span>
      </li>`;
  }).join("");

  dom.trackPreviewGrid.innerHTML = cards;
}


/* =========================================================================
   9. QUIZ FLOW
   ========================================================================= */

// Requires a name before the quiz can start (it's shown back to the
// person on the results screen and baked into their downloadable image).
function handleStartClick() {
  const enteredName = dom.nameInput.value.trim();
  if (!enteredName) {
    showNameError();
    return;
  }
  quizState.userName = enteredName;
  hideNameError();
  startQuiz();
}

function showNameError() {
  dom.nameInput.classList.add("has-error");
  dom.nameInput.setAttribute("aria-invalid", "true");
  dom.nameError.hidden = false;
  dom.nameInput.focus();
}

function hideNameError() {
  dom.nameInput.classList.remove("has-error");
  dom.nameInput.removeAttribute("aria-invalid");
  dom.nameError.hidden = true;
}

function startQuiz() {
  quizState.currentQuestionIndex = 0;
  quizState.answers = new Array(QUESTIONS.length).fill(null);
  showScreen("quiz");
  showQuestion(0);
}

// Renders the question at `index` and restores any previously selected
// answer for it (used both going forward and going back).
function showQuestion(index) {
  const question = QUESTIONS[index];
  const total = QUESTIONS.length;

  // Progress text + bar
  const greeting = quizState.userName ? `Hi ${quizState.userName} — ` : "";
  dom.questionCounter.textContent = `${greeting}Question ${index + 1} of ${total}`;
  const progressPercent = Math.round(((index + 1) / total) * 100);
  dom.progressFill.style.width = `${progressPercent}%`;
  dom.progressBar.setAttribute("aria-valuenow", String(index + 1));
  dom.progressBar.setAttribute(
    "aria-valuetext",
    `Question ${index + 1} of ${total}`
  );

  // Question text
  dom.questionLegend.textContent = question.text;

  // Options — rebuilt each time so restoring a previous answer is trivial.
  const previousAnswer = quizState.answers[index];
  dom.optionsContainer.innerHTML = question.options
    .map((option, optionIndex) => {
      const optionId = `q${index}-opt${optionIndex}`;
      const isChecked = previousAnswer === optionIndex;
      return `
        <label class="option-card${isChecked ? " is-selected" : ""}" for="${optionId}">
          <input
            type="radio"
            name="quiz-option"
            id="${optionId}"
            value="${optionIndex}"
            ${isChecked ? "checked" : ""}
          />
          <span class="option-card__marker" aria-hidden="true"></span>
          <span class="option-card__text">${option.text}</span>
        </label>`;
    })
    .join("");

  // Re-apply the "selected" look via JS as well, so it isn't dependent
  // on any single CSS selector working in every browser.
  highlightSelectedOption();

  // Navigation button states
  dom.backButton.disabled = index === 0;
  dom.nextButton.textContent = index === total - 1 ? "🏆 See My Results" : "Next ➡️";
  dom.nextButton.setAttribute(
    "aria-label",
    index === total - 1 ? "See my results" : "Next question"
  );

  hideValidationMessage();
}

// Adds/removes the .is-selected class based on which radio is checked.
// Kept separate from showQuestion so selectAnswer() can reuse it.
function highlightSelectedOption() {
  const labels = dom.optionsContainer.querySelectorAll(".option-card");
  labels.forEach((label) => {
    const input = label.querySelector("input");
    label.classList.toggle("is-selected", input.checked);
  });
}

// Called whenever the user picks an option (click anywhere on the card,
// or keyboard selection of the underlying radio input).
function selectAnswer(optionIndex) {
  quizState.answers[quizState.currentQuestionIndex] = optionIndex;
  highlightSelectedOption();
  hideValidationMessage();
}

function nextQuestion() {
  const currentIndex = quizState.currentQuestionIndex;

  if (quizState.answers[currentIndex] === null) {
    showValidationMessage();
    return;
  }

  const isLastQuestion = currentIndex === QUESTIONS.length - 1;

  if (isLastQuestion) {
    const results = calculateResults();
    quizState.lastResults = results;
    showResults(results);
  } else {
    quizState.currentQuestionIndex += 1;
    showQuestion(quizState.currentQuestionIndex);
  }
}

function previousQuestion() {
  if (quizState.currentQuestionIndex === 0) return;
  quizState.currentQuestionIndex -= 1;
  showQuestion(quizState.currentQuestionIndex);
}

function showValidationMessage() {
  dom.validationMessage.textContent = "⚠️ Please select an option to continue.";
  dom.validationMessage.hidden = false;
}

function hideValidationMessage() {
  dom.validationMessage.hidden = true;
  dom.validationMessage.textContent = "";
}


/* =========================================================================
   10. RESULT CALCULATION
   -------------------------------------------------------------------------
   Pure functions — no DOM access — so the scoring logic can be reasoned
   about (and tested) independently of how it's displayed.
   ========================================================================= */

// For each track, the highest score it could possibly reach is the sum,
// across every question, of that question's best-scoring option for the
// track. Computing this from QUESTIONS (rather than hard-coding it)
// means the numbers always stay correct even if questions are edited
// later.
function computeMaxPossiblePerTrack() {
  const max = {};
  TRACK_ORDER.forEach((trackId) => {
    max[trackId] = 0;
  });

  QUESTIONS.forEach((question) => {
    TRACK_ORDER.forEach((trackId) => {
      let bestForThisQuestion = 0;
      question.options.forEach((option) => {
        const value = option.scores[trackId] || 0;
        if (value > bestForThisQuestion) bestForThisQuestion = value;
      });
      max[trackId] += bestForThisQuestion;
    });
  });

  return max;
}

// Cached once since QUESTIONS never changes at runtime.
const MAX_POSSIBLE_PER_TRACK = computeMaxPossiblePerTrack();

// Turns the array of selected option indexes into a full results object:
// raw scores, rounded percentages, ranked tracks, a short list of the
// specific question themes that most favored the winning track, and the
// primary/secondary matches.
function calculateResults() {
  const rawScores = {};
  TRACK_ORDER.forEach((trackId) => {
    rawScores[trackId] = 0;
  });

  // Themes where the option the user picked leaned most heavily toward
  // a given track (used later to personalize the explanation text).
  const dominantThemesByTrack = {};
  TRACK_ORDER.forEach((trackId) => {
    dominantThemesByTrack[trackId] = [];
  });

  QUESTIONS.forEach((question, index) => {
    const chosenIndex = quizState.answers[index];
    if (chosenIndex === null || chosenIndex === undefined) return; // safety net

    const chosenOption = question.options[chosenIndex];
    const scoreEntries = Object.entries(chosenOption.scores);

    // Add this option's points to each track's running total.
    scoreEntries.forEach(([trackId, points]) => {
      rawScores[trackId] += points;
    });

    // Work out which single track this particular option leaned toward
    // hardest, and remember the question's theme against that track.
    let topTrackForOption = null;
    let topValue = -Infinity;
    scoreEntries.forEach(([trackId, points]) => {
      if (points > topValue) {
        topValue = points;
        topTrackForOption = trackId;
      }
    });
    if (topTrackForOption) {
      dominantThemesByTrack[topTrackForOption].push(question.theme);
    }
  });

  // Convert raw scores into whole-number percentages relative to each
  // track's own maximum — deliberately not normalized to sum to 100,
  // since each track's percentage represents how strongly the user's
  // answers leaned that way, independent of the others.
  const percentages = {};
  TRACK_ORDER.forEach((trackId) => {
    const max = MAX_POSSIBLE_PER_TRACK[trackId];
    percentages[trackId] = max > 0 ? Math.round((rawScores[trackId] / max) * 100) : 0;
  });

  // Rank tracks by raw score (ties broken by TRACK_ORDER position, which
  // Array.sort's stability guarantees).
  const ranked = TRACK_ORDER
    .map((trackId) => ({ id: trackId, score: rawScores[trackId], percent: percentages[trackId] }))
    .sort((a, b) => b.score - a.score);

  const primary = ranked[0];
  const secondary = ranked[1];

  // Up to 2 unique question themes that most clearly pointed to the
  // primary track, used for a personalized sentence on the results page.
  const primaryThemes = [...new Set(dominantThemesByTrack[primary.id])].slice(0, 2);

  return {
    rawScores,
    percentages,
    ranked, // sorted, highest first
    primary,
    secondary,
    primaryThemes
  };
}


/* =========================================================================
   11. RESULT RENDERING
   ========================================================================= */

function showResults(results) {
  const primaryTrack = CAREER_TRACKS[results.primary.id];
  const secondaryTrack = CAREER_TRACKS[results.secondary.id];

  dom.resultsContent.innerHTML = `
    ${renderResultsHero(results, primaryTrack, secondaryTrack)}
    ${renderExplanationSection(results, primaryTrack, secondaryTrack)}
    ${renderScoreChart(results)}
    ${renderSkillsAndRoadmap(primaryTrack)}
    ${renderOtherTracks(results)}
    ${renderDisclaimer()}
  `;

  showScreen("results");
  animateResultsReveal(results);
  launchConfetti();
}

// One orchestrated reveal moment for the whole results screen: the match
// percentage counts up and the score bars fill in together. Skipped (values
// set instantly) when the person prefers reduced motion.
function animateResultsReveal(results) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const percentEl = dom.resultsContent.querySelector(".results-hero__percent");
  const bars = dom.resultsContent.querySelectorAll(".score-row__bar-fill");

  if (prefersReducedMotion) {
    if (percentEl) {
      percentEl.textContent = `${percentEl.dataset.targetPercent}% match`;
    }
    bars.forEach((bar) => {
      bar.style.width = bar.dataset.targetWidth;
    });
    return;
  }

  if (percentEl) {
    animateCountUp(percentEl, Number(percentEl.dataset.targetPercent), "% match");
  }

  // The bars are rendered at width:0 (see renderScoreChart); waiting two
  // animation frames lets that 0% state actually paint before we set the
  // real widths, so the existing CSS `transition: width` animates them in.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      bars.forEach((bar) => {
        bar.style.width = bar.dataset.targetWidth;
      });
    });
  });
}

// Animates a number counting up to `target`, easing out, then appends
// `suffix`. Used for the big match-percentage headline.
function animateCountUp(el, target, suffix, durationMs = 700) {
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / durationMs, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = `${Math.round(eased * target)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// A brief, dependency-free confetti burst drawn on the full-viewport
// canvas from index.html. Purely decorative: never runs (and never draws
// anything) when the person prefers reduced motion.
function launchConfetti() {
  if (!dom.confettiCanvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = dom.confettiCanvas;
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const colors = TRACK_ORDER.map((id) => CAREER_TRACKS[id].color).concat("#35d0f0");
  const pieces = Array.from({ length: 90 }, () => ({
    x: Math.random() * width,
    y: -20 - Math.random() * height * 0.5,
    size: 5 + Math.random() * 5,
    speedY: 2.5 + Math.random() * 2.5,
    speedX: (Math.random() - 0.5) * 2.2,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.25,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));

  const durationMs = 2200;
  const start = performance.now();

  function frame(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, width, height);

    pieces.forEach((piece) => {
      piece.x += piece.speedX;
      piece.y += piece.speedY;
      piece.rotation += piece.rotationSpeed;

      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation);
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.6);
      ctx.restore();
    });

    if (elapsed < durationMs) {
      requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, width, height);
    }
  }

  requestAnimationFrame(frame);
}

function renderResultsHero(results, primaryTrack, secondaryTrack) {
  const greeting = quizState.userName
    ? `<p class="results-hero__greeting">🎉 Great job, ${escapeHtml(quizState.userName)}!</p>`
    : "";

  return `
    <section class="results-hero" style="--track-color:${primaryTrack.color}">
      <p class="results-hero__eyebrow">Your cybersecurity career profile</p>
      ${greeting}
      <p class="results-hero__label">Your strongest match</p>
      <div class="results-hero__track">
        <span class="results-hero__icon">${TRACK_ICONS[primaryTrack.id]}</span>
        <h2 class="results-hero__name">${primaryTrack.name}</h2>
      </div>
      <p class="results-hero__percent" data-target-percent="${results.primary.percent}">0% match</p>
      <p class="results-hero__also">
        Also worth exploring:
        <strong>${secondaryTrack.emoji} ${secondaryTrack.name}</strong> (${results.secondary.percent}%)
      </p>
    </section>`;
}

function renderExplanationSection(results, primaryTrack, secondaryTrack) {
  const bulletItems = primaryTrack.strengths
    .map((strength) => `<li>${strength}</li>`)
    .join("");

  let themeSentence = "";
  if (results.primaryThemes.length > 0) {
    themeSentence = ` In particular, your answers about ${results.primaryThemes.join(
      " and "
    )} pointed most clearly in this direction.`;
  }

  return `
    <section class="results-section">
      <h3>Why this matched you</h3>
      <p>
        Across your 15 answers, <strong>${primaryTrack.name}</strong> came out as your
        strongest match at ${results.primary.percent}%, ahead of
        <strong>${secondaryTrack.name}</strong> at ${results.secondary.percent}%.
        ${primaryTrack.whyText}${themeSentence}
      </p>
      <p class="results-section__subheading">Your answers show stronger interest in:</p>
      <ul class="check-list">${bulletItems}</ul>
    </section>`;
}

function renderScoreChart(results) {
  const rows = results.ranked
    .map((entry) => {
      const track = CAREER_TRACKS[entry.id];
      return `
        <li class="score-row">
          <span class="score-row__label">${track.emoji} ${track.name}</span>
          <span
            class="score-row__bar-track"
            role="img"
            aria-label="${track.name}: ${entry.percent}% match"
          >
            <span
              class="score-row__bar-fill"
              style="width:0%; background:${track.color}"
              data-target-width="${entry.percent}%"
            ></span>
          </span>
          <span class="score-row__percent" aria-hidden="true">${entry.percent}%</span>
        </li>`;
    })
    .join("");

  return `
    <section class="results-section">
      <h3>Scores across all five tracks</h3>
      <ul class="score-chart">${rows}</ul>
    </section>`;
}

function renderSkillsAndRoadmap(primaryTrack) {
  const skillChips = primaryTrack.skills
    .map((skill) => `<li class="skill-chip">${skill}</li>`)
    .join("");

  const roadmapSteps = primaryTrack.roadmap
    .map(
      (step, index, arr) => `
        <li class="roadmap-step">
          <span class="roadmap-step__marker" aria-hidden="true">${index + 1}</span>
          <span class="roadmap-step__text">${step}</span>
        </li>`
    )
    .join("");

  return `
    <section class="results-section">
      <h3>Skills to explore</h3>
      <ul class="skill-chip-list">${skillChips}</ul>
    </section>
    <section class="results-section">
      <h3>Suggested beginner roadmap</h3>
      <ol class="roadmap-list">${roadmapSteps}</ol>
    </section>`;
}

function renderOtherTracks(results) {
  const otherEntries = results.ranked.filter((entry) => entry.id !== results.primary.id);

  const items = otherEntries
    .map((entry) => {
      const track = CAREER_TRACKS[entry.id];
      const skillPreview = track.skills.slice(0, 4).join(", ");
      return `
        <li class="explore-card" style="--track-color:${track.color}">
          <details>
            <summary>
              <span class="explore-card__icon">${TRACK_ICONS[track.id]}</span>
              <span class="explore-card__name">${track.name}</span>
              <span class="explore-card__percent">${entry.percent}%</span>
            </summary>
            <p class="explore-card__desc">${track.description}</p>
            <p class="explore-card__skills"><strong>Starts with:</strong> ${skillPreview}…</p>
          </details>
        </li>`;
    })
    .join("");

  return `
    <section class="results-section">
      <h3>Explore another path</h3>
      <ul class="explore-list">${items}</ul>
    </section>`;
}

function renderDisclaimer() {
  return `
    <section class="results-section results-disclaimer">
      <p>
        🧭 Your result is a starting point, not a final career decision. Cybersecurity
        roles overlap, and your interests may change as you gain practical experience.
        Use this result to explore different areas and try hands-on learning before
        choosing a specialization.
      </p>
    </section>`;
}


/* =========================================================================
   12. RESET
   ========================================================================= */

function resetQuiz() {
  quizState.currentQuestionIndex = 0;
  quizState.answers = new Array(QUESTIONS.length).fill(null);
  quizState.lastResults = null;
  // quizState.userName is deliberately left untouched — retaking the quiz
  // shouldn't mean re-entering your name.
  dom.actionStatus.hidden = true;
  dom.actionStatus.textContent = "";
  showScreen("quiz");
  showQuestion(0);
}


/* =========================================================================
   13. SHARE
   -------------------------------------------------------------------------
   Uses the Web Share API where available. Falls back to copying a short
   text summary to the clipboard, and if that also isn't available,
   reveals a read-only text box the user can select and copy by hand.
   Never uses alert()/confirm().
   ========================================================================= */

function buildShareText(results) {
  const primaryTrack = CAREER_TRACKS[results.primary.id];
  const intro = quizState.userName
    ? `I'm ${quizState.userName} and I just took`
    : "I just took";
  return (
    `${intro} the Cyber404 Career Finder quiz and matched with ` +
    `${primaryTrack.emoji} ${primaryTrack.name} (${results.primary.percent}% match)! ` +
    `Find your own cybersecurity path with Cyber404 Career Finder.`
  );
}

async function shareResult() {
  if (!quizState.lastResults) return;
  const shareText = buildShareText(quizState.lastResults);
  const shareUrl = window.location.href;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Cyber404 Career Finder",
        text: shareText,
        url: shareUrl
      });
      return;
    } catch (err) {
      // The user cancelling the native share sheet is not an error we
      // need to react to — fall through to the clipboard fallback only
      // if the share genuinely failed for another reason.
      if (err && err.name === "AbortError") return;
    }
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      showActionStatus("📋 Result copied to clipboard!");
      return;
    } catch (err) {
      // fall through to manual copy box below
    }
  }

  showManualCopyBox(`${shareText} ${shareUrl}`);
}

// Shared by both the Share and Download actions below.
function showActionStatus(message) {
  dom.actionStatus.innerHTML = "";
  dom.actionStatus.textContent = message;
  dom.actionStatus.hidden = false;
}

function showManualCopyBox(text) {
  dom.actionStatus.innerHTML = `
    <label for="manual-copy-text">Copy this text to share:</label>
    <textarea id="manual-copy-text" class="manual-copy" readonly rows="3"></textarea>`;
  dom.actionStatus.hidden = false;
  const textarea = document.getElementById("manual-copy-text");
  textarea.value = text;
  textarea.focus();
  textarea.select();
}


/* =========================================================================
   13b. DOWNLOAD RESULT AS IMAGE
   -------------------------------------------------------------------------
   Draws the result card directly onto an off-screen <canvas> (no external
   library, no network request — everything still runs entirely in the
   browser) and triggers a PNG download. Colors/fonts below intentionally
   mirror the CSS custom properties in style.css so the downloaded image
   matches the on-page design, and fall back the same way the page's own
   fonts do if the webfont hasn't loaded (e.g. offline).
   ========================================================================= */

async function downloadResultImage() {
  if (!quizState.lastResults || !dom.downloadButton) return;

  dom.downloadButton.disabled = true;
  try {
    // Wait for webfonts so the exported image doesn't briefly render in a
    // fallback font in browsers that support this; safe to skip if not.
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    const canvas = buildResultImageCanvas(quizState.lastResults);
    await triggerCanvasDownload(canvas, quizState.userName);
  } catch (err) {
    showActionStatus("Sorry — this browser couldn't generate the image.");
  } finally {
    dom.downloadButton.disabled = false;
  }
}

function buildResultImageCanvas(results) {
  const primaryTrack = CAREER_TRACKS[results.primary.id];
  const secondaryTrack = CAREER_TRACKS[results.secondary.id];
  const name = (quizState.userName || "Future Cybersecurity Pro").slice(0, 40);

  const width = 1080;
  const cardX = 64;
  const cardY = 168;
  const cardWidth = width - cardX * 2;
  const padX = cardX + 56;
  const contentWidth = cardWidth - 112;
  const contentStartY = cardY + 76;
  const cardBottomPadding = 96; // room for the in-card footer line below content

  const layoutArgs = {
    primaryTrack,
    secondaryTrack,
    results,
    name,
    padX,
    contentWidth,
    startY: contentStartY
  };

  // Pass 1 — measure only (no pixels drawn) so we know how tall the card
  // needs to be before drawing its background. Font metrics only depend on
  // ctx.font, not on the canvas's size, so a throwaway context works fine.
  const measureCtx = document.createElement("canvas").getContext("2d");
  const contentBottomY = layoutResultContent(measureCtx, { ...layoutArgs, draw: false });

  const cardHeight = contentBottomY - cardY + cardBottomPadding;
  const height = cardY + cardHeight + 96; // + space for the tagline outside the card

  // Pass 2 — draw everything for real, now that every dimension is known.
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const canvas = document.createElement("canvas");
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  // Background gradient — mirrors --bg → --bg-elevated-2
  const backgroundGradient = ctx.createLinearGradient(0, 0, 0, height);
  backgroundGradient.addColorStop(0, "#090d18");
  backgroundGradient.addColorStop(1, "#16213a");
  ctx.fillStyle = backgroundGradient;
  ctx.fillRect(0, 0, width, height);

  // Brand mark — spelled out in full here (unlike the "cyber404_" wordmark
  // used on-page) since this image gets shared outside the site, where a
  // shorthand handle is less recognizable than the full academy name.
  ctx.fillStyle = "#35d0f0";
  ctx.font = "700 34px 'Space Grotesk', 'Segoe UI', sans-serif";
  ctx.fillText("Cyber404 Academy", 64, 96);
  ctx.fillStyle = "#a4b3cc";
  ctx.font = "500 22px 'Inter', 'Segoe UI', sans-serif";
  ctx.fillText("Career Finder", 64, 128);

  // Card panel, now sized to exactly fit what's about to be drawn in it
  ctx.fillStyle = "rgba(234, 241, 251, 0.04)";
  drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, 32);
  ctx.fill();

  // Track-color accent stripe across the top of the card
  ctx.fillStyle = primaryTrack.color;
  drawRoundedRect(ctx, cardX, cardY, cardWidth, 8, 4);
  ctx.fill();

  layoutResultContent(ctx, { ...layoutArgs, draw: true });

  ctx.fillStyle = "#6e7d99";
  ctx.font = "500 22px 'Inter', 'Segoe UI', sans-serif";
  ctx.fillText("cyber404academy.com  ·  Free cybersecurity training", padX, cardY + cardHeight - 40);

  ctx.fillStyle = "#a4b3cc";
  ctx.font = "600 24px 'JetBrains Mono', 'SFMono-Regular', monospace";
  ctx.textAlign = "center";
  ctx.fillText("🔐 Learn. Hack. Secure. Grow.", width / 2, height - 48);
  ctx.textAlign = "left";

  return canvas;
}

// The card's inner content (everything between the accent stripe and the
// in-card footer line). Shared by both passes in buildResultImageCanvas():
// with draw:false it only measures (via ctx.measureText, no pixels touched)
// so the caller can size the card first; with draw:true it paints the same
// layout for real. Keeping this in one function guarantees the two passes
// can never drift apart. Returns the y position just below the last thing
// laid out.
function layoutResultContent(ctx, { primaryTrack, secondaryTrack, results, name, padX, contentWidth, startY, draw }) {
  let cursorY = startY;

  ctx.font = "600 22px 'JetBrains Mono', 'SFMono-Regular', monospace";
  if (draw) {
    ctx.fillStyle = "#6e7d99";
    ctx.fillText("Your cybersecurity career profile", padX, cursorY);
  }
  cursorY += 56;

  ctx.font = "700 34px 'Space Grotesk', 'Segoe UI', sans-serif";
  if (draw) {
    ctx.fillStyle = "#eaf1fb";
    ctx.fillText(`🎉 Great job, ${name}!`, padX, cursorY);
  }
  cursorY += 68;

  ctx.font = "500 24px 'Inter', 'Segoe UI', sans-serif";
  if (draw) {
    ctx.fillStyle = "#a4b3cc";
    ctx.fillText("Your strongest match", padX, cursorY);
  }
  cursorY += 56;

  ctx.font = "700 48px 'Space Grotesk', 'Segoe UI', sans-serif";
  if (draw) ctx.fillStyle = "#eaf1fb";
  cursorY = layoutWrappedText(
    ctx,
    `${primaryTrack.emoji} ${primaryTrack.name}`,
    padX,
    cursorY,
    contentWidth,
    56,
    draw
  );
  cursorY += 20;

  ctx.font = "700 84px 'Space Grotesk', 'Segoe UI', sans-serif";
  if (draw) {
    ctx.fillStyle = primaryTrack.color;
    ctx.fillText(`${results.primary.percent}% match`, padX, cursorY + 70);
  }
  cursorY += 112;

  ctx.font = "500 26px 'Inter', 'Segoe UI', sans-serif";
  if (draw) ctx.fillStyle = "#a4b3cc";
  cursorY = layoutWrappedText(
    ctx,
    `Also worth exploring: ${secondaryTrack.emoji} ${secondaryTrack.name} (${results.secondary.percent}%)`,
    padX,
    cursorY + 16,
    contentWidth,
    36,
    draw
  );
  cursorY += 48;

  if (draw) {
    ctx.strokeStyle = "rgba(154, 172, 198, 0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padX, cursorY);
    ctx.lineTo(padX + contentWidth, cursorY);
    ctx.stroke();
  }
  cursorY += 48;

  ctx.font = "600 28px 'Space Grotesk', 'Segoe UI', sans-serif";
  if (draw) {
    ctx.fillStyle = "#eaf1fb";
    ctx.fillText("Skills to explore", padX, cursorY);
  }
  cursorY += 44;

  cursorY = layoutSkillChips(ctx, primaryTrack.skills.slice(0, 6), padX, cursorY, contentWidth, 48, draw);

  return cursorY;
}

// Word-wrapping fillText helper shared by the measure and draw passes.
// With draw:false it only measures line breaks; with draw:true it paints
// them too. Either way it returns the y position after the last line.
function layoutWrappedText(ctx, text, x, y, maxWidth, lineHeight, draw) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  words.forEach((word, index) => {
    const testLine = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(testLine).width > maxWidth) {
      if (draw) ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
    if (index === words.length - 1) {
      if (draw) ctx.fillText(line, x, currentY);
    }
  });

  return currentY;
}

// Lays out skill names as small rounded "chip" badges, wrapping to a new
// row when the next chip would overflow maxWidth. With draw:false it only
// measures (for sizing the card); with draw:true it paints the chips too.
// Either way it returns the y position just below the last row.
function layoutSkillChips(ctx, skills, startX, startY, maxWidth, chipHeight, draw) {
  const paddingX = 18;
  const gap = 12;
  let x = startX;
  let y = startY;

  ctx.font = "600 22px 'Inter', 'Segoe UI', sans-serif";

  skills.forEach((skill) => {
    const chipWidth = ctx.measureText(skill).width + paddingX * 2;
    if (x !== startX && x + chipWidth > startX + maxWidth) {
      x = startX;
      y += chipHeight + gap;
    }

    if (!draw) {
      x += chipWidth + gap;
      return;
    }

    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    drawRoundedRect(ctx, x, y, chipWidth, chipHeight, chipHeight / 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, x, y, chipWidth, chipHeight, chipHeight / 2);
    ctx.stroke();

    ctx.fillStyle = "#eaf1fb";
    ctx.textBaseline = "middle";
    ctx.fillText(skill, x + paddingX, y + chipHeight / 2 + 1);
    ctx.textBaseline = "alphabetic";

    x += chipWidth + gap;
  });

  return y + chipHeight;
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

// Converts the canvas to a PNG and triggers a browser download. Uses
// toBlob() where available (more memory-efficient than a data URL) and
// falls back to toDataURL() for older browsers.
function triggerCanvasDownload(canvas, name) {
  const filename = `cyber404-career-result-${slugify(name)}.png`;

  return new Promise((resolve) => {
    if (canvas.toBlob) {
      canvas.toBlob((blob) => {
        if (!blob) {
          showActionStatus("Sorry — this browser couldn't generate the image.");
          resolve();
          return;
        }
        const url = URL.createObjectURL(blob);
        triggerDownloadFromUrl(url, filename);
        // Give the download a moment to actually start reading the blob
        // before the object URL backing it is released.
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        showActionStatus("Image downloaded! 🎉");
        resolve();
      }, "image/png");
    } else {
      const dataUrl = canvas.toDataURL("image/png");
      triggerDownloadFromUrl(dataUrl, filename);
      showActionStatus("Image downloaded! 🎉");
      resolve();
    }
  });
}

function triggerDownloadFromUrl(url, filename) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Turns a name into a safe filename fragment (letters/numbers only).
function slugify(text) {
  const slug = (text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug || "result";
}


/* =========================================================================
   14. SMALL UTILITIES
   ========================================================================= */

// Kept for potential reuse; clamps a number into [min, max].
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// The entered name is rendered via innerHTML in renderResultsHero(), so it
// needs escaping there (everywhere else it's set via textContent, which
// never interprets its input as markup and needs no escaping).
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
