import type { RequestHandler } from './$types';
import { getBookFilePath, getBook } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { readFileSync, existsSync } from 'fs';

const MIME_TYPES: Record<string, string> = {
	EPUB: 'application/epub+zip',
	KEPUB: 'application/epub+zip',
	MOBI: 'application/x-mobipocket-ebook',
	PDF: 'application/pdf',
	RTF: 'application/rtf',
	AZW3: 'application/vnd.amazon.ebook',
	ZIP: 'application/zip'
};

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) throw error(401, 'Unauthorized');

	const format = params.format.toUpperCase();
	const filePath = getBookFilePath(Number(params.id), format);

	if (!filePath || !existsSync(filePath)) throw error(404, 'File not found');

	const book = getBook(Number(params.id));
	const filename = book
		? `${book.title} - ${book.authors.map((a) => a.name).join(', ')}.${format.toLowerCase()}`
		: `book.${format.toLowerCase()}`;

	const file = readFileSync(filePath);
	return new Response(file, {
		headers: {
			'Content-Type': MIME_TYPES[format] || 'application/octet-stream',
			'Content-Disposition': `attachment; filename="${filename.replace(/"/g, '\\"')}"`,
			'Content-Length': String(file.length)
		}
	});
};
