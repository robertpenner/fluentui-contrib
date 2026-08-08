const baseConfig = require('../../eslint.config.js');

module.exports = [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    // Override or add rules here
    rules: {},
  },
  {
    files: ['src/cap-model/**/*.ts', 'src/cap-model/**/*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '**/domain/**',
            '**/research/**',
            '**/layered/**',
            '**/semantic/**',
            '**/testing/**',
            '**/render/**',
            '**/comparison/**',
            '**/emission/**',
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
];
