<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { bookCount } from '$lib/i18n';
	import BookCard from '$lib/components/BookCard.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.author.name} — {m.app_name()}</title>
</svelte:head>

<div class="space-y-4">
	<a href={localizeHref('/authors')} class="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200">
		<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M15 19l-7-7 7-7" /></svg>
		{m.authors_back()}
	</a>

	<h1 class="text-xl font-bold text-neutral-900 dark:text-neutral-100">{data.author.name}</h1>
	<p class="text-sm text-neutral-500 dark:text-neutral-400">{bookCount(data.author.book_count)}</p>

	<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
		{#each data.author.books as book}
			<BookCard {book} />
		{/each}
	</div>
</div>
