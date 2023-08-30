module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  env: { es2020: true, node: true },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  ignorePatterns: [".eslintrc"],
  rules: {
    quotes: ["error", "double"],
    "@typescript-eslint/no-explicit-any": "warn", // ! cambiar a error cuando se cambie las promises
    "no-unused-vars": "warn",
    "new-cap": "off",
    indent: ["error", 2],
    "linebreak-style": "off",
    semi: ["error", "always"],
    eqeqeq: "error",
    "no-trailing-spaces": "error",
    "object-curly-spacing": ["error", "always"],
    "arrow-spacing": ["error", { before: true, after: true }],
    "no-console": "off",
    "comma-spacing": "warn",
    curly: "warn",
    "operator-linebreak": "off",
    camelcase: "warn",
    "comma-dangle": "off",
    "no-duplicate-imports": "error",
    "no-floating-decimal": "error",
  },
  root: true,
};
