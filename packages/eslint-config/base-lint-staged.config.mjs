export default {
  // TypeScript and JavaScript files
  '{src,apps,libs,test}/**/*.ts': [
    // Run ESLint with auto-fix
    'eslint --fix',

    // Format with Prettier
    'prettier --write',

    // Add files back to staging after fixes
    'git add',
  ],

  // JSON files (package.json, tsconfig.json, etc.)
  '**/*.{json,jsonc}': ['prettier --write', 'git add'],

  // Markdown files
  '**/*.{md,mdx}': ['prettier --write', 'git add'],
};
