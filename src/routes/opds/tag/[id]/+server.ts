import type { RequestHandler } from './$types';
import { getBooks, getTags } from '$lib/server/db';
import { wrapFeed, bookToEntry, opdsResponse } from '$lib/server/opds';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, url }) => {
	const baseUrl = url.origin;
	const tagId = Number(params.id);
	const tags = getTags();
	const tag = tags.find((t) => t.id === tagId);
	if (!tag) throw error(404, 'Tag not found');

	const result = getBooks({ tag: tagId, limit: 100 });

	const xml = wrapFeed({
		id: `urn:calweb:tag:${tag.id}`,
		title: tag.name,
		baseUrl,
		selfHref: `${baseUrl}/opds/tag/${tag.id}`,
		entries: result.items.map((b) => bookToEntry(b, baseUrl)).join('\n')
	});

	return opdsResponse(xml);
};
