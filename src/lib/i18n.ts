import * as m from '$lib/paraglide/messages.js';

export function bookCount(count: number): string {
	return count === 1
		? m.book_count_one({ count: String(count) })
		: m.book_count_other({ count: String(count) });
}

export function authorCount(count: number): string {
	return count === 1
		? m.authors_count_one({ count: String(count) })
		: m.authors_count_other({ count: String(count) });
}

export function seriesCount(count: number): string {
	return m.series_count({ count: String(count) });
}
