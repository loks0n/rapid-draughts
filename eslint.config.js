import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginTypeScript from 'typescript-eslint';
import pluginPrettier from 'eslint-config-prettier';

export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...pluginTypeScript.configs.recommended,
  pluginPrettier,
];
