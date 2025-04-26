# Vibe Coding Boilerplage

A boilerplate to quickly start vibe coding.

## Local development

```bash
# install dependencies
npm install

# create .env file
cp apps/web/.env.example apps/web/.env
cp apps/my-app/.env.example apps/my-app/.env
cp packages/db-drizzle/.env.example packages/db-drizzle/.env

# start all services
turbo dev

# copy the SUPABASE_ANON_KEY from the console into apps/web/.env and apps/my-app/.env
```

### Start single Services

```bash
# run local supabase server
npm run dev:db

# copy the SUPABASE_ANON_KEY from the console into apps/web/.env and apps/my-app/.env

# open supabase dashboard at http://127.0.0.1:54323/project/default
```

```bash
# run app
npm run dev:my-app
```

```bash
# run local web app
npm run dev:web

# open web app at http://127.0.0.1:3000
```

## Generate types

```bash
cd packages/db-drizzle
npx drizzle-kit generate
```

## Prep for first time setup

```bash
# install turbo cli
npm install turbo --global
```

## Packages

- [tanstack/start](https://tanstack.com/start/latest)
- [shadcn/ui](https://ui.shadcn.com/docs/components)
- [lucide icons](https://lucide.dev)
- [sonner](https://sonner.emilkowal.ski/)
- [supabase](https://supabase.com)
