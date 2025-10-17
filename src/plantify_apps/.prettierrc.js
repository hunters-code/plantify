module.exports = {
  // Core formatting rules
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,

  // Object and array formatting
  bracketSpacing: true,
  bracketSameLine: false,

  // Function formatting
  arrowParens: 'avoid',

  // Line endings
  endOfLine: 'lf',

  // JSX specific
  jsxSingleQuote: true,

  // Object property quotes
  quoteProps: 'as-needed',

  // File-specific overrides
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 120,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 100,
        proseWrap: 'always',
      },
    },
  ],
};
