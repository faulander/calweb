<script lang="ts">
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { bookCount } from '$lib/i18n';
	import BookCard from '$lib/components/BookCard.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import Pagination from '$lib/components/Pagination.svelte';

	let { data } = $props();

	let showFilters = $state(false);

	function filterUrl(key: string, value: string | null): string {
		const params = new URLSearchParams(page.url.search);
		if (value) {
			params.set(key, value);
		} else {
			params.delete(key);
		}
		params.delete('page');
		return localizeHref('/books?' + params.toString());
	}

	function sortUrl(sort: string): string {
		const params = new URLSearchParams(page.url.search);
		const currentSort = params.get('sort');
		const currentOrder = params.get('order') || 'asc';

		params.set('sort', sort);
		if (currentSort === sort) {
			params.set('order', currentOrder === 'asc' ? 'desc' : 'asc');
		} else {
			params.set('order', 'asc');
		}
		params.delete('page');
		return localizeHref('/books?' + params.toString());
	}
</script>

<svelte:head>
	<title>{m.books_title()}</title>
</svelte:head>

<div class="space-y-4">
	<!-- Search + Controls -->
	<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
		<div class="flex-1">
			<SearchBar value={data.query.search || ''} placeholder={m.search_books()} />
		</div>
		<div class="flex items-center gap-2">
			<button
				onclick={() => (showFilters = !showFilters)}
				class="rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
			>
				{m.books_filters()} {#if data.query.tag || data.query.language || data.query.format}<span class="ml-1 inline-block h-2 w-2 rounded-full bg-neutral-800 dark:bg-neutral-200"></span>{/if}
			</button>
		</div>
	</div>

	<!-- Sort -->
	<div class="flex flex-wrap gap-2 text-sm">
		<span class="text-neutral-500 dark:text-neutral-400">{m.books_sort()}</span>
		{#each [
			{ key: 'title', label: m.books_sort_title() },
			{ key: 'added', label: m.books_sort_added() },
			{ key: 'published', label: m.books_sort_published() },
			{ key: 'author', label: m.books_sort_author() }
		] as opt}
			<a
				href={sortUrl(opt.key)}
				class="rounded px-2 py-0.5 {data.query.sort === opt.key
					? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900'
					: 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'}"
			>
				{opt.label}
				{#if data.query.sort === opt.key}
					{data.query.order === 'desc' ? '↓' : '↑'}
				{/if}
			</a>
		{/each}
	</div>

	<!-- Filters -->
	{#if showFilters}
		<div class="grid gap-4 rounded-lg border border-neutral-200 bg-white p-4 sm:grid-cols-3 dark:border-neutral-700 dark:bg-neutral-800">
			<!-- Tags -->
			<div>
				<h3 class="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">{m.filter_tags()}</h3>
				<div class="flex flex-wrap gap-1">
					{#if data.query.tag}
						<a href={filterUrl('tag', null)} class="rounded bg-red-100 px-2 py-1 text-xs text-red-700 dark:bg-red-900/30 dark:text-red-400">
							{m.filter_clear()}
						</a>
					{/if}
					{#each data.tags as tag}
						<a
							href={filterUrl('tag', String(tag.id))}
							class="rounded px-2 py-1 text-xs {data.query.tag === tag.id
								? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900'
								: 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'}"
						>
							{tag.name} ({tag.book_count})
						</a>
					{/each}
				</div>
			</div>

			<!-- Languages -->
			<div>
				<h3 class="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">{m.filter_language()}</h3>
				<div class="flex flex-wrap gap-1">
					{#if data.query.language}
						<a href={filterUrl('language', null)} class="rounded bg-red-100 px-2 py-1 text-xs text-red-700 dark:bg-red-900/30 dark:text-red-400">
							{m.filter_clear()}
						</a>
					{/if}
					{#each data.languages as lang}
						<a
							href={filterUrl('language', lang.lang_code)}
							class="rounded px-2 py-1 text-xs {data.query.language === lang.lang_code
								? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900'
								: 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'}"
						>
							{lang.lang_code} ({lang.book_count})
						</a>
					{/each}
				</div>
			</div>

			<!-- Formats -->
			<div>
				<h3 class="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">{m.filter_format()}</h3>
				<div class="flex flex-wrap gap-1">
					{#if data.query.format}
						<a href={filterUrl('format', null)} class="rounded bg-red-100 px-2 py-1 text-xs text-red-700 dark:bg-red-900/30 dark:text-red-400">
							{m.filter_clear()}
						</a>
					{/if}
					{#each data.formats as fmt}
						<a
							href={filterUrl('format', fmt.format)}
							class="rounded px-2 py-1 text-xs {data.query.format?.toUpperCase() === fmt.format
								? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900'
								: 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'}"
						>
							{fmt.format} ({fmt.count})
						</a>
					{/each}
				</div>
			</div>
		</div>
	{/if}

	<!-- Results info -->
	<p class="text-sm text-neutral-500 dark:text-neutral-400">
		{bookCount(data.books.total)}
		{#if data.query.search}, {m.books_matching({ query: data.query.search })}{/if}
	</p>

	<!-- Book Grid -->
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
		{#each data.books.items as book}
			<BookCard {book} />
		{:else}
			<p class="col-span-full py-12 text-center text-neutral-500 dark:text-neutral-400">
				{m.books_no_results()}
			</p>
		{/each}
	</div>

	<!-- Pagination -->
	<Pagination page={data.books.page} totalPages={data.books.totalPages} baseUrl={page.url.pathname + page.url.search} />
</div>
