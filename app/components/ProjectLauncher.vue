<script setup lang="ts">
const projectStats = [
  ["html tools", "9"],
  ["folders", "7"],
  ["status", "ready"],
  ["base url", "/prj/"],
];

const projectGroups = [
  {
    title: "Beyblade & Tournament Tools",
    meta: "tools",
    items: [
      {
        icon: "◎",
        title: "Tracker Bey",
        description: "Tracker per punteggi, match e gestione prove Beyblade.",
        href: "/prj/tracker-bey.html",
      },
      {
        icon: "🏆",
        title: "Easy Tournament",
        description: "Gestione semplice di tornei, turni e abbinamenti.",
        href: "/prj/easy-tournament.html",
      },
      {
        icon: "♠",
        title: "Gambling",
        description: "Tool collegato ai tornei per prove, casualità e probabilità.",
        href: "/prj/gambling.html",
      },
      {
        icon: "◆",
        title: "Roulette",
        description: "Randomizer veloce per scelte, giochi o prove.",
        href: "/prj/roulette.html",
      },
    ],
  },
  {
    title: "Personal Tools",
    meta: "daily",
    items: [
      {
        icon: "▣",
        title: "Palestra",
        description: "Pagina dedicata ad allenamenti e organizzazione fitness.",
        href: "/prj/palestra.html",
      },
      {
        icon: "▤",
        title: "Scheda",
        description: "Scheda palestra principale per appunti, esercizi e routine.",
        href: "/prj/scheda.html",
      },
      {
        icon: "▧",
        title: "Pale",
        description: "Variante sperimentale della scheda palestra.",
        href: "/prj/pale.html",
      },
      {
        icon: "▨",
        title: "Pal",
        description: "Variante minimale della scheda palestra.",
        href: "/prj/pal.html",
      },
      {
        icon: "🍜",
        title: "Cibo",
        description: "Tool o pagina per pasti, idee e organizzazione alimentare.",
        href: "/prj/cibo.html",
      },
    ],
  },
  {
    title: "Project Folders",
    meta: "directories",
    items: [
      {
        icon: "✦",
        title: "Weebhub",
        description: "Cartella progetto / fan hub.",
        href: "/prj/weebhub/",
        folder: true,
      },
      {
        icon: "▰",
        title: "Votalive",
        description: "Cartella progetto dedicata a votazioni e live.",
        href: "/prj/votalive/",
        folder: true,
      },
      {
        icon: "◇",
        title: "Somekindofginger",
        description: "Archivio/progetto personale.",
        href: "/prj/somekindofginger/",
        folder: true,
      },
      {
        icon: "◈",
        title: "Shenmue",
        description: "Cartella dedicata al progetto Shenmue.",
        href: "/prj/shenmue/",
        folder: true,
      },
    ],
  },
  {
    title: "Archives & Memories",
    meta: "folders",
    items: [
      {
        icon: "♡",
        title: "Matrimonio Matteo-Ginevra",
        description: "Archivio matrimonio.",
        href: "/prj/matrimonio-matteo-ginevra/",
        folder: true,
      },
      {
        icon: "▣",
        title: "Foto Matrimonio",
        description: "Archivio fotografico.",
        href: "/prj/foto-matrimonio/",
        folder: true,
      },
      {
        icon: "▥",
        title: "OLD",
        description: "Vecchi file e progetti archiviati.",
        href: "/prj/OLD/",
        folder: true,
      },
    ],
  },
];
</script>

<template>
  <main class="project-page">
    <nav class="project-topbar" aria-label="Navigazione progetti">
      <a class="project-brand" href="/" aria-label="Torna alla home MatteoOS">
        <span>&gt;</span>MatteoOS V33
      </a>
      <a class="project-home" href="/prj/">Home PRJ</a>
    </nav>

    <section class="project-hero">
      <article class="project-hero-card">
        <div class="window-bar">
          <span class="dots" aria-hidden="true">
            <span class="dot" />
            <span class="dot" />
            <span class="dot" />
          </span>
          <span>/prj/index.html</span>
        </div>
        <div class="project-hero-content">
          <p class="project-eyebrow">&gt; project launcher loaded</p>
          <h1>Projects</h1>
          <p class="project-subtitle">
            Una dashboard semplice per raggiungere tool, esperimenti, varianti e archivi
            pubblicati nella cartella <strong>/prj/</strong>.
          </p>
        </div>
      </article>
      <aside class="project-stats-card" aria-label="Stato dashboard">
        <div v-for="[label, value] in projectStats" :key="label" class="project-stat">
          <span>{{ label }}</span>
          <span>{{ value }}</span>
        </div>
      </aside>
    </section>

    <section class="project-grid" aria-label="Lista progetti">
      <article v-for="group in projectGroups" :key="group.title" class="project-group">
        <h2>
          <span>{{ group.title }}</span>
          <small>{{ group.meta }}</small>
        </h2>
        <div class="project-links">
          <a
            v-for="item in group.items"
            :key="item.href"
            class="project-item"
            :class="{ folder: item.folder }"
            :href="item.href"
          >
            <span class="project-icon">{{ item.icon }}</span>
            <span>
              <strong>{{ item.title }}</strong>
              <em>{{ item.description }}</em>
            </span>
            <span class="project-open">OPEN →</span>
          </a>
        </div>
      </article>
    </section>

    <footer class="project-footer">
      Made with curiosity, side projects and MatteoOS energy.
    </footer>
  </main>
</template>
