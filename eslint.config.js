import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import angular from "@angular-eslint/eslint-plugin";
import angularTemplate from "@angular-eslint/eslint-plugin-template";

export default [
  js.configs.recommended, // Default JavaScript linting rules
  {
    files: ["*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module"
      }
    },
    plugins: {
      "@typescript-eslint": ts,
      "@angular-eslint": angular
    },
    rules: {
      // TypeScript Rules
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-inferrable-types": ["error", { "ignoreParameters": true }],
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/no-misused-new": "error",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // Best Practices
      "prefer-const": "error",
      "no-var": "error",
      "eqeqeq": ["error", "smart"],
      "radix": "error",
      "no-eval": "error",
      "no-debugger": "error",
      "no-console": ["error", { "allow": ["warn", "error"] }],
      "no-bitwise": "error",
      "no-duplicate-imports": "error",
      "no-empty": "warn",
      "no-empty-interface": "error",
      "object-curly-spacing": ["error", "always"],
      "sort-imports": ["error", { "ignoreCase": true, "ignoreDeclarationSort": true }],
      "import/order": [
        "error",
        {
          "groups": ["builtin", "external", "internal"],
          "alphabetize": { "order": "asc", "caseInsensitive": true }
        }
      ],

      // Angular-Specific Rules
      "@angular-eslint/component-selector": [
        "error",
        { "type": "element", "prefix": "app", "style": "kebab-case" }
      ],
      "@angular-eslint/directive-selector": [
        "error",
        { "type": "attribute", "prefix": "app", "style": "camelCase" }
      ],
      "@angular-eslint/no-output-on-prefix": "error",
      "@angular-eslint/use-lifecycle-interface": "error",
      "@angular-eslint/use-pipe-transform-interface": "error",
      "@angular-eslint/no-input-rename": "error",
      "@angular-eslint/no-output-rename": "error",
      "@angular-eslint/component-class-suffix": ["error", { "suffixes": ["Component"] }],
      "@angular-eslint/directive-class-suffix": ["error", { "suffixes": ["Directive"] }]
    }
  },
  {
    files: ["*.html"],
    plugins: {
      "@angular-eslint/template": angularTemplate
    },
    rules: {
      // Linting rules for Angular templates
    }
  }
];
