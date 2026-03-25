<script lang="ts">
	let theme = $state<'light' | 'dark' | 'system'>('system');

	function init() {
		if (typeof window === 'undefined') return;
		theme = (localStorage.getItem('theme') as typeof theme) || 'system';
	}

	function toggle() {
		const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
		theme = next;

		if (next === 'system') {
			localStorage.removeItem('theme');
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			document.documentElement.classList.toggle('dark', prefersDark);
		} else {
			localStorage.setItem('theme', next);
			document.documentElement.classList.toggle('dark', next === 'dark');
		}
	}

	init();
</script>

<button
	onclick={toggle}
	class="rounded p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
	title="Toggle theme ({theme})"
	aria-label="Toggle theme"
>
	{#if theme === 'light'}
		<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<circle cx="12" cy="12" r="5" /><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
		</svg>
	{:else if theme === 'dark'}
		<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
		</svg>
	{:else}
		<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8m-4-4v4" />
		</svg>
	{/if}
</button>
