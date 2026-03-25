import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { authenticateUser, createSession } from '$lib/server/auth';
import * as m from '$lib/paraglide/messages.js';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) throw redirect(302, '/');
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString().trim();
		const password = data.get('password')?.toString();

		if (!username || !password) {
			return fail(400, { error: m.login_error_required(), username });
		}

		const user = authenticateUser(username, password);
		if (!user) {
			return fail(401, { error: m.login_error_invalid(), username });
		}

		const sessionId = createSession(user.id);
		cookies.set('session', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: 30 * 24 * 60 * 60
		});

		const returnTo = url.searchParams.get('returnTo') || '/';
		throw redirect(302, returnTo);
	}
};
