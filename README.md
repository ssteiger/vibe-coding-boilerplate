# Vibe Coding Boilerplate

A boilerplate to quickly start vibe coding.

SQL data queries and the frontend component that consumes the data are located in the same file.
This together with end-to-end type safety makes this setup ideal for vibe coding.

## Local development

```bash
nvm use v20.18.0

# install dependencies
bun install

# create .env file
cp apps/web/.env.example apps/web/.env
cp apps/my-app/.env.example apps/my-app/.env
cp packages/db-drizzle/.env.example packages/db-drizzle/.env

# start all services
bun run dev

# copy the SUPABASE_ANON_KEY from the console into apps/web/.env and apps/my-app/.env
```

> The Supabase ports are defined in [apps/supabase/config.toml](apps/supabase/config.toml)
> (`54421` API, `54422` DB, `54423` Studio, `54424` Inbucket). If you have an older local
> `.env` referencing `543xx` ports, refresh it from the corresponding `.env.example`.

### Database

```bash
# prepare database
cd apps/supabase
supabase migration up
```

### Start single Services

```bash
# run local supabase server
bun run dev:db

# copy the SUPABASE_ANON_KEY from the console into apps/web/.env and apps/my-app/.env

# open supabase dashboard at http://127.0.0.1:54423/project/default
```

```bash
# run app
bun run dev:my-app
```

```bash
# run web app
bun run dev:web

# open web app at http://127.0.0.1:3000
```

## Update Drizzle schema

The Drizzle schema lives at [packages/db-drizzle/src/schema.ts](packages/db-drizzle/src/schema.ts) and is the
source of truth for typed DB access. Edit it directly when adding/changing tables, then keep the matching
SQL migration in `apps/supabase/migrations/` in sync.

To produce a fresh migration from the Drizzle schema:

```bash
cd packages/db-drizzle
npx drizzle-kit generate
```

## Prep for first time setup

```bash
# install turbo cli
bun install turbo --global
```

## Packages

- [tanstack/start](https://tanstack.com/start/latest)
- [shadcn/ui](https://ui.shadcn.com/docs/components)
- [lucide icons](https://lucide.dev)
- [sonner](https://sonner.emilkowal.ski/)
- [supabase](https://supabase.com)
