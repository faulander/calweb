<script lang="ts">
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import Nav from '$lib/components/Nav.svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children, data } = $props();

	const authPages = ['/login', '/setup'];
	let isAuthPage = $derived(authPages.some((p) => page.url.pathname === p));
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if isAuthPage}
	{@render children()}
{:else}
	<div class="min-h-screen bg-neutral-50 dark:bg-neutral-900">
		<Nav user={data.user} />
		<main class="mx-auto max-w-6xl px-4 py-6">
			{@render children()}
		</main>
	</div>
{/if}

<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>
