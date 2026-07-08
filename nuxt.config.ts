import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  srcDir: "app",
  compatibilityDate: "2026-07-07",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/eslint"],
  nitro: {
    preset: "static",
    prerender: {
      crawlLinks: false,
      routes: ["/", "/prj/"],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "it",
      },
      title: "Matteo Lullo | Creative Systems Builder",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Il personal website di Matteo Lullo, Creative Systems Builder: frontend developer, creativo e community builder.",
        },
        { name: "author", content: "Matteo Lullo" },
        {
          name: "keywords",
          content:
            "Matteo Lullo, Reddohige, frontend developer, creative systems builder, community builder, web performance, game design",
        },
        {
          name: "summary",
          content: "Il personal website di Matteo Lullo, Reddohige sul web.",
        },
        { name: "theme-color", content: "#080a10" },
        { property: "og:url", content: "https://www.matteolullo.it" },
        {
          property: "og:title",
          content: "Matteo Lullo | Creative Systems Builder",
        },
        {
          property: "og:description",
          content:
            "I build systems, communities and experiences that people genuinely enjoy using.",
        },
        {
          property: "og:image",
          content: "https://www.matteolullo.it/img/io-def.png",
        },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "it_IT" },
        {
          name: "twitter:title",
          content: "Matteo Lullo | Creative Systems Builder",
        },
        {
          name: "twitter:description",
          content:
            "I build systems, communities and experiences that people genuinely enjoy using.",
        },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:url", content: "https://www.matteolullo.it" },
        {
          name: "twitter:image",
          content: "https://www.matteolullo.it/img/io-def.png",
        },
        { name: "twitter:site", content: "@reddohige1" },
        { name: "twitter:creator", content: "@reddohige1" },
      ],
      link: [
        { rel: "canonical", href: "https://www.matteolullo.it" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Space+Grotesk:wght@400;500;700&family=VT323&display=swap",
        },
        { rel: "shortcut icon", href: "/favicon.ico" },
        { rel: "manifest", href: "/manifest.webmanifest" },
      ],
    },
  },
});
