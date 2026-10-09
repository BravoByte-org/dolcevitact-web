/**
 * Navigation row shape returned by `fetchNavigation(...)`.
 *
 * Mirrors Directus' `navigation_items` surface: either a raw `url` (used
 * for section anchors on the single-page marketing site, e.g. `#rsvp`) or
 * a linked `page.slug` (used when a nav item targets another route).
 */
export type NavChild = {
	id: string | number;
	title: string;
	url?: string | null;
	open_in_new_tab?: boolean | null;
	sort?: number | null;
	page?: { slug: string; title: string } | null;
};

export type NavItem = NavChild & {
	children?: NavChild[] | null;
};
