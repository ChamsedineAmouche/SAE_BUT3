const js = require("@eslint/js");

module.exports = [
    js.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "commonjs", // Restez avec "commonjs"
            globals: {
                jest: "readonly",
                module: "readonly",
                require: "readonly",
                process: "readonly",
            },
        },
        rules: {
            camelcase: ["error", { properties: "always" }],
            "new-cap": ["error", { newIsCap: true, capIsNew: false }],
            "max-lines-per-function": ["error", { max: 30, skipComments: true }],
            indent: [
                "error",
                4,
                {
                    ignoredNodes: ["TemplateLiteral"],
                },
            ],
            "no-undef": "off",
            "no-unused-vars" : "off",
        },
    },
];