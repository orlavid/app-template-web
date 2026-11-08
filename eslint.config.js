import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/**
 * Product code composes the shadcn/ui primitives in src/components/ui/.
 * It never imports Radix directly. Only src/components/ui/** may do that.
 */
const RADIX_IMPORT_BAN = {
  paths: [
    {
      name: 'radix-ui',
      message: 'Import the shadcn/ui wrapper from @/components/ui/* instead of Radix.',
    },
  ],
  patterns: [
    {
      group: ['@radix-ui/*'],
      message: 'Import the shadcn/ui wrapper from @/components/ui/* instead of Radix.',
    },
  ],
}

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'playwright-report', 'test-results']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strict,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    rules: {
      'no-restricted-imports': ['error', RADIX_IMPORT_BAN],
    },
  },
  {
    // shadcn/ui primitives: the only place Radix may be imported.
    files: ['src/components/ui/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['*.config.{ts,js}', 'e2e/**/*.ts'],
    languageOptions: { globals: globals.node },
  },
])
