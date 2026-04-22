import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist',
    '.tmp-panora-ref/**',
    'src/app/App.tsx',
    'src/app/routes.ts',
    'src/app/pages/LandingCalendar.tsx',
    'src/app/components/AIInsightCard.tsx',
    'src/app/components/OrganizeDayModal.tsx',
    'src/app/components/ProcrastinationAlert.tsx',
    'src/app/components/ui/**',
    'src/app/services/aiEngine.ts',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
