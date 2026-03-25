<script lang="ts">
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale, locales, localizeHref } from '$lib/paraglide/runtime';
	import ThemeToggle from './ThemeToggle.svelte';

	let { user }: { user: { username: string } | null } = $props();

	let menuOpen = $state(false);

	const links = [
		{ href: '/', label: () => m.nav_home() },
		{ href: '/books', label: () => m.nav_books() },
		{ href: '/authors', label: () => m.nav_authors() },
		{ href: '/series', label: () => m.nav_series() },
		{ href: '/tags', label: () => m.nav_tags() }
	];

	function isActive(href: string): boolean {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname.startsWith(href);
	}
</script>

<nav class="border-b border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
	<div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
		<div class="flex items-center gap-6">
			<a href={localizeHref('/')} class="text-lg font-bold text-neutral-900 dark:text-neutral-100">{m.app_name()}</a>

			<div class="hidden items-center gap-1 md:flex">
				{#each links as link}
					<a
						href={localizeHref(link.href)}
						class="rounded px-3 py-1.5 text-sm font-medium transition-colors {isActive(link.href)
							? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
							: 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'}"
					>
						{link.label()}
					</a>
				{/each}
			</div>
		</div>

		<div class="flex items-center gap-2">
			<!-- Language switcher -->
			<div class="flex items-center gap-0.5">
				{#each locales as loc}
					<a
						href={localizeHref(page.url.pathname, { locale: loc })}
						rel="external"
						class="rounded px-1.5 py-1 text-xs font-medium uppercase {getLocale() === loc
							? 'bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100'
							: 'text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300'}"
					>
						{loc}
					</a>
				{/each}
			</div>

			<ThemeToggle />

			{#if user}
				<span class="hidden text-sm text-neutral-500 dark:text-neutral-400 md:inline">
					{user.username}
				</span>
				<form method="POST" action="/logout">
					<button
						type="submit"
						class="rounded px-3 py-1.5 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
					>
						{m.nav_logout()}
					</button>
				</form>
			{/if}

			<!-- Mobile menu button -->
			<button
				class="rounded p-2 text-neutral-500 hover:bg-neutral-100 md:hidden dark:hover:bg-neutral-800"
				onclick={() => (menuOpen = !menuOpen)}
				aria-label={m.nav_toggle_menu()}
			>
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					{#if menuOpen}
						<path d="M6 18L18 6M6 6l12 12" />
					{:else}
						<path d="M4 6h16M4 12h16M4 18h16" />
					{/if}
				</svg>
			</button>
		</div>
	</div>

	<!-- Mobile menu -->
	{#if menuOpen}
		<div class="border-t border-neutral-200 px-4 py-2 md:hidden dark:border-neutral-700">
			{#each links as link}
				<a
					href={localizeHref(link.href)}
					onclick={() => (menuOpen = false)}
					class="block rounded px-3 py-2.5 text-sm font-medium {isActive(link.href)
						? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
						: 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'}"
				>
					{link.label()}
				</a>
			{/each}
		</div>
	{/if}
</nav>
