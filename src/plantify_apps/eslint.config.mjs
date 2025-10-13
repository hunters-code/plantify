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
      "indent": "off", // Disable strict indentation for now
      "no-tabs": "warn", // Change to warning
      "no-trailing-spaces": "warn",
      "no-multiple-empty-lines": "warn",
      "eol-last": "warn"
      
      // Import order and organization
      "import/order": "warn", // Change to warning
      "import/no-duplicates": "warn",
      "import/first": "warn",
      "import/newline-after-import": "warn",
      
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
      "quotes": "warn", // Change to warning
      "semi": "warn", // Change to warning
      "comma-dangle": "warn", // Change to warning
      "object-curly-spacing": "warn",
      "array-bracket-spacing": "warn",
      "computed-property-spacing": "warn",
      "space-before-blocks": "warn",
      "keyword-spacing": "warn",
      "space-infix-ops": "warn",
      "space-before-function-paren": "warn",
      "jsx-quotes": "warn",
      "arrow-parens": "warn"
      
      // Unused variables and imports
      "no-unused-vars": "off", // Turn off base rule as it can report incorrect errors
      "react/no-unescaped-entities": "error"
    }
  }
];

export default eslintConfig;
