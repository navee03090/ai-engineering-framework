# Phase 10 — Authentication UI

**Status:** Complete  
**Version:** AEF v1.0

## Goal

Email/password authentication with Supabase — login/signup UI, protected routes, session-aware layout, and server actions.

## Delivered

| Area | Implementation |
|------|----------------|
| Login UI | `/login` + `LoginForm` |
| Signup UI | `/signup` + `SignupForm` |
| Protected area | `/dashboard` under `(protected)` layout |
| Server actions | `signInAction`, `signUpAction`, `signOutAction` |
| Session helpers | `getServerUser`, `requireUser` in `lib/auth/session.ts` |
| Middleware | Redirect unauthenticated users from `/dashboard` |
| Auth callback | `/auth/callback` for Supabase email confirmation |
| Header | `SiteHeader` with session-aware nav |

## Routes

| Path | Access |
|------|--------|
| `/login` | Public (redirects if signed in) |
| `/signup` | Public (redirects if signed in) |
| `/dashboard` | Authenticated only |
| `/auth/callback` | Supabase OAuth/email callback |

## Server action flow

```text
Form submit → signInAction / signUpAction
    → authService (Supabase)
    → redirect /dashboard
```

Sign out uses `signOutAction` → `authService.signOut()` → redirect `/login`.

## Protecting new pages

1. Place routes under `app/(protected)/`.
2. Layout calls `requireUser()` (already in `(protected)/layout.tsx`).
3. Middleware blocks `/dashboard/*` without session.

## Supabase setup

1. Enable **Email** provider in Supabase Auth settings.
2. Add site URL: `http://localhost:3000`
3. Redirect URL: `http://localhost:3000/auth/callback`
4. Run migrations `00001` and `00002`.

## Verification

```bash
npm run lint
npm run test
npm run build
npm run dev
```

Manual:

1. Visit `/signup` → create account
2. Land on `/dashboard`
3. Sign out → return to `/login`
4. Visit `/dashboard` while signed out → redirect to `/login`

## Next phase

**Phase 11 — File Upload & Storage:** upload UI, incident attachments, storage service wiring.
