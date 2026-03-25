<script lang="ts">
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Login — calweb</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-900">
	<div class="w-full max-w-sm">
		<h1 class="mb-8 text-center text-2xl font-bold text-neutral-900 dark:text-neutral-100">
			calweb
		</h1>

		{#if form?.error}
			<div class="mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-400">
				{form.error}
			</div>
		{/if}

		<form method="POST" class="space-y-4">
			<div>
				<label for="username" class="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
					Username
				</label>
				<input
					type="text"
					id="username"
					name="username"
					value={form?.username ?? ''}
					required
					autocomplete="username"
					class="w-full rounded border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
				/>
			</div>

			<div>
				<label for="password" class="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
					Password
				</label>
				<input
					type="password"
					id="password"
					name="password"
					required
					autocomplete="current-password"
					class="w-full rounded border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
				/>
			</div>

			<button
				type="submit"
				class="w-full rounded bg-neutral-800 px-4 py-2.5 font-medium text-white hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 dark:bg-neutral-200 dark:text-neutral-900 dark:hover:bg-neutral-300"
			>
				Sign in
			</button>
		</form>
	</div>
</div>
