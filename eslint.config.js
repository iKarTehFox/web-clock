import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
    js.configs.recommended,
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 'latest',
            sourceType: 'module'
        },
        plugins: {
            '@typescript-eslint': tsPlugin
        },
        rules: {
            'indent': ['error', 4],
            'linebreak-style': ['error', 'windows'],
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
            'no-unused-vars': 'off',
            'no-undef': 'off',
            '@typescript-eslint/no-explicit-any': 'off'
        }
    },
    {
        ignores: [
            'dist/**',
            'out/**',
            'bootstrap.bundle.min.js',
            'code.iconify.design_iconify-icon_1.0.7_iconify-icon.min.js',
            'datetime.d.ts',
            'forge.config.js',
            'numberToWords.min.js',
            'luxon.min.js',
            'webpack.config.js',
            'bootstrap.4.6.2.bundle.min.js',
            'jquery.3.5.1.min.js',
            'corejs.minified.min.js'
        ]
    }
];
