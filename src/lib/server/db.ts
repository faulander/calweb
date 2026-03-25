import { Database } from 'bun:sqlite';
import { config } from './config';
import { join } from 'path';

let _db: Database | null = null;

function getDb(): Database {
	if (!_db) {
		_db = new Database(config.metadataDbPath, { readonly: true });
		_db.exec('PRAGMA cache_size = -64000');
	}
	return _db;
}

// Types

export interface Book {
	id: number;
	title: string;
	sort: string;
	timestamp: string;
	pubdate: string;
	series_index: number;
	author_sort: string;
	path: string;
	uuid: string;
	has_cover: boolean;
	last_modified: string;
}

export interface BookDetail extends Book {
	authors: { id: number; name: string }[];
	tags: { id: number; name: string }[];
	series: { id: number; name: string; index: number } | null;
	publisher: { id: number; name: string } | null;
	formats: { format: string; size: number; name: string }[];
	comment: string | null;
	identifiers: { type: string; val: string }[];
	languages: string[];
}

export interface BookListItem extends Book {
	authors: string;
	series_name: string | null;
	formats: string;
}

export interface Author {
	id: number;
	name: string;
	sort: string;
	book_count: number;
}

export interface Series {
	id: number;
	name: string;
	sort: string;
	book_count: number;
}

export interface Tag {
	id: number;
	name: string;
	book_count: number;
}

export interface Language {
	lang_code: string;
	book_count: number;
}

export interface LibraryStats {
	books: number;
	authors: number;
	series: number;
	tags: number;
}

