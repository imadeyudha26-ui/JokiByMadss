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

## Supabase email verification

In the Supabase Dashboard, open **Authentication → URL Configuration** and set:

- **Site URL** to the canonical production origin, for example `https://your-production-domain.com` (replace this example with the actual deployed domain). This is the fallback redirect and must not be `localhost`.
- **Redirect URLs** to include the production callback, for example `https://your-production-domain.com/**`. Add the production `www` or Vercel domain too if users can register from it. Add a localhost URL only if local callback testing is intentionally needed.

The signup flow sends an `emailRedirectTo` callback on the current non-localhost site origin: `/index.html?page=login&verified=1`. For localhost signups it omits that override so Supabase uses the configured Site URL instead. This prevents a local development URL from being embedded in signup emails. The app relies on Supabase JS URL-session detection to process the returned verification session; the login page displays the callback success or error.

In **Authentication → Email Templates → Confirm signup**, keep the confirmation link pointed at Supabase's verification endpoint using `{{ .ConfirmationURL }}`. Do not hardcode a localhost URL or replace it with `{{ .SiteURL }}`; Supabase uses the request's allowed redirect URL after confirmation. The dashboard settings and a fresh email confirmation must be checked against the deployed domain after changes.

## Deploy

Deploy the repository root as a static site on Vercel with no build command. `vercel.json` serves the root files and rewrites the former `/joki-ml/*.html` URLs to the corresponding view in `index.html`.
