import type { PageServerLoad } from './$types';
import { getAuthor } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const author = getAuthor(Number(params.id));
	if (!author) throw error(404, 'Author not found');
	return { author };
};
