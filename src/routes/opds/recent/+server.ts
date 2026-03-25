import type { RequestHandler } from './$types';
import { getRecentBooks } from '$lib/server/db';
import { wrapFeed, bookToEntry, opdsResponse } from '$lib/server/opds';

export const GET: RequestHandler = async ({ url }) => {
	const baseUrl = url.origin;
	const books = getRecentBooks(50);

	const xml = wrapFeed({
		id: 'urn:calweb:recent',
		title: 'Recent Books',
		baseUrl,
		selfHref: `${baseUrl}/opds/recent`,
		entries: books.map((b) => bookToEntry(b, baseUrl)).join('\n')
	});

	return opdsResponse(xml);
};
