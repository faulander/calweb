import type { PageServerLoad } from './$types';
import { getAuthors } from '$lib/server/db';

export const load: PageServerLoad = async ({ url }) => {
	const page = Number(url.searchParams.get('page')) || 1;
	const search = url.searchParams.get('q') || undefined;
	return { authors: getAuthors(page, 50, search), search };
};
