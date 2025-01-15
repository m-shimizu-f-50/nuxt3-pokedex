// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	css: ['~/assets/css/tailwind.css'],
	modules: ['@nuxt/eslint', '@pinia/nuxt'],
	postcss: {
		plugins: { tailwindcss: {} },
	},
	eslint: {
		config: {
			stylistic: true,
		},
	},
	runtimeConfig: {
		pokeapi: {
			baseURL: 'https://pokeapi.co/api/v2/',
		},
	},
});
