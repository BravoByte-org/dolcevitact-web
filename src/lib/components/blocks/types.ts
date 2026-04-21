/**
 * Shared block payload type.
 *
 * Directus' many-to-any (M2A) field surface gives each block a
 * `{ collection, item }` shape. `item` is a loosely-typed record in M4a —
 * M4c swaps this for the strict DTOs exported from `@bravobyte/types`
 * once we bring that package back in as a workspace dep.
 */
export type Block = {
	id?: string | number;
	sort?: number | null;
	collection: string;
	item: Record<string, unknown>;
};
