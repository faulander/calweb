import type { RequestHandler } from './$types';
import { getTags } from '$lib/server/db';
import { wrapFeed, navigationEntry, opdsResponse } from '$lib/server/opds';

export const GET: RequestHandler = async ({ url }) => {
	const baseUrl = url.origin;
	const tags = getTags();

	const xml = wrapFeed({
		id: 'urn:calweb:tags',
		title: 'Tags',
		baseUrl,
		selfHref: `${baseUrl}/opds/tags`,
		entries: tags
			.map((t) =>
				navigationEntry(
					`urn:calweb:tag:${t.id}`,
					t.name,
					`${baseUrl}/opds/tag/${t.id}`,
					`${t.book_count} book${t.book_count !== 1 ? 's' : ''}`
				)
			)
			.join('\n')
	});

	return opdsResponse(xml);
};
