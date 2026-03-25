<script lang="ts">
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { seriesCount, bookCount } from '$lib/i18n';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import Pagination from '$lib/components/Pagination.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{m.series_title()}</title>
</svelte:head>

<div class="space-y-4">
	<h1 class="text-xl font-bold text-neutral-900 dark:text-neutral-100">{m.series_heading()}</h1>

	<div class="max-w-md">
		<SearchBar value={data.search || ''} action="/series" placeholder={m.search_series()} />
	</div>

	<p class="text-sm text-neutral-500 dark:text-neutral-400">
		{seriesCount(data.series.total)}
	</p>

	<div class="grid gap-1">
		{#each data.series.items as s}
			<a
				href={localizeHref(`/series/${s.id}`)}
				class="flex items-center justify-between rounded-lg px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800"
			>
				<span class="font-medium text-neutral-900 dark:text-neutral-100">{s.name}</span>
				<span class="text-sm text-neutral-400">{bookCount(s.book_count)}</span>
			</a>
		{:else}
			<p class="py-12 text-center text-neutral-500 dark:text-neutral-400">{m.series_no_results()}</p>
		{/each}
	</div>

	<Pagination page={data.series.page} totalPages={data.series.totalPages} baseUrl={page.url.pathname + page.url.search} />
</div>
