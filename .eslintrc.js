module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'google',
    'eslint-config-prettier',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  ignorePatterns: [
    '/lib/**/*', // Ignore built files.
  ],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'new-cap': 0,
    'require-jsdoc': 0,
    'no-invalid-this': 0,
    'import/namespace': 0,
    '@typescript-eslint/no-empty-function': 0,
    'linebreak-style': ['off'],
    'object-curly-spacing': ['error', 'always'],
    'max-len': ['error', { code: 150 }],
    quotes: ['error', 'single'],
    indent: ['error', 2],
    curly: 'error',
    camelcase: 0,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
