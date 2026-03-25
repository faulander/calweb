# calweb

A modern, fast, self-hosted web interface for your [Calibre](https://calibre-ebook.com/) library. Browse, search, and download your ebooks from any device — including e-readers.

## Features

- **Browse your library** — by title, author, series, or tag
- **Search & filter** — full-text search with filters for language, format, and tags
- **Download books** — directly in any format Calibre has (EPUB, MOBI, PDF, etc.)
- **Dark & light mode** — with system preference detection
- **E-reader friendly** — minimal JavaScript, large touch targets, fast on e-ink displays
- **OPDS catalog** — connect e-reader apps like KOReader, Moon+ Reader, or Librera
- **Multi-language UI** — English and German included
- **Read-only** — never modifies your Calibre library

## Quick Start with Docker

```yaml
# docker-compose.yml
services:
  calweb:
    image: ghcr.io/faulander/calweb:latest
    ports:
      - "3000:3000"
    volumes:
      - /path/to/your/calibre/library:/library:ro
      - calweb_data:/data
    environment:
      - SESSION_SECRET=change-me-to-a-random-string
    restart: unless-stopped

volumes:
  calweb_data:
```

```sh
docker compose up -d
```

Open `http://localhost:3000` — you'll be prompted to create an admin account on first launch.

## Configuration

| Environment Variable | Default | Description |
|---|---|---|
| `CALIBRE_LIBRARY_PATH` | `/library` | Path to your Calibre library (mount as read-only volume) |
| `CALWEB_DATA_PATH` | `/data` | Path for calweb's own database (user accounts, sessions) |
| `SESSION_SECRET` | — | Secret for signing session cookies (required in production) |

## OPDS

Point your e-reader app to:

```
http://your-server:3000/opds
```

OPDS supports HTTP Basic Auth using your calweb credentials. Feeds available:

- `/opds` — catalog root
- `/opds/recent` — recently added books
- `/opds/search?q=term` — search
- `/opds/authors` — browse by author
- `/opds/tags` — browse by tag

## Building from Source

Requires [Bun](https://bun.sh/) v1+.

```sh
git clone https://github.com/faulander/calweb.git
cd calweb
bun install
```

Create a `.env` file:

```sh
CALIBRE_LIBRARY_PATH=/path/to/your/Calibre Library
CALWEB_DATA_PATH=./data
SESSION_SECRET=dev-secret
```

Run the dev server:

```sh
bun run dev
```

Build for production:

```sh
bun run build
bun build/index.js
```

## Screenshots

*Coming soon*

## License

MIT
