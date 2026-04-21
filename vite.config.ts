import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	resolve: {
		alias: {
			$lib: './src/lib',
			$components: './src/lib/components',
			$styles: './src/lib/styles',
			$util: './src/lib/util'
		}
	},
	test: {
		expect: { requireAssertions: true },
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'node',
		passWithNoTests: true
	}
});
