# Conor's Astro v3 Template

## Getting Started

```bash
pnpm i
pnpm migrate
pnpm dev
```

## Features

- Routes under /app are part of a Tanstack router SPA with client-side rendering
- Lucia Auth (default with GitHub OAuth)
- TRPC + React Query
- Tinybird analytics (optional)
- TailwindCSS
- Shadcn UI

## Deployment

The recommended method is to deploy to Vercel. This application comes preconfigured with the Astro Vercel adapter.

## Commands

All commands are run from the root of the project, from a terminal:

| Command             | Action                                           |
| :------------------ | :----------------------------------------------- |
| `pnpm install`      | Installs dependencies                            |
| `pnpm generate`     | Generate migrations with Drizzle Kit             |
| `pnpm migrate`      | Apply migrations to your database                |
| `pnpm dev`          | Starts local dev server at `localhost:3000`      |
| `pnpm build`        | Build your production site to `./dist/`          |
| `pnpm preview`      | Preview your build locally, before deploying     |
| `pnpm astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro --help` | Get help using the Astro CLI                     |
