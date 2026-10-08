import js from '@eslint/js';
import globals from 'globals';
export default [{ ignores: ['node_modules/**'] }, js.configs.recommended, { files: ['**/*.js'], languageOptions: { globals: { ...globals.node, ...globals.es2022 } }, rules: { 'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }] } }];
