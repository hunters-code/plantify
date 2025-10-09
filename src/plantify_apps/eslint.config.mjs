import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // Indentation and formatting - matching Prettier config
      "indent": ["error", 2, { "SwitchCase": 1 }], // tabWidth: 2, useTabs: false
      "no-tabs": "error", // useTabs: false
      "no-trailing-spaces": "error",
      "no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1 }],
      "eol-last": "error", // endOfLine: "lf"
      
      // Import order and organization
      "import/order": [
        "error",
        {
          "groups": [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index"
          ],
          "newlines-between": "always",
          "alphabetize": {
            "order": "asc",
            "caseInsensitive": true
          }
        }
      ],
      "import/no-duplicates": "error",
      "import/first": "error",
      "import/newline-after-import": "error",
      
      // TypeScript specific rules
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // Change to warning
      "@typescript-eslint/no-explicit-any": "warn", // Change to warning for development
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",
      
      // React specific rules
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      
      // General code quality
      "no-console": "off", // Allow console statements in development
      "no-debugger": "error",
      "no-alert": "warn", // Change to warning instead of error
      "prefer-const": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "prefer-template": "error",
      
      // Next.js specific
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "warn", // Change to warning
      "@next/next/no-page-custom-font": "warn",
      
      // Accessibility
      "jsx-a11y/alt-text": "warn", // Change to warning
      "jsx-a11y/anchor-has-content": "warn", // Change to warning
      "jsx-a11y/anchor-is-valid": "warn", // Change to warning
      
      // Code style - matching Prettier config
      "quotes": ["error", "single", { "avoidEscape": true }], // singleQuote: true
      "semi": ["error", "always"], // semi: true
      "comma-dangle": ["error", {
        "arrays": "always-multiline",
        "objects": "always-multiline",
        "imports": "always-multiline",
        "exports": "always-multiline",
        "functions": "never"
      }], // trailingComma: "es5" equivalent
      "object-curly-spacing": ["error", "always"], // bracketSpacing: true
      "array-bracket-spacing": ["error", "never"],
      "computed-property-spacing": ["error", "never"],
      "space-before-blocks": "error",
      "keyword-spacing": "error",
      "space-infix-ops": "error",
      "space-before-function-paren": ["error", {
        "anonymous": "always",
        "named": "never",
        "asyncArrow": "always"
      }],
      "jsx-quotes": ["error", "prefer-single"], // jsxSingleQuote: true
      "arrow-parens": ["error", "as-needed"], // arrowParens: "avoid" equivalent
      
      // Unused variables and imports
      "no-unused-vars": "off", // Turn off base rule as it can report incorrect errors
      "react/no-unescaped-entities": "error"
    }
  }
];

export default eslintConfig;
