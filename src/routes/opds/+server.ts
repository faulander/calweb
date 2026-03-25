import type { RequestHandler } from './$types';
import { validateBasicAuth } from '$lib/server/auth';
import { wrapFeed, navigationEntry, opdsResponse } from '$lib/server/opds';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request, url }) => {
	const authHeader = request.headers.get('Authorization');
	if (authHeader && !validateBasicAuth(authHeader)) {
		throw error(401, 'Invalid credentials');
	}

	const baseUrl = url.origin;
	const xml = wrapFeed({
		id: 'urn:calweb:catalog',
		title: 'calweb Library',
		baseUrl,
		selfHref: `${baseUrl}/opds`,
		entries: [
			navigationEntry('urn:calweb:recent', 'Recent Books', `${baseUrl}/opds/recent`, 'Recently added books'),
			navigationEntry('urn:calweb:authors', 'By Author', `${baseUrl}/opds/authors`, 'Browse by author'),
			navigationEntry('urn:calweb:tags', 'By Tag', `${baseUrl}/opds/tags`, 'Browse by tag')
		].join('\n')
	});

	return opdsResponse(xml);
};
