# Database Guidelines

## Supabase project

- Use a **dedicated** Supabase project per deployed application.
- For the template itself, create a separate Supabase project named for AEF development.

## Migrations

- All schema changes go in `supabase/migrations/` as numbered SQL files.
- Never edit production schema manually without a matching migration file.
- Apply via Supabase SQL Editor or Supabase CLI.

## Row Level Security

- **RLS enabled** on every application table.
- Policies must use `auth.uid()` for user-scoped data.
- Admin operations use service role only on the server.

## Profiles pattern

`00001_init.sql` creates:

- `public.profiles` linked to `auth.users`
- Trigger `on_auth_user_created` for automatic profile creation
- `uploads` storage bucket with user-scoped policies

## Types

- `types/database.ts` mirrors the schema.
- Regenerate after migration changes (see `database/README.md`).

## Seeds

- `supabase/seed.sql` is for local/dev data only.
- Never seed production with test credentials.

## Queries

- Prefer server-side queries via `lib/supabase/server.ts`.
- Complex queries can live in `database/queries/` (Phase 3+).

## Naming

- Tables: `snake_case`, plural (`incidents`, `profiles`)
- Columns: `snake_case`
- Enums: `snake_case` type names
