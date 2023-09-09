/** @type {import("prettier").Config} */
export default {
  "arrowParens": "always",
  "printWidth": 120,
  plugins: ["prettier-plugin-astro","prettier-plugin-tailwindcss"],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
}
