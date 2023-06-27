// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: "./src",
  modules: [
    "nuxt-icon",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "nuxt-headlessui",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/eslint-module",
  ],
  plugins: [{ src: "~/plugins/toastify.ts", mode: "client" }],
});
