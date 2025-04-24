// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';


import tailwindcss from '@tailwindcss/vite';


// https://astro.build/config
export default defineConfig({
	site: 'https://stargazers.club', // TODO replace when in prod
	integrations: [
		starlight({
			title: 'green_dot documentation',
			editLink: {
				baseUrl: 'https://github.com/withastro/starlight/edit/main/docs/', // TODO
			},
			logo: { src: 'logo.png' },
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
			customCss: [
				// Path to your Tailwind base styles:
				'./src/styles/global.css',
			],
		}),
	],

	vite: {
		plugins: [tailwindcss()],
	},
});