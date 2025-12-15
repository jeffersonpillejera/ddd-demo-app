// @ts-check
import eslintBaseConfig from '@ecore/eslint-config/eslint-base.config.mjs';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslintBaseConfig
);
