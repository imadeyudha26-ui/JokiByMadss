# JokiByMadss

JokiByMadss is a static HTML, CSS, and JavaScript website. The root `index.html` contains the landing page, login, order form, customer orders, and admin panel. Account routes use the `?page=` query parameter, for example `/index.html?page=login`.

## Project structure

- `index.html` — the single application entry point and all page markup.
- `joki-ml/css/` — landing-page and account-page styles.
- `joki-ml/js/` — landing-page interactions, calculator, hero slider, and WhatsApp integration.
- `joki-ml/assets/` — static images used by the site.

## Run locally

From the repository root, start a static web server:

```powershell
py -m http.server 4173
```

If the Python launcher is unavailable, use `python -m http.server 4173`. Open `http://localhost:4173/` in a browser. Account routes can be opened directly, for example `http://localhost:4173/index.html?page=login`.

The browser loads Supabase JS from its CDN. The project URL and publishable key are configured in the account script in `index.html`; the publishable key is not a service-role secret. Configure Supabase Row Level Security policies to protect customer orders and admin operations. Frontend email checks are not a security boundary.

Before enabling member profiles, QRIS payments, or order administration, inspect the deployed `public.orders` schema and policies. The first five migrations below document the historical rollout; do not replay them on production just because they are listed here. For an existing installation with the member/profile/admin foundation already present, apply migration 6 if it has not completed successfully, followed by migration 7. If that foundation is missing, inspect the live database first and apply only the missing prerequisite migrations in order.

1. `supabase/migrations/20261028000000_secure_member_orders.sql`
2. `supabase/migrations/20261028010000_order_payments_profiles.sql`
3. `supabase/migrations/20261028020000_ensure_order_payment_status.sql` (idempotent repair for deployments that applied the payment migration incompletely)
4. `supabase/migrations/20261028030000_align_order_insert_status.sql` (aligns the deployed insert trigger and RLS policies with the current `Menunggu` + `Belum Dibayar` order state)
5. `supabase/migrations/20261028040000_finalize_order_insert_status.sql` (final reinstall and assertion of the canonical order insert trigger, in case the initial migration was reapplied later)
6. `supabase/migrations/20261028050000_reconcile_orders_payment_schema.sql` (final reconciliation: adds missing payment fields before installing triggers, RPCs, final-price fields, and secure policies)
7. `supabase/migrations/20261028060000_rank_pricing.sql` (trusted rank-price catalogue, rank fields, and server-side order pricing)

Migration 6 reconciles payment columns, triggers, RPCs, Storage, and policies without replacing the orders table. Existing unrecognized `payment_status` values are preserved verbatim in `legacy_payment_status` before the current status is set to `Perlu Ditinjau` for manual review. Migration 7 adds the rank fields and trusted price catalogue without rewriting existing orders. Existing rankless orders and non-rank services keep the admin-priced workflow; new rank orders have their price computed and locked by the database trigger.

The rank catalogue is seeded from the existing `joki-ml/js/calculator.js` tariff. It sums `stars_to_next × price_per_star` for each step from the selected starting rank up to (but not including) the target. Rank order is validated on the server. `Mythical Immortal` is a target only; the calculator does not allow it as a starting rank. To update tariffs, update the catalogue through a reviewed database migration and update the seed values in migration 7; both frontend estimates and server-side order totals read the same catalogue.

Before applying the migration, use these queries in Supabase SQL Editor to capture the actual schema and constraints:

```sql
select
  column_name,
  data_type,
  udt_name,
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'public'
  and table_name = 'orders'
order by ordinal_position;

select
  constraint_row.conname,
  constraint_row.contype,
  pg_get_constraintdef(constraint_row.oid) as definition
from pg_constraint constraint_row
where constraint_row.conrelid = 'public.orders'::regclass
order by constraint_row.contype, constraint_row.conname;
```

To inspect all active triggers on the deployed orders table after applying migrations, run:

```sql
select
  trigger_row.tgname as trigger_name,
  pg_get_triggerdef(trigger_row.oid) as trigger_definition,
  function_row.oid::regprocedure as function_name,
  pg_get_functiondef(function_row.oid) as function_definition
from pg_trigger trigger_row
join pg_proc function_row on function_row.oid = trigger_row.tgfoid
where trigger_row.tgrelid = 'public.orders'::regclass
  and not trigger_row.tgisinternal
order by trigger_row.tgname;
```

Confirm `jbm_set_order_member_details` is a `BEFORE INSERT` trigger calling `public.jbm_set_order_member_details()` and its function validates `NEW.status` as `Menunggu` and `NEW.payment_status` as `Belum Dibayar`. Review any additional `BEFORE INSERT` triggers shown by the query; the application migrations do not remove unrelated triggers.

