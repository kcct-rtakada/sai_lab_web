const nextCoreWebVitals = require('eslint-config-next/core-web-vitals');
const prettierConfig = require('eslint-config-prettier');

const withProjectRules = nextCoreWebVitals.map((entry) => {
  if (entry && entry.name === 'next') {
    return {
      ...entry,
      languageOptions: {
        ...entry.languageOptions,
        globals: {
          ...entry.languageOptions?.globals,
          RequestInit: 'readonly',
        },
      },
      rules: {
        ...entry.rules,
        'import/order': [
          'error',
          {
            groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
            pathGroups: [
              {
                pattern: '{react,react-dom/**,react-router-dom}',
                group: 'builtin',
                position: 'before',
              },
            ],
            pathGroupsExcludedImportTypes: ['builtin'],
            alphabetize: {
              order: 'asc',
            },
          },
        ],
      },
    };
  }
  return entry;
});

module.exports = [...withProjectRules, prettierConfig];
