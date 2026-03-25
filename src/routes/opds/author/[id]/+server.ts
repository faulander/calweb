import type { RequestHandler } from './$types';
import { getAuthor } from '$lib/server/db';
import { wrapFeed, bookToEntry, opdsResponse } from '$lib/server/opds';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, url }) => {
	const baseUrl = url.origin;
	const author = getAuthor(Number(params.id));
	if (!author) throw error(404, 'Author not found');

	const xml = wrapFeed({
		id: `urn:calweb:author:${author.id}`,
		title: author.name,
		baseUrl,
		selfHref: `${baseUrl}/opds/author/${author.id}`,
		entries: author.books.map((b) => bookToEntry(b, baseUrl)).join('\n')
	});

	return opdsResponse(xml);
};
