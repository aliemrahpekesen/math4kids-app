import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

const TELEMETRY_BANLIST = [
  '@sentry/*',
  'mixpanel-browser',
  'posthog-js',
  '@google-analytics/*',
  'plausible-tracker',
  '@datadog/browser-rum',
  '@datadog/browser-logs',
  'amplitude-js',
  '@amplitude/analytics-browser',
  'segment-analytics-next',
  'rudder-sdk-js',
];

export default tseslint.config(
  {
    ignores: [
      'dist/',
      'coverage/',
      'storybook-static/',
      'playwright-report/',
      'test-results/',
      'node_modules/',
    ],
  },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      jsxA11y.flatConfigs.recommended,
      prettierConfig,
    ],
    files: ['src/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: TELEMETRY_BANLIST,
              message:
                'Third-party telemetry/analytics SDKs are banned in v1 per ADR-0001 (KVKK / GDPR-K compliance).',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['*.{js,cjs,mjs}', 'vite.config.ts'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node },
    },
  }
);
