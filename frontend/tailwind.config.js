module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gray1: "#f8f9fb",
        gray2: "#f5f7f8",
        gray3: "#f2f4f6",
        gray4: "#eaedf0",
        gray5: "#dfe3e7",
        gray6: "#cfd4d8",
        gray7: "#aeb3b7",
        gray8: "#909498",
        gray9: "#57595b",
        gray10: "#121212",
        green_sub: "#eefbf3",
        green_sub2: "#26b265",
        green_primary: "#2ac670",
        red_sub: "#fff2f2",
        red_sub2: "#ffe8e8",
        red_primary: "#ff6651",
        blue_sub: "#ebf4ff",
        blue_sub2: "#cce4ff",
        blue_sub3: "#006ee5",
        blue_primary: "#007aff",
        yellow_sub: "#fdad15",
        yellow_sub2: "#e49c13",
        yellow_primary: "#ffbe15",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
  variants: {
    backgroundColor: ({ after }) => after(["disabled"]),
  },
};