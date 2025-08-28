module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    // Disable problematic rules for production build
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    'prefer-const': 'warn',
    'no-console': 'off'
  },
  env: {
    browser: true,
    es6: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
};
