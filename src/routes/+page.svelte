<script lang="ts">
	import BookCard from '$lib/components/BookCard.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>calweb</title>
</svelte:head>

<div class="space-y-8">
	<!-- Search -->
	<div class="mx-auto max-w-xl">
		<SearchBar />
	</div>

	<!-- Stats -->
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
		{#each [
			{ label: 'Books', value: data.stats.books },
			{ label: 'Authors', value: data.stats.authors },
			{ label: 'Series', value: data.stats.series },
			{ label: 'Tags', value: data.stats.tags }
		] as stat}
			<div class="rounded-lg border border-neutral-200 bg-white p-4 text-center dark:border-neutral-700 dark:bg-neutral-800">
				<div class="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{stat.value.toLocaleString()}</div>
				<div class="text-sm text-neutral-500 dark:text-neutral-400">{stat.label}</div>
			</div>
		{/each}
	</div>

	<!-- Recent Books -->
	<section>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Recently Added</h2>
			<a href="/books?sort=added&order=desc" class="text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200">
				View all
			</a>
		</div>
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
			{#each data.recentBooks as book}
				<BookCard {book} />
			{/each}
		</div>
	</section>
</div>
