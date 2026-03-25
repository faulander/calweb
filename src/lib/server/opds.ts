import type { BookListItem, BookDetail } from './db';

const OPDS_NS = 'http://www.w3.org/2005/Atom';
const OPDS_CATALOG_NS = 'http://opds-spec.org/2010/catalog';

function escapeXml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function formatDate(d?: string): string {
	if (!d) return new Date().toISOString();
	try {
		return new Date(d).toISOString();
	} catch {
		return new Date().toISOString();
	}
}

const MIME_TYPES: Record<string, string> = {
	EPUB: 'application/epub+zip',
	KEPUB: 'application/epub+zip',
	MOBI: 'application/x-mobipocket-ebook',
	PDF: 'application/pdf',
	AZW3: 'application/vnd.amazon.ebook'
};

export interface FeedOptions {
	id: string;
	title: string;
	baseUrl: string;
	selfHref: string;
	entries?: string;
	links?: string;
}

export function wrapFeed(opts: FeedOptions): string {
	return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="${OPDS_NS}" xmlns:opds="${OPDS_CATALOG_NS}">
  <id>${escapeXml(opts.id)}</id>
  <title>${escapeXml(opts.title)}</title>
  <updated>${new Date().toISOString()}</updated>
  <author><name>calweb</name></author>
  <link rel="self" href="${escapeXml(opts.selfHref)}" type="application/atom+xml;profile=opds-catalog;kind=navigation"/>
  <link rel="start" href="${escapeXml(opts.baseUrl)}/opds" type="application/atom+xml;profile=opds-catalog;kind=navigation"/>
  <link rel="search" href="${escapeXml(opts.baseUrl)}/opds/search?q={searchTerms}" type="application/atom+xml;profile=opds-catalog;kind=acquisition"/>
  ${opts.links || ''}
  ${opts.entries || ''}
</feed>`;
}

export function navigationEntry(id: string, title: string, href: string, content?: string): string {
	return `<entry>
    <id>${escapeXml(id)}</id>
    <title>${escapeXml(title)}</title>
    <updated>${new Date().toISOString()}</updated>
    <link rel="subsection" href="${escapeXml(href)}" type="application/atom+xml;profile=opds-catalog;kind=acquisition"/>
    ${content ? `<content type="text">${escapeXml(content)}</content>` : ''}
  </entry>`;
}

export function bookToEntry(book: BookListItem | BookDetail, baseUrl: string): string {
	const authors =
		'authors' in book && typeof book.authors === 'string'
			? book.authors
			: 'authors' in book && Array.isArray(book.authors)
				? book.authors.map((a: { name: string }) => a.name).join(', ')
				: 'Unknown';

	const authorEntries = authors
		.split(',')
		.map((a: string) => `<author><name>${escapeXml(a.trim())}</name></author>`)
		.join('\n    ');

	const formats =
		'formats' in book && typeof book.formats === 'string'
			? book.formats.split(',').filter(Boolean)
			: 'formats' in book && Array.isArray(book.formats)
				? book.formats.map((f: { format: string }) => f.format)
				: [];

	const acquisitionLinks = formats
		.map(
			(fmt: string) =>
				`<link rel="http://opds-spec.org/acquisition" href="${escapeXml(baseUrl)}/api/download/${book.id}/${escapeXml(fmt)}" type="${escapeXml(MIME_TYPES[fmt] || 'application/octet-stream')}"/>`
		)
		.join('\n    ');

	const coverLink = book.has_cover
		? `<link rel="http://opds-spec.org/image" href="${escapeXml(baseUrl)}/api/covers/${book.id}" type="image/jpeg"/>
    <link rel="http://opds-spec.org/image/thumbnail" href="${escapeXml(baseUrl)}/api/covers/${book.id}" type="image/jpeg"/>`
		: '';

	return `<entry>
    <id>urn:uuid:${escapeXml(book.uuid)}</id>
    <title>${escapeXml(book.title)}</title>
    <updated>${formatDate(book.last_modified)}</updated>
    ${authorEntries}
    ${coverLink}
    ${acquisitionLinks}
  </entry>`;
}

export function opdsResponse(xml: string): Response {
	return new Response(xml, {
		headers: {
			'Content-Type': 'application/atom+xml;charset=utf-8'
		}
	});
}
