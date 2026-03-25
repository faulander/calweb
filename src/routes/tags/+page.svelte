<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	let { data } = $props();
</script>

<svelte:head>
	<title>{m.tags_title()}</title>
</svelte:head>

<div class="space-y-4">
	<h1 class="text-xl font-bold text-neutral-900 dark:text-neutral-100">{m.tags_heading()}</h1>

	<div class="flex flex-wrap gap-2">
		{#each data.tags as tag}
			<a
				href={localizeHref(`/tags/${tag.id}`)}
				class="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
			>
				{tag.name}
				<span class="ml-1 text-neutral-400">({tag.book_count})</span>
			</a>
		{:else}
			<p class="py-12 text-neutral-500 dark:text-neutral-400">{m.tags_no_results()}</p>
		{/each}
	</div>
</div>
