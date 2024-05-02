import baseConfig from "@tanya.in/eslint-config/base";
import reactConfig from "@tanya.in/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [],
  },
  ...baseConfig,
  ...reactConfig,
];
