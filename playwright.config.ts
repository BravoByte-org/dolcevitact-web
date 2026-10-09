import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for a11y smoke tests against the preview build.
 *
 * Runs `pnpm build && pnpm preview` locally before tests unless PW_NO_WEBSERVER=1.
 * Keep scope narrow: we lean on vitest for unit tests and use Playwright only
 * for a11y smoke paths that require a real browser (focus, dialogs, aria).
 */
export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: process.env.CI ? 'github' : 'list',
	use: {
		baseURL: 'http://localhost:4002',
		trace: 'on-first-retry'
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		},
		{
			name: 'mobile-chrome',
			use: { ...devices['Pixel 7'] }
		}
	],
	webServer: process.env.PW_NO_WEBSERVER
		? undefined
		: {
				command: 'pnpm build && pnpm preview',
				port: 4002,
				reuseExistingServer: !process.env.CI,
				timeout: 120_000
			}
});
