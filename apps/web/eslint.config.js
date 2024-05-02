import baseConfig, { restrictEnvAccess } from "@tanya.in/eslint-config/base";
import nextjsConfig from "@tanya.in/eslint-config/nextjs";
import reactConfig from "@tanya.in/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
