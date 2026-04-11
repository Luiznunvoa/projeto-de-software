import js from '@eslint/js';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import importPlugin from 'eslint-plugin-import';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

const tsconfigRootDir = path.dirname(fileURLToPath(import.meta.url));
const tsFiles = ['**/*.{ts,tsx,mts,cts}'];
const typeCheckedConfigs = tseslint.configs.recommendedTypeChecked.map((config) => ({
  ...config,
  files: tsFiles
}));
const stylisticTypeCheckedConfigs = tseslint.configs.stylisticTypeChecked.map((config) => ({
  ...config,
  files: tsFiles
}));

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'public/**', 'coverage/**', '*.min.js']
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.node
      }
    },
    rules: {
      'no-unused-vars': 'warn'
    }
  },
  ...typeCheckedConfigs,
  ...stylisticTypeCheckedConfigs,
  {
    files: tsFiles,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      import: importPlugin
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
          alwaysTryTypes: true
        }
      }
    },
    rules: {
      'import/no-unresolved': 'error',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          }
        }
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports'
        }
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      'no-console': 'warn'
    }
  },
  {
    files: ['src/**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off'
    }
  },
  prettierRecommended
);
