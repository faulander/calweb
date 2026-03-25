<script lang="ts">
	import { page } from '$app/state';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import Pagination from '$lib/components/Pagination.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Authors — calweb</title>
</svelte:head>

<div class="space-y-4">
	<h1 class="text-xl font-bold text-neutral-900 dark:text-neutral-100">Authors</h1>

	<div class="max-w-md">
		<SearchBar value={data.search || ''} action="/authors" placeholder="Search authors..." />
	</div>

	<p class="text-sm text-neutral-500 dark:text-neutral-400">
		{data.authors.total} author{data.authors.total !== 1 ? 's' : ''}
	</p>

	<div class="grid gap-1">
		{#each data.authors.items as author}
			<a
				href="/authors/{author.id}"
				class="flex items-center justify-between rounded-lg px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800"
			>
				<span class="font-medium text-neutral-900 dark:text-neutral-100">{author.name}</span>
				<span class="text-sm text-neutral-400">{author.book_count} book{author.book_count !== 1 ? 's' : ''}</span>
			</a>
		{:else}
			<p class="py-12 text-center text-neutral-500 dark:text-neutral-400">No authors found.</p>
		{/each}
	</div>

	<Pagination page={data.authors.page} totalPages={data.authors.totalPages} baseUrl={page.url.pathname + page.url.search} />
</div>
