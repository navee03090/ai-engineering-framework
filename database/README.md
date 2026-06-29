# Database

SQL migrations live in `supabase/migrations/`.

## Setup (new Supabase project)

1. Create a dedicated Supabase project for AEF.
2. Copy `.env.example` to `.env.local` and add project URL + keys.
3. Run `supabase/migrations/00001_init.sql` in the Supabase SQL Editor.
4. Optionally run `supabase/seed.sql` after creating test users.

## Type generation

When the schema changes, update `types/database.ts` or regenerate types with the Supabase CLI:

```bash
npx supabase gen types typescript --project-id <project-id> > types/database.ts
```
