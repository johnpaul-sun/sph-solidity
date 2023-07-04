module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-essential",
    "@nuxtjs/eslint-config-typescript",
    "plugin:prettier/recommended",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: "latest",
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "vue"],
  rules: {
    "vue/multi-word-component-names": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "vue/component-name-in-template-casing": [
      "warn",
      "PascalCase",
      {
        registeredComponentsOnly: false,
        ignores: [],
      },
    ],
    "prettier/prettier": [
      "warn",
      {
        trailingComma: "all",
        endOfLine: "auto",
      },
    ],
  },
};
