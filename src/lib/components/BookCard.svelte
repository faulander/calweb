<script lang="ts">
	import type { BookListItem } from '$lib/server/db';

	let { book }: { book: BookListItem } = $props();
</script>

<a
	href="/books/{book.id}"
	class="group block overflow-hidden rounded-lg border border-neutral-200 bg-white transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800"
>
	<div class="aspect-[2/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-700">
		{#if book.has_cover}
			<img
				src="/api/covers/{book.id}"
				alt={book.title}
				loading="lazy"
				class="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
			/>
		{:else}
			<div class="flex h-full items-center justify-center p-4 text-center text-sm text-neutral-400 dark:text-neutral-500">
				{book.title}
			</div>
		{/if}
	</div>

	<div class="p-3">
		<h3 class="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
			{book.title}
		</h3>
		<p class="mt-0.5 truncate text-xs text-neutral-500 dark:text-neutral-400">
			{book.authors}
		</p>
		{#if book.series_name}
			<p class="mt-0.5 truncate text-xs text-neutral-400 dark:text-neutral-500">
				{book.series_name} #{book.series_index}
			</p>
		{/if}
		{#if book.formats}
			<div class="mt-2 flex flex-wrap gap-1">
				{#each book.formats.split(',') as fmt}
					<span class="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
						{fmt}
					</span>
				{/each}
			</div>
		{/if}
	</div>
</a>
