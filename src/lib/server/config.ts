import { env } from '$env/dynamic/private';
import { building } from '$app/environment';
import { join } from 'path';

export const config = {
	get libraryPath(): string {
		return env.CALIBRE_LIBRARY_PATH || '/library';
	},
	get dataPath(): string {
		return env.CALWEB_DATA_PATH || './data';
	},
	get sessionSecret(): string {
		return env.SESSION_SECRET || 'insecure-default';
	},
	get metadataDbPath(): string {
		return join(this.libraryPath, 'metadata.db');
	},
	get calwebDbPath(): string {
		return join(this.dataPath, 'calweb.db');
	}
};
