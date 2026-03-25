import type { RequestHandler } from './$types';
import { getAuthors } from '$lib/server/db';
import { wrapFeed, navigationEntry, opdsResponse } from '$lib/server/opds';

export const GET: RequestHandler = async ({ url }) => {
	const baseUrl = url.origin;
	const result = getAuthors(1, 500);

	const xml = wrapFeed({
		id: 'urn:calweb:authors',
		title: 'Authors',
		baseUrl,
		selfHref: `${baseUrl}/opds/authors`,
		entries: result.items
			.map((a) =>
				navigationEntry(
					`urn:calweb:author:${a.id}`,
					a.name,
					`${baseUrl}/opds/author/${a.id}`,
					`${a.book_count} book${a.book_count !== 1 ? 's' : ''}`
				)
			)
			.join('\n')
	});

	return opdsResponse(xml);
};
