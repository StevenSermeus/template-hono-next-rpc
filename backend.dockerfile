FROM oven/bun:1.1.25 AS install
WORKDIR /usr/src/app

COPY . .

RUN bun install --ignore-scripts

RUN bun db:generate

FROM oven/bun:1.1.25 AS run

WORKDIR /usr/src/app

COPY --from=install /usr/src/app .

CMD ["bun", "run", "backend"]