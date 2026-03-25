import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { hasUsers, createUser, createSession } from '$lib/server/auth';
import * as m from '$lib/paraglide/messages.js';

export const load: PageServerLoad = async () => {
	if (hasUsers()) throw redirect(302, '/login');
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		if (hasUsers()) throw redirect(302, '/login');

		const data = await request.formData();
		const username = data.get('username')?.toString().trim();
		const password = data.get('password')?.toString();
		const confirmPassword = data.get('confirmPassword')?.toString();

		if (!username || !password) {
			return fail(400, { error: m.setup_error_required(), username });
		}

		if (username.length < 2) {
			return fail(400, { error: m.setup_error_username_short(), username });
		}

		if (password.length < 8) {
			return fail(400, { error: m.setup_error_password_short(), username });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: m.setup_error_password_mismatch(), username });
		}

		const user = createUser(username, password);
		const sessionId = createSession(user.id);

		cookies.set('session', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: 30 * 24 * 60 * 60
		});

		throw redirect(302, '/');
	}
};
