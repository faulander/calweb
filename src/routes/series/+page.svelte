<script lang="ts">
	import { page } from '$app/state';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import Pagination from '$lib/components/Pagination.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Series — calweb</title>
</svelte:head>

<div class="space-y-4">
	<h1 class="text-xl font-bold text-neutral-900 dark:text-neutral-100">Series</h1>

	<div class="max-w-md">
		<SearchBar value={data.search || ''} action="/series" placeholder="Search series..." />
	</div>

	<p class="text-sm text-neutral-500 dark:text-neutral-400">
		{data.series.total} series
	</p>

	<div class="grid gap-1">
		{#each data.series.items as s}
			<a
				href="/series/{s.id}"
				class="flex items-center justify-between rounded-lg px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800"
			>
				<span class="font-medium text-neutral-900 dark:text-neutral-100">{s.name}</span>
				<span class="text-sm text-neutral-400">{s.book_count} book{s.book_count !== 1 ? 's' : ''}</span>
			</a>
		{:else}
			<p class="py-12 text-center text-neutral-500 dark:text-neutral-400">No series found.</p>
		{/each}
	</div>

	<Pagination page={data.series.page} totalPages={data.series.totalPages} baseUrl={page.url.pathname + page.url.search} />
</div>
