'use strict';

module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  plugins: ['stylelint-prettier'],
  ignoreFiles: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx', '**/*.html'],
  rules: {
    'prettier/prettier': true,

    // Allow CSS variables
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['/^--/'],
      },
    ],

    // Allow at-rules used by tools like Tailwind/PostCSS
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'include',
          'mixin',
          'layer',
        ],
      },
    ],

    // Disable overly strict/verbose rules
    'no-empty-source': null,
    'no-descending-specificity': null,
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep'], // if Vue or other frameworks used
      },
    ],
  },
};