Inspect RLS and Storage configuration with:

```sql
select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where (schemaname = 'public' and tablename in ('orders', 'jbm_member_profiles', 'jbm_user_roles'))
   or (schemaname = 'storage' and tablename = 'objects')
order by schemaname, tablename, policyname;

select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets
where id = 'jbm-payment-proofs';
```

After applying migrations 6 and 7, rerun the column, trigger, constraint, policy, and bucket queries. Confirm the bucket is private, the payment path and rank columns exist, and `public.jbm_rank_price_steps` contains the catalogue before submitting a test order.

If migration 6 reports that `orders_payment_status_allowed` is violated, inspect the stored legacy values with:

```sql
select payment_status, count(*) as order_count
from public.orders
where payment_status is null
   or payment_status not in (
     'Belum Dibayar',
     'Menunggu Verifikasi',
     'Terverifikasi',
     'Ditolak',
     'Perlu Ditinjau'
   )
group by payment_status
order by order_count desc;
```

The final migration preserves each unsupported historical value in `legacy_payment_status`, moves that order to `Perlu Ditinjau` for manual review, and then creates the current-status constraint. Verify archived values with:

```sql
select id, legacy_payment_status, payment_status
from public.orders
where legacy_payment_status is not null
order by created_at desc;
```

Migration 7 makes `public.jbm_rank_price_steps` the trusted source for rank prices. The order form stores `rank_from`, `rank_to`, and the server-computed `rank_stars`; the database trigger ignores a browser-supplied amount and sets `price` and `final_price` from the catalogue. Rank and calculated price are immutable for new rank orders. The payment page displays the stored `final_price`, not a URL parameter or a browser-calculated estimate. Non-rank and historical orders remain rankless and keep the admin price workflow.

The first migration expects the existing `orders` table and fields used by the app (`user_id`, `email`, `status`, `created_at`, `item`, `price`, `nick`, `game_id`, `via`, `bayar`, and `note`). It creates the profile and role tables and assigns the existing `imadeyudha26@gmail.com` Auth user the admin role. Payment migrations keep payment state separate from work status; migration 6 safely fills missing payment fields and labels only rows whose payment status is null as `Perlu Ditinjau`. Admins must review historical payment records manually. If the admin account does not already exist, create/verify it through the normal Auth process before applying the first migration; the migration does not create an account or change its password.

The configured QRIS image is `assets/QRIS.jpeg` and is displayed from `/assets/QRIS.jpeg`; replace that file with the real QRIS image if the displayed code is not the payment destination you intend to use. The payment page links the image so it can be opened larger. The payment form accepts JPG/JPEG/PNG proofs up to 5 MB; Supabase Storage keeps them private, and only the owner or database-authorized admin may obtain access.

If login reports `Could not find the function public.jbm_is_admin without parameters in the schema cache`, the database migration has not been applied or PostgREST has not refreshed its schema cache. Review and run the migration above in Supabase **SQL Editor**. If the function is already present, refresh the cache with `NOTIFY pgrst, 'reload schema';`, then retry login. Do not work around this error by checking the admin email in frontend code; admin access must remain database-role based.

Login uses email and password and, on success, returns to the Beranda. Phone numbers are collected for member profiles and WhatsApp contact; they are not used as login credentials. Google OAuth is not currently configured in this project.

## Supabase email verification

In the Supabase Dashboard, open **Authentication → URL Configuration** and set:

- **Site URL** to the canonical production origin, for example `https://your-production-domain.com` (replace this example with the actual deployed domain). This is the fallback redirect and must not be `localhost`.
- **Redirect URLs** to include the production callback, for example `https://your-production-domain.com/**`. Add the production `www` or Vercel domain too if users can register from it. Add a localhost URL only if local callback testing is intentionally needed.

The signup flow sends an `emailRedirectTo` callback on the current non-localhost site origin: `/index.html?page=login&verified=1`. For localhost signups it omits that override so Supabase uses the configured Site URL instead. This prevents a local development URL from being embedded in signup emails. The app relies on Supabase JS URL-session detection to process the returned verification session; the login page displays the callback success or error.

In **Authentication → Email Templates → Confirm signup**, keep the confirmation link pointed at Supabase's verification endpoint using `{{ .ConfirmationURL }}`. Do not hardcode a localhost URL or replace it with `{{ .SiteURL }}`; Supabase uses the request's allowed redirect URL after confirmation. The dashboard settings and a fresh email confirmation must be checked against the deployed domain after changes.

## Deploy

Deploy the repository root as a static site on Vercel with no build command. `vercel.json` serves the root files and rewrites the former `/joki-ml/*.html` URLs to the corresponding view in `index.html`.
