import type { PageServerLoad } from './$types';
import { getBooks, getTags } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, url }) => {
	const tagId = Number(params.id);
	const tags = getTags();
	const tag = tags.find((t) => t.id === tagId);
	if (!tag) throw error(404, 'Tag not found');

	const page = Number(url.searchParams.get('page')) || 1;
	const books = getBooks({ tag: tagId, page, limit: 24, sort: 'title' });

	return { tag, books };
};
