// @ts-check
import eslint from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import importX from 'eslint-plugin-import-x'

export default tseslint.config(
    {
        ignores: ['eslint.config.mjs'],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    eslintPluginPrettierRecommended,
    {
        // 2. Registramos el plugin para que ESLint reconozca sus reglas
        plugins: {
            'import-x': importX,
        },
    },
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
            sourceType: 'commonjs',
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-floating-promises': 'warn',
            '@typescript-eslint/no-unsafe-argument': 'warn',
            'prettier/prettier': ['error', { endOfLine: 'auto' }],
            '@typescript-eslint/no-unsafe-call': 'off',
            'import-x/order': [
                'error',
                {
                    groups: [
                        'builtin', // Módulos nativos (fs, path, etc)
                        'external', // Librerías externas (@nestjs/common, mongoose)
                        'internal', // Rutas con alias si usas tsconfig paths
                        ['parent', 'sibling', 'index'], // Relativos (../../application, ./dtos)
                    ],
                    // Forzar un salto de línea entre bloques de importación
                    'newlines-between': 'always',
                    // Ordenar alfabéticamente dentro de cada grupo
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                    // Personalización fina para separar capas relativas si lo deseas
                    pathGroups: [
                        {
                            pattern: '**/application/**',
                            group: 'parent',
                            position: 'before',
                        },
                        {
                            pattern: '**/domain/**',
                            group: 'parent',
                            position: 'before',
                        },
                    ],
                    distinctGroup: false,
                },
            ],
        },
    },
)
