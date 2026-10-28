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

Before enabling member profiles, QRIS payments, or order administration, inspect the deployed `public.orders` schema and policies. The first five migrations below document the historical rollout; do not replay them on production just because they are listed here. For an existing installation with the member/profile/admin foundation already present, use the final reconciliation migration (6) by itself. If that foundation is missing, inspect the live database first and apply only the missing prerequisite migrations in order.

1. `supabase/migrations/20261028000000_secure_member_orders.sql`
2. `supabase/migrations/20261028010000_order_payments_profiles.sql`
3. `supabase/migrations/20261028020000_ensure_order_payment_status.sql` (idempotent repair for deployments that applied the payment migration incompletely)
4. `supabase/migrations/20261028030000_align_order_insert_status.sql` (aligns the deployed insert trigger and RLS policies with the current `Menunggu` + `Belum Dibayar` order state)
5. `supabase/migrations/20261028040000_finalize_order_insert_status.sql` (final reinstall and assertion of the canonical order insert trigger, in case the initial migration was reapplied later)
6. `supabase/migrations/20261028050000_reconcile_orders_payment_schema.sql` (final reconciliation: adds missing payment fields before installing triggers, RPCs, final-price fields, and secure policies)

For a deployment where the secure member/profile/admin foundation has already run, run migration 6 in SQL Editor instead of replaying older migrations. It adds missing payment columns without replacing the orders table or modifying existing order status, reinstalls the canonical trigger after adding those columns, and refreshes the PostgREST schema cache. It stops with a descriptive error if required base tables/functions are missing, payment column types differ, or an existing `status` check constraint does not permit `Menunggu`.

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

After applying migration 6, rerun the column, trigger, constraint, policy, and bucket queries. Confirm the bucket is private and the payment path columns exist before submitting a test order.

There is no canonical, trusted price catalogue: the homepage and JavaScript currently show different price lists, and the order page accepts `item` and an estimate from URL parameters. Migration 6 adds `final_price` separately; the database ignores any client-supplied final amount. An authenticated admin must set the positive final amount in the order detail panel before the member can upload payment proof. The database records the confirming admin/time and prevents changing that amount after payment proof has been submitted. The browser-provided estimate is informational only and must not be used as the QRIS amount.

The first migration expects the existing `orders` table and fields used by the app (`user_id`, `email`, `status`, `created_at`, `item`, `price`, `nick`, `game_id`, `via`, `bayar`, and `note`). It creates the profile and role tables and assigns the existing `imadeyudha26@gmail.com` Auth user the admin role. Payment migrations keep payment state separate from work status; migration 6 safely fills missing payment fields and labels only rows whose payment status is null as `Perlu Ditinjau`. Admins must review historical payment records manually. If the admin account does not already exist, create/verify it through the normal Auth process before applying the first migration; the migration does not create an account or change its password.

Add your real static QRIS image at `joki-ml/assets/qris.png` and set the single `QRIS_IMAGE_URL` constant near the top of the account module in `index.html` to `/joki-ml/assets/qris.png`; alternatively, set that constant to the real hosted image URL. No QRIS image is included by this project, and the payment upload stays disabled until a QRIS URL is configured. The payment form accepts JPG/JPEG/PNG proofs up to 5 MB; Supabase Storage keeps them private, and only the owner or database-authorized admin may obtain access.

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
