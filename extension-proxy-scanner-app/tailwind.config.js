function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`;
    }
    return `rgb(var(${variable}) / ${opacityValue})`;
  };
}

module.exports = {
  content: ["./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: withOpacityValue("--color-brand"),
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
