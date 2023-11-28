import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import defaultTheme from "tailwindcss/defaultTheme";

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Source Sans 3 Variable'", "'Source Sans 3'", ...defaultTheme.fontFamily.sans],
        display: ["'Jost Variable'", ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#cac2bc",
        secondary: "#7d7168",
      },
      animation: {
        "scroll-indicator-fade": "scroll-indicator-fade 2s linear infinite",
      },
      keyframes: {
        "scroll-indicator-fade": {
          "0%": {
            transform: "rotate(-45deg) translateX(0) translateY(0)",
            opacity: "0",
          },
          "60%": {
            opacity: "0.5",
          },
          "100%": {
            transform: "rotate(-45deg) translateX(-100%) translateY(100%)",
            opacity: "0",
          },
        },
      },
      textShadow: {
        sm: "0 1px 2px var(--tw-shadow-color)",
        DEFAULT: "-1px 1px var(--tw-shadow-color), 0 1px 5px var(--tw-shadow-color)",
        lg: "0 8px 16px var(--tw-shadow-color)",
      },
    },
  },
  plugins: [
    plugin(function({ matchUtilities, theme }) {
      matchUtilities(
        {
          "text-shadow": (value) => ({
            textShadow: value,
          }),
        },
        { values: theme("textShadow") },
      );
    }),
  ],
});

function defineConfig(config: Config): Config {
  return config;
}
