const { createGlobPatternsForDependencies } = require("@nx/react/tailwind");
const { join } = require("path");
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, "{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}"),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        background: "#070C1D",
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