export interface BooksQuery {
	page?: number;
	limit?: number;
	search?: string;
	tag?: number;
	series?: number;
	author?: number;
	language?: string;
	format?: string;
	sort?: 'title' | 'added' | 'published' | 'author' | 'series_index';
	order?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
	items: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

// Query functions

export function getBooks(opts: BooksQuery = {}): PaginatedResult<BookListItem> {
	const db = getDb();
	const page = opts.page || 1;
	const limit = Math.min(opts.limit || 24, 100);
	const offset = (page - 1) * limit;

	const conditions: string[] = [];
	const params: Record<string, string | number> = {};

	if (opts.search) {
		conditions.push('(b.title LIKE $search OR b.author_sort LIKE $search)');
		params.$search = `%${opts.search}%`;
	}

	if (opts.tag) {
		conditions.push('b.id IN (SELECT book FROM books_tags_link WHERE tag = $tag)');
		params.$tag = opts.tag;
	}

	if (opts.series) {
		conditions.push('b.id IN (SELECT book FROM books_series_link WHERE series = $series)');
		params.$series = opts.series;
	}

	if (opts.author) {
		conditions.push('b.id IN (SELECT book FROM books_authors_link WHERE author = $author)');
		params.$author = opts.author;
	}

	if (opts.language) {
		conditions.push(
			'b.id IN (SELECT blk.book FROM books_languages_link blk JOIN languages l ON blk.lang_code = l.id WHERE l.lang_code = $language)'
		);
		params.$language = opts.language;
	}

	if (opts.format) {
		conditions.push(
			'b.id IN (SELECT book FROM data WHERE format = $format)'
		);
		params.$format = opts.format.toUpperCase();
	}

	const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

	let orderBy: string;
	const dir = opts.order === 'desc' ? 'DESC' : 'ASC';
	switch (opts.sort) {
		case 'added':
			orderBy = `b.timestamp ${dir}`;
			break;
		case 'published':
			orderBy = `b.pubdate ${dir}`;
			break;
		case 'author':
			orderBy = `b.author_sort ${dir}`;
			break;
		case 'series_index':
			orderBy = `b.series_index ${dir}`;
			break;
		case 'title':
		default:
			orderBy = `b.sort ${dir}`;
			break;
	}

	const countRow = db
		.query<{ count: number }, Record<string, string | number>>(
			`SELECT COUNT(DISTINCT b.id) as count FROM books b ${where}`
		)
		.get(params);
	const total = countRow?.count || 0;

	const rows = db
		.query<
			{
				id: number;
				title: string;
				sort: string;
				timestamp: string;
				pubdate: string;
				series_index: number;
				author_sort: string;
				path: string;
				uuid: string;
				has_cover: number;
				last_modified: string;
				authors: string | null;
				series_name: string | null;
				formats: string | null;
			},
			Record<string, string | number>
		>(
			`SELECT b.*,
				GROUP_CONCAT(DISTINCT a.name) as authors,
				s.name as series_name,
				GROUP_CONCAT(DISTINCT d.format) as formats
			FROM books b
			LEFT JOIN books_authors_link bal ON b.id = bal.book
			LEFT JOIN authors a ON bal.author = a.id
			LEFT JOIN books_series_link bsl ON b.id = bsl.book
			LEFT JOIN series s ON bsl.series = s.id
			LEFT JOIN data d ON b.id = d.book
			${where}
			GROUP BY b.id
			ORDER BY ${orderBy}
			LIMIT $limit OFFSET $offset`
		)
		.all({ ...params, $limit: limit, $offset: offset });

	return {
		items: rows.map((r) => ({
			...r,
			has_cover: Boolean(r.has_cover),
			authors: r.authors || 'Unknown',
			series_name: r.series_name,
			formats: r.formats || ''
		})),
		total,
		page,
		limit,
		totalPages: Math.ceil(total / limit)
	};
}

export function getBook(id: number): BookDetail | null {
	const db = getDb();

	const book = db
		.query<
			{
				id: number;
				title: string;
				sort: string;
				timestamp: string;
				pubdate: string;
				series_index: number;
				author_sort: string;
				path: string;
				uuid: string;
				has_cover: number;
				last_modified: string;
			},
			{ $id: number }
		>('SELECT * FROM books WHERE id = $id')
		.get({ $id: id });

	if (!book) return null;

	const authors = db
		.query<{ id: number; name: string }, { $id: number }>(
			'SELECT a.id, a.name FROM authors a JOIN books_authors_link bal ON a.id = bal.author WHERE bal.book = $id'
		)
		.all({ $id: id });

	const tags = db
		.query<{ id: number; name: string }, { $id: number }>(
			'SELECT t.id, t.name FROM tags t JOIN books_tags_link btl ON t.id = btl.tag WHERE btl.book = $id'
		)
		.all({ $id: id });

	const seriesRow = db
		.query<{ id: number; name: string }, { $id: number }>(
			'SELECT s.id, s.name FROM series s JOIN books_series_link bsl ON s.id = bsl.series WHERE bsl.book = $id'
		)
		.get({ $id: id });

	const publisherRow = db
		.query<{ id: number; name: string }, { $id: number }>(
			'SELECT p.id, p.name FROM publishers p JOIN books_publishers_link bpl ON p.id = bpl.publisher WHERE bpl.book = $id'
		)
		.get({ $id: id });

	const formats = db
		.query<{ format: string; uncompressed_size: number; name: string }, { $id: number }>(
			'SELECT format, uncompressed_size, name FROM data WHERE book = $id'
		)
		.all({ $id: id });

	const commentRow = db
		.query<{ text: string }, { $id: number }>('SELECT text FROM comments WHERE book = $id')
		.get({ $id: id });

	const identifiers = db
		.query<{ type: string; val: string }, { $id: number }>(
			'SELECT type, val FROM identifiers WHERE book = $id'
		)
		.all({ $id: id });

	const languages = db
		.query<{ lang_code: string }, { $id: number }>(
			'SELECT l.lang_code FROM languages l JOIN books_languages_link bll ON l.id = bll.lang_code WHERE bll.book = $id'
		)
		.all({ $id: id });

	return {
		...book,
		has_cover: Boolean(book.has_cover),
		authors,
		tags,
		series: seriesRow ? { ...seriesRow, index: book.series_index } : null,
		publisher: publisherRow,
		formats: formats.map((f) => ({ format: f.format, size: f.uncompressed_size, name: f.name })),
		comment: commentRow?.text || null,
		identifiers,
		languages: languages.map((l) => l.lang_code)
	};
}

export function getRecentBooks(limit = 20): BookListItem[] {
	return getBooks({ limit, sort: 'added', order: 'desc' }).items;
}

export function getAuthors(
	page = 1,
	limit = 50,
	search?: string
): PaginatedResult<Author> {
	const db = getDb();
	const offset = (page - 1) * limit;

	let where = '';
	const params: Record<string, string | number> = {};
	if (search) {
		where = 'WHERE a.name LIKE $search';
		params.$search = `%${search}%`;
	}

	const countRow = db
		.query<{ count: number }, Record<string, string | number>>(
			`SELECT COUNT(*) as count FROM authors a ${where}`
		)
		.get(params);
	const total = countRow?.count || 0;

	const rows = db
		.query<Author, Record<string, string | number>>(
			`SELECT a.id, a.name, a.sort, COUNT(bal.book) as book_count
			FROM authors a
			LEFT JOIN books_authors_link bal ON a.id = bal.author
			${where}
			GROUP BY a.id
			ORDER BY a.sort ASC
			LIMIT $limit OFFSET $offset`
		)
		.all({ ...params, $limit: limit, $offset: offset });

	return { items: rows, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export function getAuthor(id: number): (Author & { books: BookListItem[] }) | null {
	const db = getDb();

	const author = db
		.query<{ id: number; name: string; sort: string }, { $id: number }>(
			'SELECT id, name, sort FROM authors WHERE id = $id'
		)
		.get({ $id: id });

	if (!author) return null;

	const books = getBooks({ author: id, limit: 100, sort: 'title' });

	return { ...author, book_count: books.total, books: books.items };
}

export function getTags(): Tag[] {
	const db = getDb();
	return db
		.query<Tag, []>(
			`SELECT t.id, t.name, COUNT(btl.book) as book_count
			FROM tags t
			LEFT JOIN books_tags_link btl ON t.id = btl.tag
			GROUP BY t.id
			ORDER BY t.name ASC`
		)
		.all();
}

export function getSeries(
	page = 1,
	limit = 50,
	search?: string
): PaginatedResult<Series> {
	const db = getDb();
	const offset = (page - 1) * limit;

	let where = '';
	const params: Record<string, string | number> = {};
	if (search) {
		where = 'WHERE s.name LIKE $search';
		params.$search = `%${search}%`;
	}

	const countRow = db
		.query<{ count: number }, Record<string, string | number>>(
			`SELECT COUNT(*) as count FROM series s ${where}`
		)
		.get(params);
	const total = countRow?.count || 0;

	const rows = db
		.query<Series, Record<string, string | number>>(
			`SELECT s.id, s.name, s.sort, COUNT(bsl.book) as book_count
			FROM series s
			LEFT JOIN books_series_link bsl ON s.id = bsl.series
			${where}
			GROUP BY s.id
			ORDER BY s.sort ASC
			LIMIT $limit OFFSET $offset`
		)
		.all({ ...params, $limit: limit, $offset: offset });

	return { items: rows, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export function getSeriesDetail(id: number): (Series & { books: BookListItem[] }) | null {
	const db = getDb();

	const series = db
		.query<{ id: number; name: string; sort: string }, { $id: number }>(
			'SELECT id, name, sort FROM series WHERE id = $id'
		)
		.get({ $id: id });

	if (!series) return null;

	const books = getBooks({ series: id, limit: 100, sort: 'series_index' });

	return { ...series, book_count: books.total, books: books.items };
}

export function getLanguages(): Language[] {
	const db = getDb();
	return db
		.query<Language, []>(
			`SELECT l.lang_code, COUNT(bll.book) as book_count
			FROM languages l
			LEFT JOIN books_languages_link bll ON l.id = bll.lang_code
			GROUP BY l.id
			ORDER BY book_count DESC`
		)
		.all();
}

export function getFormats(): { format: string; count: number }[] {
	const db = getDb();
	return db
		.query<{ format: string; count: number }, []>(
			`SELECT format, COUNT(*) as count FROM data GROUP BY format ORDER BY count DESC`
		)
		.all();
}

export function getStats(): LibraryStats {
	const db = getDb();
	const row = db
		.query<LibraryStats, []>(
			`SELECT
				(SELECT COUNT(*) FROM books) as books,
				(SELECT COUNT(*) FROM authors) as authors,
				(SELECT COUNT(*) FROM series) as series,
				(SELECT COUNT(*) FROM tags) as tags`
		)
		.get();
	return row || { books: 0, authors: 0, series: 0, tags: 0 };
}

export function getBookFilePath(bookId: number, format: string): string | null {
	const db = getDb();

	const book = db
		.query<{ path: string }, { $id: number }>('SELECT path FROM books WHERE id = $id')
		.get({ $id: bookId });

	const data = db
		.query<{ name: string; format: string }, { $id: number; $format: string }>(
			'SELECT name, format FROM data WHERE book = $id AND format = $format'
		)
		.get({ $id: bookId, $format: format.toUpperCase() });

	if (!book || !data) return null;

	return join(config.libraryPath, book.path, `${data.name}.${data.format.toLowerCase()}`);
}

export function getCoverPath(bookId: number): string | null {
	const db = getDb();

	const book = db
		.query<{ path: string; has_cover: number }, { $id: number }>(
			'SELECT path, has_cover FROM books WHERE id = $id'
		)
		.get({ $id: bookId });

	if (!book || !book.has_cover) return null;

	return join(config.libraryPath, book.path, 'cover.jpg');
}
