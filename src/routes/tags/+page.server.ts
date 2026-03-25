import type { PageServerLoad } from './$types';
import { getTags } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	return { tags: getTags() };
};
