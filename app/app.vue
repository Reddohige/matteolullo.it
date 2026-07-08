<script setup lang="ts">
const language = ref<"it" | "en">("it");
const mode = ref<"matteoOS" | "corporate">("matteoOS");
const bootVisible = ref(true);
const expandedBio = ref(false);
const isOffline = ref(false);
const buildLoopScripts = {
  it: [
    'const idea = scan("curiosity");',
    "prototype.build(idea);",
    "people.invite({ vibe: 'welcome' });",
    "feedback.listen();",
    "project.improve();",
    "return repeat();",
  ],
  en: [
    'const idea = scan("curiosity");',
    "prototype.build(idea);",
    "people.invite({ vibe: 'welcome' });",
    "feedback.listen();",
    "project.improve();",
    "return repeat();",
  ],
} as const;
const displayedBuildLines = ref<string[]>(Array(6).fill(""));
const activeBuildLine = ref(0);
const buildLoopBootDelay = 7200;
const buildLoopTypeDelay = 72;
const buildLoopLineDelay = 620;
const offlineCacheName = "matteolullo-it-v2";
const offlineStaticUrls = [
  "/",
  "/200.html",
  "/404.html",
  "/favicon.ico",
  "/img/bg-r.jpg",
  "/img/io-def.png",
  "/img/io-corporate.jpeg",
  "/doc/Matteo_Lullo_CV.pdf",
  "/prj/",
];

const isCorporate = computed(() => mode.value === "corporate");

let buildLoopTimer: ReturnType<typeof setTimeout> | undefined;

const clearBuildLoopTimer = () => {
  if (buildLoopTimer) {
    clearTimeout(buildLoopTimer);
    buildLoopTimer = undefined;
  }
};

const updateOnlineStatus = () => {
  if (!import.meta.client) {
    return;
  }

  isOffline.value = !navigator.onLine;
  document.body.classList.toggle("offline-mode", isOffline.value);
};

const registerServiceWorker = () => {
  if (!import.meta.client || !("serviceWorker" in navigator)) {
    return;
  }

  navigator.serviceWorker
    .register("/sw.js")
    .then(() => warmOfflineCache())
    .catch(() => {
      // Offline support is progressive: the site keeps working without SW.
    });
};

const warmOfflineCache = async () => {
  if (!import.meta.client || !("caches" in window)) {
    return;
  }

  const currentResources = performance
    .getEntriesByType("resource")
    .map((entry) => entry.name)
    .filter((url) => url.startsWith(window.location.origin));
  const urls = Array.from(
    new Set([
      window.location.href,
      ...offlineStaticUrls.map((url) => new URL(url, window.location.origin).href),
      ...currentResources,
    ]),
  );
  const cache = await caches.open(offlineCacheName);

  await Promise.allSettled(
    urls.map((url) =>
      fetch(url)
        .then((response) => {
          if (response.ok) {
            return cache.put(url, response);
          }

          return undefined;
        })
        .catch(() => undefined),
    ),
  );
};

const startBuildLoopTyping = () => {
  if (!import.meta.client) {
    return;
  }

  clearBuildLoopTimer();

  const lines = buildLoopScripts[language.value];
  displayedBuildLines.value = lines.map(() => "");
  activeBuildLine.value = 0;

  let lineIndex = 0;
  let charIndex = 0;

  const typeNextCharacter = () => {
    if (lineIndex >= lines.length) {
      activeBuildLine.value = lines.length - 1;
      return;
    }

    const currentLine = lines[lineIndex];
    displayedBuildLines.value[lineIndex] = currentLine.slice(0, charIndex + 1);
    charIndex += 1;

    if (charIndex < currentLine.length) {
      buildLoopTimer = setTimeout(typeNextCharacter, buildLoopTypeDelay);
      return;
    }

    lineIndex += 1;
    charIndex = 0;
    activeBuildLine.value = Math.min(lineIndex, lines.length - 1);
    buildLoopTimer = setTimeout(typeNextCharacter, buildLoopLineDelay);
  };

  buildLoopTimer = setTimeout(typeNextCharacter, buildLoopLineDelay);
};

