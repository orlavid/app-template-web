/**
 * Colours come from design tokens. Raw hex values are allowed only in
 * src/styles/tokens.css, which owns the palette.
 */
export default {
  extends: ['stylelint-config-standard'],
  ignoreFiles: ['src/styles/vendor/**', 'dist/**', 'coverage/**', 'playwright-report/**', 'test-results/**'],
  rules: {
    'color-no-hex': true,
    'at-rule-no-unknown': [
      true,
      { ignoreAtRules: ['theme', 'custom-variant', 'apply', 'layer', 'utility', 'variant', 'source', 'plugin'] },
    ],
    'at-rule-no-deprecated': [true, { ignoreAtRules: ['apply'] }],
    'import-notation': 'string',
    'custom-property-pattern': null,
    // Tailwind v4 at-rules are not standard CSS; stylelint cannot parse @apply preludes.
    'at-rule-prelude-no-invalid': null,
    // Keep the oklch() notation that the shadcn CLI writes, so CLI updates stay diffable.
    'lightness-notation': null,
    'hue-degree-notation': null,
  },
  overrides: [
    {
      files: ['src/styles/tokens.css'],
      rules: { 'color-no-hex': null },
    },
  ],
}
