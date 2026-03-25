FROM oven/bun:1 AS builder

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM oven/bun:1

WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production
ENV CALIBRE_LIBRARY_PATH=/library
ENV CALWEB_DATA_PATH=/data

EXPOSE 3000

CMD ["bun", "build/index.js"]
