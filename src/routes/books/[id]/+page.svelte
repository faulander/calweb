<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	let { data } = $props();
	let book = $derived(data.book);

	function formatSize(bytes: number): string {
		if (bytes < 1024) return bytes + ' B';
		if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
		return (bytes / 1048576).toFixed(1) + ' MB';
	}

	function identifierUrl(type: string, val: string): string | null {
		switch (type) {
			case 'isbn':
				return `https://openlibrary.org/isbn/${val}`;
			case 'amazon':
			case 'amazon_de':
				return `https://amazon.de/dp/${val}`;
			case 'goodreads':
				return `https://www.goodreads.com/book/show/${val}`;
			case 'google':
				return `https://books.google.com/books?id=${val}`;
			default:
				return null;
		}
	}
</script>

<svelte:head>
	<title>{book.title} — {m.app_name()}</title>
</svelte:head>

<div class="space-y-6">
	<!-- Back link -->
	<a href={localizeHref('/books')} class="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200">
		<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M15 19l-7-7 7-7" /></svg>
		{m.book_back()}
	</a>

	<div class="flex flex-col gap-6 sm:flex-row">
		<!-- Cover -->
		<div class="w-full flex-shrink-0 sm:w-48 md:w-56">
			{#if book.has_cover}
				<img
					src="/api/covers/{book.id}"
					alt={book.title}
					class="w-full rounded-lg shadow-md"
				/>
			{:else}
				<div class="flex aspect-[2/3] w-full items-center justify-center rounded-lg bg-neutral-200 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400">
					{m.book_no_cover()}
				</div>
			{/if}
		</div>

		<!-- Metadata -->
		<div class="flex-1 space-y-4">
			<div>
				<h1 class="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{book.title}</h1>
				<p class="mt-1 text-lg text-neutral-600 dark:text-neutral-400">
					{#each book.authors as author, i}
						<a href={localizeHref(`/authors/${author.id}`)} class="hover:underline">{author.name}</a>{#if i < book.authors.length - 1}, {/if}
					{/each}
				</p>
			</div>

			{#if book.series}
				<p class="text-sm text-neutral-500 dark:text-neutral-400">
					<a href={localizeHref(`/series/${book.series.id}`)} class="hover:underline">{book.series.name}</a> #{book.series.index}
				</p>
			{/if}

			<!-- Details -->
			<dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
				{#if book.publisher}
					<dt class="text-neutral-500 dark:text-neutral-400">{m.book_publisher()}</dt>
					<dd class="text-neutral-900 dark:text-neutral-100">{book.publisher.name}</dd>
				{/if}
				{#if book.pubdate && !book.pubdate.startsWith('0101')}
					<dt class="text-neutral-500 dark:text-neutral-400">{m.book_published()}</dt>
					<dd class="text-neutral-900 dark:text-neutral-100">{new Date(book.pubdate).getFullYear()}</dd>
				{/if}
				{#if book.languages.length}
					<dt class="text-neutral-500 dark:text-neutral-400">{m.book_language()}</dt>
					<dd class="text-neutral-900 dark:text-neutral-100">{book.languages.join(', ')}</dd>
				{/if}
			</dl>

			<!-- Tags -->
			{#if book.tags.length}
				<div class="flex flex-wrap gap-1">
					{#each book.tags as tag}
						<a
							href={localizeHref(`/tags/${tag.id}`)}
							class="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
						>
							{tag.name}
						</a>
					{/each}
				</div>
			{/if}

			<!-- Download -->
			<div>
				<h2 class="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">{m.book_download()}</h2>
				<div class="flex flex-wrap gap-2">
					{#each book.formats as fmt}
						<a
							href="/api/download/{book.id}/{fmt.format}"
							class="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
						>
							<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
							{fmt.format}
							<span class="text-xs text-neutral-400">({formatSize(fmt.size)})</span>
						</a>
					{/each}
				</div>
			</div>

			<!-- External links -->
			{#if book.identifiers.length}
				<div>
					<h2 class="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">{m.book_links()}</h2>
					<div class="flex flex-wrap gap-2">
						{#each book.identifiers as ident}
							{@const url = identifierUrl(ident.type, ident.val)}
							{#if url}
								<a
									href={url}
									target="_blank"
									rel="noopener noreferrer"
									class="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
								>
									{ident.type}: {ident.val}
								</a>
							{/if}
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Description -->
	{#if book.comment}
		<div class="prose prose-neutral dark:prose-invert max-w-none">
			{@html book.comment}
		</div>
	{/if}
</div>
