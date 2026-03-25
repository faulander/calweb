<script lang="ts">
	import { page } from '$app/state';
	import BookCard from '$lib/components/BookCard.svelte';
	import Pagination from '$lib/components/Pagination.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.tag.name} — calweb</title>
</svelte:head>

<div class="space-y-4">
	<a href="/tags" class="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200">
		<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M15 19l-7-7 7-7" /></svg>
		Back to tags
	</a>

	<h1 class="text-xl font-bold text-neutral-900 dark:text-neutral-100">{data.tag.name}</h1>
	<p class="text-sm text-neutral-500 dark:text-neutral-400">{data.books.total} book{data.books.total !== 1 ? 's' : ''}</p>

	<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
		{#each data.books.items as book}
			<BookCard {book} />
		{/each}
	</div>

	<Pagination page={data.books.page} totalPages={data.books.totalPages} baseUrl={page.url.pathname + page.url.search} />
</div>
