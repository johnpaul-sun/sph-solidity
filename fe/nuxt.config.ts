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
  app: {
    head: {
        title: 'SUNBLOCK',
        meta: [
          {
            property: "og:title",
            content: "SUNBLOCK",
          },
          {
            property: "og:description",
            content:
              "Contribute to projects and innovations that matter using Blockchain technology.",
          },
          {
            property: "og:image",
            content: "/favicon.ico",
          },
          { name: 'viewport', content: 'width=device-width, initial-scale=1' }
        ],
        link: [
          { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },
  },
  plugins: [
    { src: "~/plugins/toastify.ts", mode: "client" },
    { src: "~/plugins/ethers.ts", mode: "client" },
    { src: "~/plugins/isImageUrl.ts", mode: "client" },
  ],
  runtimeConfig: {
    public: {
      CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
    },
  },
});
