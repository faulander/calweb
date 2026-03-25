import type { PageServerLoad } from './$types';
import { getBook } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const book = getBook(Number(params.id));
	if (!book) throw error(404, 'Book not found');
	return { book };
};
