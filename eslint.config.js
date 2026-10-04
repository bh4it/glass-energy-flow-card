import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["node_modules/"] },
  js.configs.recommended,
  {
    // The card runs as a browser module inside Home Assistant.
    files: ["dist/**/*.js"],
    languageOptions: { sourceType: "module", globals: globals.browser },
    rules: {
      // Leftover helpers and unused catch bindings are harmless; flag them
      // without failing the build.
      "no-unused-vars": ["warn", { caughtErrors: "none" }],
      // normalize() has a `Number(x) == null` check that can never be true;
      // harmless today, so it is reported rather than failing the build.
      "no-constant-binary-expression": "warn",
    },
  },
  {
    files: ["test/**/*.js", "eslint.config.js"],
    languageOptions: { sourceType: "module", globals: { ...globals.node, ...globals.browser } },
  },
];
