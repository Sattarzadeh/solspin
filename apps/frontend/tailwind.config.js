const { createGlobPatternsForDependencies } = require("@nx/react/tailwind");
const { join } = require("path");
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, "{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}"),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  // #121319 - CSGOLUCK || #1d2126 - CSGOROLL || #1A1C24
  theme: {
    extend: {
      colors: {
        background: "#1A1C24",
        custom_gray: "#23303A",
        search_bar_gray: "#0e151a",
      },
      fontSize: {
        "2xs": ".75rem",
        "3xs": ".5rem",
        "4xs": ".4rem",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".grid-cols-dynamic": {
          "grid-template-columns": "repeat(auto-fit, minmax(272px, 272px))",
        },
      });
    }),
  ],
};
