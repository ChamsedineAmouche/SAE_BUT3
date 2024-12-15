import js from "@eslint/js";
import react from "eslint-plugin-react";
import babelParser from "@babel/eslint-parser";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    plugins: { react },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false, // Add this line
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      indent: [
        "warn",
        2,
        {
          ignoredNodes: ["TemplateLiteral"],
        },
      ],
      camelcase: ["error", { properties: "always" }],
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "no-undef": "off",
      "no-unused-vars": "off",
    },
  },
];
