import type { PageServerLoad } from './$types';
import { getRecentBooks, getStats } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	return {
		recentBooks: getRecentBooks(20),
		stats: getStats()
	};
};
