# Bun Monorepo : Next.js + RPC + @tanstack/react-query + prisma

## Features

- Typesafe from the database to the frontend

  - Using Zod for validation
  - Using Prisma for the database
  - Using TypeScript for the frontend
  - Hono client for the api calls in combination with @tanstack/react-query

- Authentification template

  - Using Credentials for the authentification
  - Using JWT for the authentification
  - Cookie to store the JWT token
  - Blacklisting the JWT token on logout

- Monorepo setup

  - Using bun workspace for the monorepo setup

- Fast
  - Bun run for hono is super duper fast
  - Monorepo commands are fast thanks to bun workspace

## Getting started

1. Clone the repository
2. Run `bun install`
3. Run `bun dev`
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
