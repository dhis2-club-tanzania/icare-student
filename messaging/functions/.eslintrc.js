module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended", "google"],
  rules: {
    "quotes": ["error", "double"],
    "require-jsdoc": 0,
    "indent": 0,
  },
  parserOptions: {
    sourceType: "script",
    ecmaVersion: 2017,
  },
};