const setLanguage = (nextLanguage: "it" | "en") => {
  language.value = nextLanguage;

  if (import.meta.client) {
    document.documentElement.lang = nextLanguage;
    localStorage.setItem("preferredLanguage", nextLanguage);
  }
};

const setMode = (nextMode: "matteoOS" | "corporate") => {
  mode.value = nextMode;
  expandedBio.value = false;

  if (import.meta.client) {
    document.body.classList.toggle("corporate-mode", nextMode === "corporate");
    localStorage.setItem("preferredMode", nextMode);
  }
};

const toggleMode = () => {
  setMode(isCorporate.value ? "matteoOS" : "corporate");
};

const goHome = () => {
  setMode("matteoOS");

  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const goCorporate = () => {
  setMode("corporate");

  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

onMounted(() => {
  const savedLanguage = localStorage.getItem("preferredLanguage");
  const browserLanguage = navigator.language.toLowerCase().startsWith("en")
    ? "en"
    : "it";
  const savedMode = localStorage.getItem("preferredMode");

  setLanguage(
    savedLanguage === "en" || savedLanguage === "it"
      ? savedLanguage
      : browserLanguage,
  );
  setMode(savedMode === "corporate" ? "corporate" : "matteoOS");

  if (mode.value === "matteoOS") {
    buildLoopTimer = setTimeout(startBuildLoopTyping, buildLoopBootDelay);
  }

  updateOnlineStatus();
  registerServiceWorker();
  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);

  window.setTimeout(() => {
    bootVisible.value = false;
  }, 6500);
});

watch([language, mode], ([, nextMode]) => {
  if (nextMode === "matteoOS") {
    startBuildLoopTyping();
    return;
  }

  clearBuildLoopTimer();
});

onUnmounted(() => {
  clearBuildLoopTimer();

  if (import.meta.client) {
    window.removeEventListener("online", updateOnlineStatus);
    window.removeEventListener("offline", updateOnlineStatus);
    document.body.classList.remove("corporate-mode");
    document.body.classList.remove("offline-mode");
  }
});
</script>

<template>
  <div>
    <div
      class="boot-loader"
      :class="{ 'is-hidden': !bootVisible }"
      aria-label="Caricamento sito"
      aria-live="polite"
    >
      <div class="boot-box">
        <p class="boot-kicker">&gt; boot MatteoOS</p>
        <p class="boot-title">Cowabunga!</p>
        <ul class="boot-steps">
          <li class="boot-step">loading creative systems...</li>
          <li class="boot-step">syncing community memories...</li>
          <li class="boot-step">warming up pixel engine...</li>
          <li class="boot-step">preparing corporate profile...</li>
          <li class="boot-step">ready to build.</li>
        </ul>
        <div class="boot-progress" aria-hidden="true">
          <span class="boot-progress-bar" />
        </div>
        <p class="boot-status">READY</p>
      </div>
    </div>

    <main class="page">
      <div
        class="offline-banner"
        :class="{ 'is-visible': isOffline }"
        role="status"
        aria-live="polite"
      >
        <span>{{ language === "it" ? "OFFLINE_MODE" : "OFFLINE_MODE" }}</span>
        <strong>
          {{
            language === "it"
              ? "Sei offline: sto usando la versione salvata del sito."
              : "You are offline: the saved version of the site is being used."
          }}
        </strong>
      </div>
      <nav class="topbar" aria-label="Controlli pagina">
        <button
          type="button"
          class="brand-chip"
          aria-label="Torna alla homepage"
          @click="goHome"
        >
          {{ isCorporate ? "Matteo Lullo" : "MatteoOS v33" }}
        </button>
        <div class="nav-actions">
          <button
            type="button"
            :class="{ active: language === 'it' }"
            :aria-pressed="language === 'it'"
            @click="setLanguage('it')"
          >
            IT
          </button>
          <button
            type="button"
            :class="{ active: language === 'en' }"
            :aria-pressed="language === 'en'"
            @click="setLanguage('en')"
          >
            EN
          </button>
          <button
            type="button"
            class="mode-button"
            :class="{ active: isCorporate }"
            :aria-pressed="isCorporate"
            @click="toggleMode"
          >
            {{ isCorporate ? "MatteoOS" : "Corporate" }}
          </button>
        </div>
      </nav>

      <section
        v-show="!isCorporate"
        class="screen"
        aria-label="MatteoOS interface"
      >
        <div class="window-bar">
          <span class="dots" aria-hidden="true">
            <span class="dot" />
            <span class="dot" />
            <span class="dot" />
          </span>
          <span>/home/reddohige/creative-systems-builder.exe</span>
        </div>

        <div class="content">
          <section v-show="language === 'it'" lang="it">
            <div class="hero">
              <div class="profile-frame">
                <img
                  src="/img/io-def.png"
                  class="profile-image"
                  alt="Matteo Lullo, Reddohige"
                />
              </div>
              <div>
                <p class="terminal-line">booting Cowabunga...</p>
                <h1>Matteo Lullo</h1>
                <span class="role">Creative Systems Builder</span>
                <p class="claim">
                  Progetto <strong>sistemi</strong>, community ed esperienze che
                  le persone amano usare.
                </p>
              </div>
            </div>

            <div class="boot-grid">
              <article class="card">
                <h2 class="card-title">BUILD_LOOP()</h2>
                <ul class="process-list">
                  <li
                    v-for="(line, index) in displayedBuildLines"
                    :key="`it-build-${index}`"
                    :class="{ 'is-active': index === activeBuildLine }"
                  >
                    <span class="process-line">{{ line }}</span>
                  </li>
                </ul>
                <p class="mini-bio">
                  <strong>Ciao, sono Matteo Lullo - Reddohige sul web.</strong>
                  Sono uno sviluppatore frontend, creativo e community builder
                  con base vicino a Milano. Mi piace creare cose che uniscono
                  tecnologia, gioco, cultura pop e persone.
                </p>
                <div class="quote-panel">
                  "Ogni progetto parte sempre dalla stessa domanda: le persone
                  si divertiranno davvero a usarlo?"
                </div>
                <div class="actions">
                  <button
                    type="button"
                    class="button-one"
                    @click="goCorporate"
                  >
                    Profilo tecnico
                  </button>
                  <button
                    type="button"
                    class="button-one"
                    :aria-expanded="expandedBio"
                    @click="expandedBio = !expandedBio"
                  >
                    {{ expandedBio ? "Chiudi bio" : "Leggi bio estesa" }}
                  </button>
                </div>
                <div class="extended-bio" :class="{ 'is-open': expandedBio }">
                  <div>
                    <p>
                      Sono uno sviluppatore frontend, creativo e community
                      builder con base a Inzago, vicino a Milano.
                    </p>
                    <p>
                      Negli anni ho scoperto che il codice non è mai stato il
                      mio vero obiettivo. Quello che mi entusiasma davvero è
                      progettare sistemi, prodotti ed esperienze che rendano la
                      vita delle persone più semplice, più divertente o
                      semplicemente migliore.
                    </p>
                    <p>
                      Ho parlato di web performance durante eventi e conferenze,
                      organizzato community dedicate ai giochi di ruolo,
                      Beyblade e fandom, calcato i palchi come bassista per
                      oltre dieci anni e continuo ancora oggi a creare progetti
                      che uniscono tecnologia e creatività.
                    </p>
                    <p>
                      Uso l'AI come aiutante nelle sfide: non come scorciatoia,
                      ma come compagna di ragionamento per esplorare idee,
                      validare soluzioni e arrivare più velocemente al cuore dei
                      problemi.
                    </p>
                    <p>
                      Credo nella curiosità, nella condivisione delle conoscenze
                      e nell'idea che le esperienze migliori nascano quando
                      qualcuno decide di tendere una mano agli altri.
                    </p>
                  </div>
                </div>
                <div class="creative-links" aria-label="Progetti creativi">
                  <h2>CREATIVE_OUTPUT()</h2>
                  <a
                    href="https://www.youtube.com/watch?v=v5s1Z1sdg3c"
                    target="_blank"
                    rel="noopener"
                  >
                    Latente Band - Everest
                  </a>
                  <a
                    href="https://www.youtube.com/watch?v=SdnePAwCdn0"
                    target="_blank"
                    rel="noopener"
                  >
                    Latente Band - Nervi
                  </a>
                  <a
                    href="https://www.youtube.com/watch?v=fSmCLXr_Pug"
                    target="_blank"
                    rel="noopener"
                  >
                    Latente Band - Fumare
                  </a>
                  <a
                    href="https://docs.google.com/document/d/1Onin5WGUIPmfpePxDkbnM3ohm-R9I8r1ZsmQAvsHrwg/edit?usp=sharing"
                    target="_blank"
                    rel="noopener"
                  >
                    Multitavolo GDR - Yokai Hunter Society
                  </a>
                  <a
                    href="https://docs.google.com/document/d/1qv2-9uOYUIi0q0ORYf_it9owCCh4SfAempAiKh_wbys/edit?usp=sharing"
                    target="_blank"
                    rel="noopener"
                  >
                    Avventura Demon Slayer - sistema Yokai Hunter Society
                  </a>
                  <a
                    href="https://drive.google.com/drive/folders/1oJ25okxo1TxsXbB4pqrHwziPklfpEvfY?usp=sharing"
                    target="_blank"
                    rel="noopener"
                  >
                    I Figli del Crepuscolo - materiali campagna multitavolo
                  </a>
                  <a
                    href="https://reddohige.itch.io/"
                    target="_blank"
                    rel="noopener"
                  >
                    Giochi e prototipi su itch.io
                  </a>
                </div>
                <div class="creative-links" aria-label="Progetti tecnici">
                  <h2>TECH_OUTPUT()</h2>
                  <a href="/prj/" target="_blank" rel="noopener">
                    MatteoOS PRJ - launcher progetti tecnici
                  </a>
                </div>
              </article>

              <aside class="card">
                <h2 class="card-title">STATUS</h2>
                <ul class="tag-list" aria-label="Cosa costruisco">
                  <li>frontend</li>
                  <li>web-performance</li>
                  <li>community</li>
                  <li>game-design</li>
                  <li>beyblade</li>
                  <li>fandom</li>
                  <li>music</li>
                  <li>future-dad</li>
                </ul>
                <h2 class="card-title connect-title">CONNECT</h2>
                <div class="socials">
                  <a
                    href="https://www.instagram.com/reddohige/"
                    target="_blank"
                    rel="noopener"
                    class="social-link"
                    aria-label="Instagram di Matteo Lullo"
                    >IG</a
                  >
                  <a
                    href="https://www.linkedin.com/in/matteo-lullo/"
                    target="_blank"
                    rel="noopener"
                    class="social-link"
                    aria-label="LinkedIn di Matteo Lullo"
                    >IN</a
                  >
                  <a
                    href="https://github.com/Reddohige"
                    target="_blank"
                    rel="noopener"
                    class="social-link"
                    aria-label="GitHub di Matteo Lullo"
                    >GH</a
                  >
                </div>
              </aside>
            </div>
          </section>

          <section v-show="language === 'en'" lang="en">
            <div class="hero">
              <div class="profile-frame">
                <img
                  src="/img/io-def.png"
                  class="profile-image"
                  alt="Matteo Lullo, Reddohige"
                />
              </div>
              <div>
                <p class="terminal-line">booting Cowabunga...</p>
                <h1>Matteo Lullo</h1>
                <span class="role">Creative Systems Builder</span>
                <p class="claim">
                  I build <strong>systems</strong>, communities and experiences
                  that people genuinely enjoy using.
                </p>
              </div>
            </div>

            <div class="boot-grid">
              <article class="card">
                <h2 class="card-title">BUILD_LOOP()</h2>
                <ul class="process-list">
                  <li
                    v-for="(line, index) in displayedBuildLines"
                    :key="`en-build-${index}`"
                    :class="{ 'is-active': index === activeBuildLine }"
                  >
                    <span class="process-line">{{ line }}</span>
                  </li>
                </ul>
                <p class="mini-bio">
                  <strong>Hi, I'm Matteo Lullo - Reddohige online.</strong>
                  I'm a frontend developer, creative builder and community
                  organizer based near Milan. I love creating things where
                  technology, games, pop culture and people meet.
                </p>
                <div class="quote-panel">
                  "Every project starts with the same question: will people
                  genuinely enjoy using this?"
                </div>
                <div class="actions">
                  <button
                    type="button"
                    class="button-one"
                    @click="goCorporate"
                  >
                    Technical profile
                  </button>
                  <button
                    type="button"
                    class="button-one"
                    :aria-expanded="expandedBio"
                    @click="expandedBio = !expandedBio"
                  >
                    {{ expandedBio ? "Close bio" : "Read extended bio" }}
                  </button>
                </div>
                <div class="extended-bio" :class="{ 'is-open': expandedBio }">
                  <div>
                    <p>
                      I'm a frontend developer, creative builder and community
                      organizer based near Milan, Italy.
                    </p>
                    <p>
                      Over the years I realized that writing code was never my
                      real goal. What truly motivates me is designing systems,
                      products and experiences that make people's lives easier,
                      more enjoyable or simply more meaningful.
                    </p>
                    <p>
                      I've spoken about web performance at conferences, built
                      communities around tabletop RPGs, Beyblade and fandom
                      culture, spent over a decade performing on stage as a bass
                      player, and I still love creating projects where
                      technology meets creativity.
                    </p>
                    <p>
                      I use AI as a helper when facing challenges: not as a
                      shortcut, but as a thinking companion to explore ideas,
                      validate solutions and get faster to the heart of a
                      problem.
                    </p>
                    <p>
                      I believe in curiosity, sharing knowledge and creating
                      spaces where people feel welcome.
                    </p>
                  </div>
                </div>
                <div class="creative-links" aria-label="Creative projects">
                  <h2>CREATIVE_OUTPUT()</h2>
                  <a
                    href="https://www.youtube.com/watch?v=v5s1Z1sdg3c"
                    target="_blank"
                    rel="noopener"
                  >
                    Latente Band - Everest
                  </a>
                  <a
                    href="https://www.youtube.com/watch?v=SdnePAwCdn0"
                    target="_blank"
                    rel="noopener"
                  >
                    Latente Band - Nervi
                  </a>
                  <a
                    href="https://www.youtube.com/watch?v=fSmCLXr_Pug"
                    target="_blank"
                    rel="noopener"
                  >
                    Latente Band - Fumare
                  </a>
                  <a
                    href="https://docs.google.com/document/d/1Onin5WGUIPmfpePxDkbnM3ohm-R9I8r1ZsmQAvsHrwg/edit?usp=sharing"
                    target="_blank"
                    rel="noopener"
                  >
                    TTRPG multi-table event - Yokai Hunter Society
                  </a>
                  <a
                    href="https://docs.google.com/document/d/1qv2-9uOYUIi0q0ORYf_it9owCCh4SfAempAiKh_wbys/edit?usp=sharing"
                    target="_blank"
                    rel="noopener"
                  >
                    Demon Slayer adventure - Yokai Hunter Society system
                  </a>
                  <a
                    href="https://drive.google.com/drive/folders/1oJ25okxo1TxsXbB4pqrHwziPklfpEvfY?usp=sharing"
                    target="_blank"
                    rel="noopener"
                  >
                    Children of Twilight - multi-table campaign materials
                  </a>
                  <a
                    href="https://reddohige.itch.io/"
                    target="_blank"
                    rel="noopener"
                  >
                    Games and prototypes on itch.io
                  </a>
                </div>
                <div class="creative-links" aria-label="Technical projects">
                  <h2>TECH_OUTPUT()</h2>
                  <a href="/prj/" target="_blank" rel="noopener">
                    MatteoOS PRJ - technical project launcher
                  </a>
                </div>
              </article>

              <aside class="card">
                <h2 class="card-title">STATUS</h2>
                <ul class="tag-list" aria-label="What I build">
                  <li>frontend</li>
                  <li>web performance</li>
                  <li>community</li>
                  <li>game design</li>
                  <li>beyblade</li>
                  <li>fandom</li>
                  <li>music</li>
                  <li>future dad</li>
                </ul>
                <h2 class="card-title connect-title">CONNECT</h2>
                <div class="socials">
                  <a
                    href="https://www.instagram.com/reddohige/"
                    target="_blank"
                    rel="noopener"
                    class="social-link"
                    aria-label="Matteo Lullo on Instagram"
                    >IG</a
                  >
                  <a
                    href="https://www.linkedin.com/in/matteo-lullo/"
                    target="_blank"
                    rel="noopener"
                    class="social-link"
                    aria-label="Matteo Lullo on LinkedIn"
                    >IN</a
                  >
                  <a
                    href="https://github.com/Reddohige"
                    target="_blank"
                    rel="noopener"
                    class="social-link"
                    aria-label="Matteo Lullo on GitHub"
                    >GH</a
                  >
                </div>
              </aside>
            </div>
          </section>
        </div>
      </section>

      <section
        v-show="isCorporate"
        class="corporate-shell"
        aria-label="Corporate profile"
      >
        <div v-show="language === 'it'" lang="it" class="corporate-content">
          <article class="corporate-card">
            <p class="corporate-kicker">Personal Profile</p>
            <h1 class="corporate-title">Matteo Lullo</h1>
            <p class="corporate-role">
              Software engineer e frontend developer per piattaforme corporate,
              media digitali e customer care.
            </p>
            <p class="corporate-lead">
              Porto oltre dieci anni di esperienza nello sviluppo web, dalla
              realizzazione di interfacce e componenti front-end
              all'ottimizzazione performance, fino alla gestione di rilasci,
              integrazioni CMS e collaborazione con team e stakeholder.
            </p>
            <div class="actions">
              <a
                href="/doc/Matteo_Lullo_CV.pdf"
                target="_blank"
                rel="noopener"
                class="button-one corporate-action"
                >Scarica CV</a
              >
              <button
                type="button"
                class="button-one corporate-action"
                :aria-expanded="expandedBio"
                @click="expandedBio = !expandedBio"
              >
                {{ expandedBio ? "Chiudi bio" : "Leggi bio estesa" }}
              </button>
            </div>
            <div
              class="extended-bio corporate-bio"
              :class="{ 'is-open': expandedBio }"
            >
              <div>
                <p>
                  Attualmente lavoro come Software Engineer in iliad, dove
                  sviluppo applicazioni web per piattaforme corporate e customer
                  care, contribuendo anche a progetti in collaborazione con il
                  gruppo iliad / Free Mobile.
                </p>
                <p>
                  Mi occupo principalmente di frontend con Vue.js, Nuxt.js,
                  Angular e TypeScript, integrando quando serve componenti
                  backend in PHP, Python e Node.js. Ho integrato Strapi in
                  progetti corporate per migliorare gestione ed efficienza dei
                  contenuti.
                </p>
                <p>
                  In precedenza ho lavorato su prodotti digitali ad alto
                  traffico per RCS Media Group e Sky Italia, occupandomi di
                  componenti front-end, HTML/SCSS, JavaScript ES6, testing,
                  integrazione AEM/SSI, SEO tecnica e ottimizzazione delle
                  performance con attenzione alle Google Web Vitals.
                </p>
                <p>
                  Ho ricoperto ruoli di focal point e coordinamento operativo,
                  seguendo consulenti, team editoriali e stakeholder di
                  marketing. Lavoro con Docker, Argo, MinIO, Git e rilasci via
                  Docker/SSH, cercando sempre un flusso snello, sostenibile e
                  orientato alla qualità.
                </p>
                <p>
                  Uso l'AI come supporto operativo e strategico nelle sfide di
                  progetto: mi aiuta a ragionare meglio, accelerare analisi e
                  prototipi, confrontare alternative e mantenere alta la qualità
                  delle decisioni tecniche.
                </p>
              </div>
            </div>
            <div class="corporate-links" aria-label="Talk e contenuti">
              <h2>Talk e contenuti</h2>
              <a
                href="https://www.youtube.com/watch?v=rp_HrmK21BA&list=PLWK9j6ps_unkp5H3oUSzonh51Jze103Hc&index=6"
                target="_blank"
                rel="noopener"
              >
                Talk su web performance - CSSDay
              </a>
              <a
                href="https://www.gitbar.it/episode/ep84-web-performance-con-matteo-lullo-sky-italia"
                target="_blank"
                rel="noopener"
              >
                Podcast Gitbar: Web Performance con Matteo Lullo
              </a>
              <a
                href="https://www.wemakefuture.it/i/618a4f8a6658c42af4c3f5dd/"
                target="_blank"
                rel="noopener"
              >
                Speaker profile - WMF / Rimini Web Marketing
              </a>
            </div>
          </article>
          <aside class="corporate-photo">
            <img src="/img/io-corporate.jpeg" alt="Matteo Lullo" />
          </aside>
        </div>

        <div v-show="language === 'en'" lang="en" class="corporate-content">
          <article class="corporate-card">
            <p class="corporate-kicker">Personal Profile</p>
            <h1 class="corporate-title">Matteo Lullo</h1>
            <p class="corporate-role">
              Software engineer and frontend developer for corporate platforms,
              digital media and customer care tools.
            </p>
            <p class="corporate-lead">
              I bring over ten years of experience in web development, from
              front-end interfaces and components to performance optimization,
              release workflows, CMS integrations and collaboration with teams
              and stakeholders.
            </p>
            <div class="actions">
              <a
                href="/doc/Matteo_Lullo_CV.pdf"
                target="_blank"
                rel="noopener"
                class="button-one corporate-action"
                >Download CV</a
              >
              <button
                type="button"
                class="button-one corporate-action"
                :aria-expanded="expandedBio"
                @click="expandedBio = !expandedBio"
              >
                {{ expandedBio ? "Close bio" : "Read extended bio" }}
              </button>
            </div>
            <div
              class="extended-bio corporate-bio"
              :class="{ 'is-open': expandedBio }"
            >
              <div>
                <p>
                  I currently work as a Software Engineer at iliad, building web
                  applications for corporate platforms and customer care
                  workflows, also contributing to projects in collaboration with
                  the iliad / Free Mobile group.
                </p>
                <p>
                  My main focus is frontend development with Vue.js, Nuxt.js,
                  Angular and TypeScript, with backend integrations in PHP,
                  Python and Node.js when needed. I have integrated Strapi in
                  corporate projects to improve content management and
                  efficiency.
                </p>
                <p>
                  Previously, I worked on high-traffic digital products for RCS
                  Media Group and Sky Italia, building front-end components,
                  HTML/SCSS layouts, JavaScript ES6 features, tests, AEM/SSI
                  integrations, technical SEO and performance optimizations with
                  a focus on Google Web Vitals.
                </p>
                <p>
                  I have acted as focal point and operational coordinator,
                  working with consultants, editorial teams and marketing
                  stakeholders. I use Docker, Argo, MinIO, Git and Docker/SSH
                  releases, always aiming for lean, sustainable and
                  quality-oriented workflows.
                </p>
                <p>
                  I use AI as an operational and strategic support when facing
                  project challenges: it helps me reason better, accelerate
                  analysis and prototyping, compare alternatives and keep the
                  quality of technical decisions high.
                </p>
              </div>
            </div>
            <div class="corporate-links" aria-label="Talks and media">
              <h2>Talks and media</h2>
              <a
                href="https://www.youtube.com/watch?v=rp_HrmK21BA&list=PLWK9j6ps_unkp5H3oUSzonh51Jze103Hc&index=6"
                target="_blank"
                rel="noopener"
              >
                Web performance talk - CSSDay
              </a>
              <a
                href="https://www.gitbar.it/episode/ep84-web-performance-con-matteo-lullo-sky-italia"
                target="_blank"
                rel="noopener"
              >
                Gitbar podcast: Web Performance with Matteo Lullo
              </a>
              <a
                href="https://www.wemakefuture.it/i/618a4f8a6658c42af4c3f5dd/"
                target="_blank"
                rel="noopener"
              >
                Speaker profile - WMF / Rimini Web Marketing
              </a>
            </div>
          </article>
          <aside class="corporate-photo">
            <img src="/img/io-corporate.jpeg" alt="Matteo Lullo" />
          </aside>
        </div>
      </section>
    </main>
  </div>
</template>
