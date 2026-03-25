import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { redirect } from '@sveltejs/kit';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { validateSession, hasUsers } from '$lib/server/auth';

const PUBLIC_PATHS = ['/login', '/setup', '/opds'];

function isPublicPath(pathname: string): boolean {
	return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session');

	if (sessionId) {
		event.locals.user = validateSession(sessionId);
	} else {
		event.locals.user = null;
	}

	// Skip auth for public paths and static assets
	if (isPublicPath(event.url.pathname) || event.url.pathname.startsWith('/api/covers')) {
		return resolve(event);
	}

	// Redirect to setup if no users exist
	if (!hasUsers()) {
		if (event.url.pathname !== '/setup') {
			throw redirect(302, '/setup');
		}
		return resolve(event);
	}

	// Redirect to login if not authenticated
	if (!event.locals.user) {
		const returnTo = event.url.pathname + event.url.search;
		throw redirect(302, `/login?returnTo=${encodeURIComponent(returnTo)}`);
	}

	return resolve(event);
};

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html
					.replace('%paraglide.lang%', locale)
					.replace('%paraglide.dir%', getTextDirection(locale))
		});
	});

export const handle: Handle = sequence(handleAuth, handleParaglide);
