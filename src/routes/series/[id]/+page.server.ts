import type { PageServerLoad } from './$types';
import { getSeriesDetail } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const series = getSeriesDetail(Number(params.id));
	if (!series) throw error(404, 'Series not found');
	return { series };
};
