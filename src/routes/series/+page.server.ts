import type { PageServerLoad } from './$types';
import { getSeries } from '$lib/server/db';

export const load: PageServerLoad = async ({ url }) => {
	const page = Number(url.searchParams.get('page')) || 1;
	const search = url.searchParams.get('q') || undefined;
	return { series: getSeries(page, 50, search), search };
};
