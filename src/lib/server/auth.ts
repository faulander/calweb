import { Database } from 'bun:sqlite';
import { config } from './config';
import { randomBytes, createHmac, timingSafeEqual } from 'crypto';
import { mkdirSync } from 'fs';

let _db: Database | null = null;

function getDb(): Database {
	if (!_db) {
		mkdirSync(config.dataPath, { recursive: true });
		_db = new Database(config.calwebDbPath);
		_db.exec(`
			CREATE TABLE IF NOT EXISTS users (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				username TEXT UNIQUE NOT NULL,
				password_hash TEXT NOT NULL,
				created_at TEXT DEFAULT (datetime('now'))
			);
			CREATE TABLE IF NOT EXISTS sessions (
				id TEXT PRIMARY KEY,
				user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
				expires_at TEXT NOT NULL,
				created_at TEXT DEFAULT (datetime('now'))
			);
			CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
		`);
	}
	return _db;
}

// Password hashing using HMAC-SHA256 with salt (no external deps)
function hashPassword(password: string): string {
	const salt = randomBytes(32).toString('hex');
	const hash = createHmac('sha256', salt).update(password).digest('hex');
	return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
	const [salt, expectedHash] = stored.split(':');
	const hash = createHmac('sha256', salt).update(password).digest('hex');
	const a = Buffer.from(hash, 'hex');
	const b = Buffer.from(expectedHash, 'hex');
	return a.length === b.length && timingSafeEqual(a, b);
}

export function hasUsers(): boolean {
	const db = getDb();
	const row = db.query<{ count: number }, []>('SELECT COUNT(*) as count FROM users').get();
	return (row?.count || 0) > 0;
}

export function createUser(username: string, password: string): { id: number; username: string } {
	const db = getDb();
	const hash = hashPassword(password);
	const result = db
		.query<{ id: number; username: string }, { $username: string; $hash: string }>(
			'INSERT INTO users (username, password_hash) VALUES ($username, $hash) RETURNING id, username'
		)
		.get({ $username: username, $hash: hash });
	if (!result) throw new Error('Failed to create user');
	return result;
}

export function authenticateUser(
	username: string,
	password: string
): { id: number; username: string } | null {
	const db = getDb();
	const user = db
		.query<{ id: number; username: string; password_hash: string }, { $username: string }>(
			'SELECT id, username, password_hash FROM users WHERE username = $username'
		)
		.get({ $username: username });

	if (!user || !verifyPassword(password, user.password_hash)) return null;

	return { id: user.id, username: user.username };
}

const SESSION_DURATION_DAYS = 30;

export function createSession(userId: number): string {
	const db = getDb();
	const id = randomBytes(32).toString('hex');
	const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString();

	db.query('INSERT INTO sessions (id, user_id, expires_at) VALUES ($id, $userId, $expiresAt)').run({
		$id: id,
		$userId: userId,
		$expiresAt: expiresAt
	});

	// Clean up expired sessions opportunistically
	db.query("DELETE FROM sessions WHERE expires_at < datetime('now')").run();

	return id;
}

export function validateSession(
	sessionId: string
): { userId: number; username: string } | null {
	const db = getDb();
	const row = db
		.query<
			{ user_id: number; username: string; expires_at: string },
			{ $id: string }
		>(
			`SELECT s.user_id, u.username, s.expires_at
			FROM sessions s JOIN users u ON s.user_id = u.id
			WHERE s.id = $id AND s.expires_at > datetime('now')`
		)
		.get({ $id: sessionId });

	if (!row) return null;

	return { userId: row.user_id, username: row.username };
}

export function deleteSession(sessionId: string): void {
	const db = getDb();
	db.query('DELETE FROM sessions WHERE id = $id').run({ $id: sessionId });
}

export function validateBasicAuth(
	authHeader: string
): { userId: number; username: string } | null {
	if (!authHeader.startsWith('Basic ')) return null;

	const decoded = Buffer.from(authHeader.slice(6), 'base64').toString('utf-8');
	const colonIndex = decoded.indexOf(':');
	if (colonIndex === -1) return null;

	const username = decoded.slice(0, colonIndex);
	const password = decoded.slice(colonIndex + 1);

	return authenticateUser(username, password);
}
