declare global {
	namespace App {
		interface Locals {
			user: { userId: number; username: string } | null;
		}
	}
}

export {};
