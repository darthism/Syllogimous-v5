# Syllogimous (Next.js + Supabase)

This repo has been migrated to **Next.js (TypeScript)** with **Supabase** used for cloud persistence (profiles/app state sync, progress history, and background images), while keeping the original game/generator logic behavior intact.

## Running locally

1. Install deps:
   - `npm install`
2. Configure Supabase (optional but recommended):
   - Copy `docs/supabase-env.example` to a new file named `.env.local` and fill in your values.
   - Apply the SQL in `supabase/schema.sql` in the Supabase SQL editor.
3. Start dev server:
   - `npm run dev`

If Supabase env vars are not set, the app falls back to **localStorage + IndexedDB** (original behavior).

### Dev bundler

`npm run dev` uses **Turbopack** (`next dev --turbo`). If you want to run the legacy webpack dev server instead, use:

- `npx next dev`

## Supabase data model

- **KV sync**: `public.user_kv` stores raw strings mirroring localStorage values for:
  - `sllgms-v3`
  - `sllgms-v3-profiles`
  - `sllgms-v3-selected-profile`
  - `sllgms-v3-app-state`
- **Progress history**: `public.rrt_history`
- **Images**: storage bucket `images` (per-user folder prefix)

# Syllogimous v3

Modified version of Syllogimous-v3, created to support new theories and experiments on relational reasoning training.

[Try it](https://soamsy.github.io/Syllogimous-v3/)

# Contribution

[4skinSkywalker](https://github.com/4skinSkywalker/)
[ikokusovereignty](https://github.com/ikokusovereignty/)
[soamsy](https://github.com/soamsy/)
[giladkingsley](https://github.com/giladkingsley/)


# Attribution-NonCommercial 3.0 Unported (CC BY-NC 3.0)

## You are free to:
### Share — copy and redistribute the material in any medium or format
### Adapt — remix, transform, and build upon the material

The licensor cannot revoke these freedoms as long as you follow the license terms.

## Under the following terms:
### Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
### NonCommercial — You may not use the material for commercial purposes.

No additional restrictions — You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.
