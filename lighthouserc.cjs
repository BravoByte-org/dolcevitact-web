/**
 * Lighthouse CI — run after a production build + `pnpm preview`.
 *
 *   pnpm build && pnpm preview &
 *   npx wait-on http://127.0.0.1:4002
 *   pnpm perf:lhci
 *
 * `performance` is set to 0.90 (not 0.95) because third-party font CSS,
 * Vercel analytics, and the embedded grain SVG still show up in the
 * critical path. Accessibility / SEO are held at 0.95+ so M6c tracks the
 * user-facing a11y + discoverability bar from issue #12.
 */
module.exports = {
	ci: {
		collect: {
			startServerCommand: 'pnpm preview',
			// Vite 7 prints "Local: http://localhost:4002/" (see `package.json#preview`)
			startServerReadyPattern: 'Local:',
			url: ['http://localhost:4002/'],
			numberOfRuns: 1
		},
		assert: {
			assertions: {
				'categories:performance': ['error', { minScore: 0.9 }],
				'categories:accessibility': ['error', { minScore: 0.95 }],
				'categories:best-practices': ['error', { minScore: 0.9 }],
				'categories:seo': ['error', { minScore: 0.95 }],
				// CLS guardrail (issue #12) — 0.02 ≈ 2% viewport shift; stricter
				// than Google's "good" 0.1 bucket for a hero-heavy one-pager.
				'cumulative-layout-shift': ['error', { maxNumericValue: 0.02 }]
			}
		}
	}
};
