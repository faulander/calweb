<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	let {
		value = '',
		action = localizeHref('/books'),
		placeholder = m.search_books()
	}: {
		value?: string;
		action?: string;
		placeholder?: string;
	} = $props();
</script>

<form method="GET" action={action} class="w-full">
	<div class="relative">
		<svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
		</svg>
		<input
			type="search"
			name="q"
			{value}
			{placeholder}
			class="w-full rounded-lg border border-neutral-300 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
		/>
	</div>
</form>
