import type { PageServerLoad } from './$types';
import { getBooks, getTags, getLanguages, getFormats } from '$lib/server/db';
import type { BooksQuery } from '$lib/server/db';

export const load: PageServerLoad = async ({ url }) => {
	const query: BooksQuery = {
		page: Number(url.searchParams.get('page')) || 1,
		limit: Number(url.searchParams.get('limit')) || 24,
		search: url.searchParams.get('q') || undefined,
		tag: Number(url.searchParams.get('tag')) || undefined,
		series: Number(url.searchParams.get('series')) || undefined,
		author: Number(url.searchParams.get('author')) || undefined,
		language: url.searchParams.get('language') || undefined,
		format: url.searchParams.get('format') || undefined,
		sort: (url.searchParams.get('sort') as BooksQuery['sort']) || 'title',
		order: (url.searchParams.get('order') as BooksQuery['order']) || 'asc'
	};

	return {
		books: getBooks(query),
		tags: getTags(),
		languages: getLanguages(),
		formats: getFormats(),
		query
	};
};
