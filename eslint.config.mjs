import js from '@eslint/js';

export default [
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            globals: {
                modalModule: 'readonly',
            },
        },
        rules: {
            // Only show a warning for unused variables
            'no-unused-vars': 'warn',

            // Let you use console.log freely
            'no-console': 'off',
        },
    },
];
