import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    ...compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended"),
    {
        plugins: {
            "@typescript-eslint": typescriptEslint,
        },

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },

            parser: tsParser,
            ecmaVersion: "latest",
            sourceType: "module",
        },

        rules: {
            // https://eslint.org/docs/latest/rules/eqeqeq
            // poka-yoke
            eqeqeq: ["error", "always"],

            // Indent is enforced by prettier
            indent: "off",
            "linebreak-style": ["warn", "unix"],

            // https://eslint.org/docs/latest/rules/quotes
            // consistency
            quotes: [
                "warn",
                "double",
                {
                    allowTemplateLiterals: true,
                    avoidEscape: true,
                },
            ],

            // https://eslint.org/docs/latest/rules/semi
            // poka-yoke
            semi: ["warn", "always"],
            "no-debugger": "warn",

            //
            // Es Lint Rules
            //

            // https://typescript-eslint.io/rules/no-inferrable-types/
            // disable - sometimes want to explicitly define types.
            "@typescript-eslint/no-inferrable-types": 0,
            // https://typescript-eslint.io/rules/no-var-requires/
            // disable - require is used in node js scripts
            "@typescript-eslint/no-var-requires": 0,

            "@typescript-eslint/no-require-imports": 0,
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    caughtErrors: "none",
                },
            ],

            // https://typescript-eslint.io/rules/naming-convention/
            // consistency
            "@typescript-eslint/naming-convention": [
                "warn",
                {
                    selector: ["default"],
                    format: ["strictCamelCase"],
                    leadingUnderscore: "forbid",
                    trailingUnderscore: "forbid",
                },
                {
                    selector: ["parameter"],
                    modifiers: ["unused"],
                    format: ["strictCamelCase"],
                    leadingUnderscore: "allow",
                    trailingUnderscore: "forbid",
                },
                // Allow import of React
                {
                    selector: "import",
                    format: ["camelCase", "PascalCase"],
                },
                {
                    selector: "function",
                    modifiers: ["exported"],
                    format: ["strictCamelCase", "StrictPascalCase"],
                },
                {
                    selector: ["variable"],
                    modifiers: ["const"],
                    format: ["strictCamelCase"],
                    leadingUnderscore: "forbid",
                    trailingUnderscore: "forbid",
                },
                {
                    selector: ["enumMember"],
                    format: ["PascalCase"],
                    leadingUnderscore: "forbid",
                    trailingUnderscore: "forbid",
                },
                {
                    selector: ["typeLike"],
                    format: ["StrictPascalCase"],
                },
                {
                    selector: ["interface"],
                    format: ["StrictPascalCase"],

                    custom: {
                        // Interface names must NOT be prefixed with I
                        regex: "^I[A-Z]",
                        match: false,
                    },
                },
            ],
        },
    },
];
