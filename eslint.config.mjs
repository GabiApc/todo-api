import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
	// Definire fișiere pentru ESLint
	{ files: ['**/*.{js,mjs,cjs,ts}'] },

	// Opțiuni pentru limbaje
	{ languageOptions: { globals: globals.browser } },

	// Configurarea recomandată de JavaScript
	pluginJs.configs.recommended,

	// Configurarea recomandată de TypeScript
	...tseslint.configs.recommended,

	// Configurarea Prettier
	{
		plugins: {
			prettier, // Activează pluginul Prettier
		},
		rules: {
			...prettier.rules, // Adaugă regulile Prettier
			'prettier/prettier': 'error', // Rulează Prettier ca regulă ESLint
		},
	},

	// Dezactivează regulile care pot intra în conflict cu Prettier
	prettierConfig,
];
