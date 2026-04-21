import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * M4a-polish a11y smoke test for the mobile navigation drawer.
 *
 * Covers the guarantees the drawer must uphold:
 *   1. No WCAG 2.1 AA violations (axe-core)
 *   2. Body scroll lock when drawer is open
 *   3. Esc key closes the drawer and returns focus to the hamburger trigger
 *   4. Focus is pulled into the drawer on open (first focusable inside panel)
 *
 * We target the mobile viewport explicitly because the drawer only renders
 * below the 840px desktop breakpoint.
 */
test.describe('@a11y mobile nav drawer', () => {
	test.use({ viewport: { width: 390, height: 844 } });

	test('has no WCAG AA violations when open', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: /menu/i }).click();
		await expect(page.getByRole('dialog', { name: 'Main menu' })).toBeVisible();

		const results = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
			.analyze();

		expect(results.violations).toEqual([]);
	});

	test('locks body scroll while open', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: /menu/i }).click();

		const locked = await page.evaluate(() => document.body.classList.contains('dv-scroll-locked'));
		expect(locked).toBe(true);
	});

	test('Esc closes drawer and restores focus to hamburger', async ({ page }) => {
		await page.goto('/');
		const trigger = page.getByRole('button', { name: /menu/i });
		await trigger.click();
		await expect(page.getByRole('dialog')).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(page.getByRole('dialog')).toHaveAttribute('aria-hidden', 'true');
		await expect(trigger).toBeFocused();
	});

	test('pulls focus into the panel on open', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: /menu/i }).click();

		const focusedInsidePanel = await page.evaluate(() => {
			const panel = document.getElementById('dv-nav-mobile-panel');
			return !!panel?.contains(document.activeElement);
		});
		expect(focusedInsidePanel).toBe(true);
	});
});
