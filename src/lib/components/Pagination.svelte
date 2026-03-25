<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	let {
		page,
		totalPages,
		baseUrl
	}: {
		page: number;
		totalPages: number;
		baseUrl: string;
	} = $props();

	function pageUrl(p: number): string {
		const url = new URL(baseUrl, 'http://localhost');
		url.searchParams.set('page', String(p));
		return localizeHref(url.pathname + url.search);
	}

	function visiblePages(): number[] {
		const pages: number[] = [];
		const start = Math.max(1, page - 2);
		const end = Math.min(totalPages, page + 2);
		for (let i = start; i <= end; i++) pages.push(i);
		return pages;
	}
</script>

{#if totalPages > 1}
	<nav class="flex items-center justify-center gap-1" aria-label={m.pagination_label()}>
		{#if page > 1}
			<a
				href={pageUrl(page - 1)}
				class="rounded px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
			>
				{m.pagination_previous()}
			</a>
		{/if}

		{#if visiblePages()[0] > 1}
			<a href={pageUrl(1)} class="rounded px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800">1</a>
			{#if visiblePages()[0] > 2}
				<span class="px-1 text-neutral-400">...</span>
			{/if}
		{/if}

		{#each visiblePages() as p}
			<a
				href={pageUrl(p)}
				class="rounded px-3 py-2 text-sm {p === page
					? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900'
					: 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'}"
				aria-current={p === page ? 'page' : undefined}
			>
				{p}
			</a>
		{/each}

		{#if visiblePages()[visiblePages().length - 1] < totalPages}
			{#if visiblePages()[visiblePages().length - 1] < totalPages - 1}
				<span class="px-1 text-neutral-400">...</span>
			{/if}
			<a href={pageUrl(totalPages)} class="rounded px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800">{totalPages}</a>
		{/if}

		{#if page < totalPages}
			<a
				href={pageUrl(page + 1)}
				class="rounded px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
			>
				{m.pagination_next()}
			</a>
		{/if}
	</nav>
{/if}
