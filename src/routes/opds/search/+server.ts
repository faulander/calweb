import type { RequestHandler } from './$types';
import { getBooks } from '$lib/server/db';
import { wrapFeed, bookToEntry, opdsResponse } from '$lib/server/opds';

export const GET: RequestHandler = async ({ url }) => {
	const baseUrl = url.origin;
	const query = url.searchParams.get('q') || '';

	if (!query) {
		// Return OpenSearch description
		const xml = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>calweb</ShortName>
  <Description>Search the calweb library</Description>
  <Url type="application/atom+xml;profile=opds-catalog;kind=acquisition" template="${baseUrl}/opds/search?q={searchTerms}"/>
</OpenSearchDescription>`;

		return new Response(xml, {
			headers: { 'Content-Type': 'application/opensearchdescription+xml' }
		});
	}

	const result = getBooks({ search: query, limit: 50 });

	const xml = wrapFeed({
		id: `urn:calweb:search:${query}`,
		title: `Search: ${query}`,
		baseUrl,
		selfHref: `${baseUrl}/opds/search?q=${encodeURIComponent(query)}`,
		entries: result.items.map((b) => bookToEntry(b, baseUrl)).join('\n')
	});

	return opdsResponse(xml);
};
