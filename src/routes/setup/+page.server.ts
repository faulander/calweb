import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { hasUsers, createUser, createSession } from '$lib/server/auth';

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
			return fail(400, { error: 'Username and password are required', username });
		}

		if (username.length < 2) {
			return fail(400, { error: 'Username must be at least 2 characters', username });
		}

		if (password.length < 8) {
			return fail(400, { error: 'Password must be at least 8 characters', username });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match', username });
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
