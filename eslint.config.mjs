import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Xác định môi trường từ biến môi trường hoặc mặc định là 'development'
const env = process.env.NODE_ENV || 'development';

const config = [
  // Sử dụng cấu hình cơ bản cho TypeScript
  {
    files: ['**/*.ts', '**/*.tsx'], // Chỉ áp dụng cho file TypeScript
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
      'no-console': [
        'error',
        {
          allow: env === 'development' ? ['log', 'warn', 'error'] : [],
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off', // Cho phép sử dụng any
      '@typescript-eslint/no-unused-vars': 'warn', // Cảnh báo nếu có biến không sử dụng
    },
  },
];

export default config;
