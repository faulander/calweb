import type { RequestHandler } from './$types';
import { getCoverPath } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { readFileSync, existsSync } from 'fs';

export const GET: RequestHandler = async ({ params }) => {
	const coverPath = getCoverPath(Number(params.id));
	if (!coverPath || !existsSync(coverPath)) throw error(404, 'Cover not found');

	const file = readFileSync(coverPath);
	return new Response(file, {
		headers: {
			'Content-Type': 'image/jpeg',
			'Cache-Control': 'public, max-age=86400'
		}
	});
};
