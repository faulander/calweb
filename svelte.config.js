import adapter from 'svelte-adapter-bun';
import { relative, sep } from 'node:path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// defaults to rune mode for the project, execept for `node_modules`. Can be removed in svelte 6.
		runes: ({ filename }) => {
			const relativePath = relative(import.meta.dirname, filename);
			const pathSegments = relativePath.toLowerCase().split(sep);
			const isExternalLibrary = pathSegments.includes('node_modules');

			return isExternalLibrary ? undefined : true;
		}
	},
	kit: {
		adapter: adapter(),
		// The origin header varies (LAN IP:3020 vs. the Netbird reverse-proxy
		// domain); the app's own session auth is the real security boundary,
		// so trust all origins for the built-in same-origin form check.
		csrf: { trustedOrigins: ['*'] }
	}
};

export default config;
