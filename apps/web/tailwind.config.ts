import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

import uiConfig from "@tanya.in/ui/config";

export default {
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  content: [...uiConfig.content, "../../packages/ui/**/*.{ts,tsx}"],
  presets: [uiConfig],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...fontFamily.mono],
      },
    },
  },
} satisfies Config;
