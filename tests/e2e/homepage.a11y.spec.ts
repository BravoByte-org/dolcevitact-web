import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * M6c — full-page a11y smoke (WCAG 2.1 AA) + core keyboard path for the
 * marketing homepage. Complements the mobile-drawer spec: this covers the
 * long-scroll SPA in both desktop and mobile viewports *before* opening
 * the hamburger.
 *
 * The drawer variant is still exercised in `nav-drawer.a11y.spec.ts`.
 */

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] as const;

test.describe('@a11y homepage', () => {
	test.describe('full-page axe (desktop chrome)', () => {
		test.use({ viewport: { width: 1280, height: 720 } });

		test('has no WCAG AA violations', async ({ page }) => {
			await page.goto('/');
			await expect(page.getByRole('main')).toBeVisible();

			const results = await new AxeBuilder({ page }).withTags([...WCAG]).analyze();
			expect(results.violations).toEqual([]);
		});
	});

	test.describe('full-page axe (mobile / drawer closed)', () => {
		test.use({ viewport: { width: 390, height: 844 } });

		test('has no WCAG AA violations', async ({ page }) => {
			await page.goto('/');

			const results = await new AxeBuilder({ page }).withTags([...WCAG]).analyze();
			expect(results.violations).toEqual([]);
		});
	});

	test.describe('skip link and keyboard (desktop)', () => {
		test.use({ viewport: { width: 1280, height: 720 } });

		test('first Tab focuses the skip link; Enter moves focus to main', async ({ page }) => {
			await page.goto('/');

			await page.keyboard.press('Tab');
			const skip = page.getByRole('link', { name: 'Skip to content' });
			await expect(skip).toBeFocused();
			await page.keyboard.press('Enter');
			await expect(page.locator('#main')).toBeFocused();
		});

		test('can Tab to the desktop Reserve CTA in the header', async ({ page }) => {
			await page.goto('/');

			// After skip, tab through focusable content until the primary nav CTA.
			for (let i = 0; i < 16; i++) {
				const reserve = page.getByRole('link', { name: 'Reserve', exact: true });
				if (await reserve.evaluate((el) => el === document.activeElement)) {
					return;
				}
				await page.keyboard.press('Tab');
			}
			throw new Error('Could not reach the Reserve link via keyboard within 16 Tab stops');
		});
	});
});
