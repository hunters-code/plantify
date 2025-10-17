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
  ...compat.extends("prettier"), // This must be last to override other configs
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "next-env.d.ts",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // Indentation and formatting - matching Prettier config
      "indent": "off", // Disable strict indentation for now
      "no-tabs": "warn", // Change to warning
      "no-trailing-spaces": "warn",
      "no-multiple-empty-lines": "warn",
      "eol-last": "warn",
      
      // Import order and organization
      "import/order": [
        "error",
        {
          "groups": [
            "builtin",     // Node.js built-in modules
            "external",    // npm packages
            "internal",    // Internal modules (using path mapping)
            "parent",      // Parent directory imports
            "sibling",     // Same directory imports
            "index"        // Index file imports
          ],
          "pathGroups": [
            {
              "pattern": "react",
              "group": "external",
              "position": "before"
            },
            {
              "pattern": "next/**",
              "group": "external",
              "position": "before"
            },
            {
              "pattern": "@/**",
              "group": "internal",
              "position": "before"
            }
          ],
          "pathGroupsExcludedImportTypes": ["react", "next"],
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
      
      // Code style - let Prettier handle formatting
      "quotes": "off", // Let Prettier handle quotes
      "semi": "off", // Let Prettier handle semicolons
      "comma-dangle": "off", // Let Prettier handle trailing commas
      "object-curly-spacing": "off", // Let Prettier handle spacing
      "array-bracket-spacing": "off", // Let Prettier handle spacing
      "computed-property-spacing": "off", // Let Prettier handle spacing
      "space-before-blocks": "off", // Let Prettier handle spacing
      "keyword-spacing": "off", // Let Prettier handle spacing
      "space-infix-ops": "off", // Let Prettier handle spacing
      "space-before-function-paren": "off", // Let Prettier handle spacing
      "jsx-quotes": "off", // Let Prettier handle JSX quotes
      "arrow-parens": "off", // Let Prettier handle arrow function parentheses
      
      // Additional rules that work well with Prettier
      "max-len": "off", // Let Prettier handle line length
      "indent": "off", // Let Prettier handle indentation
      "no-multi-spaces": "off", // Let Prettier handle spacing
      "no-trailing-spaces": "off", // Let Prettier handle trailing spaces
      "eol-last": "off", // Let Prettier handle end of line
      
      // Unused variables and imports
      "no-unused-vars": "off", // Turn off base rule as it can report incorrect errors
      "react/no-unescaped-entities": "error"
    }
  }
];

export default eslintConfig;
