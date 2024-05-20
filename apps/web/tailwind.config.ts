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
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        flicker: {
          "0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%": {
            opacity: "0.99",
            filter:
              "drop-shadow(0 0 1px rgba(252, 211, 77)) drop-shadow(0 0 15px rgba(245, 158, 11)) drop-shadow(0 0 1px rgba(252, 211, 77))",
          },
          "20%, 21.999%, 63%, 63.999%, 65%, 69.999%": {
            opacity: "0.4",
            filter: "none",
          },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.2s ease-out infinite",
        flicker: "flicker 3s linear infinite",
      },
    },
  },
} satisfies Config;
