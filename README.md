# JokiByMadss

Website JokiByMadss is a static HTML, CSS, and JavaScript site. The landing page and account/order pages are served by the root `index.html`.

## Project structure

- `index.html` — landing page, login, order form, order list, and admin panel. Account views use the `?page=` URL parameter.
- `joki-ml/css/` — landing-page and account-page styles.
- `joki-ml/js/` — landing-page interactions.
- `joki-ml/assets/` — static images.

## Local development

Run a local static web server from the repository root (using either Python launcher on Windows):

```powershell
py -m http.server 4173
```

If `py` is not available, use `python -m http.server 4173`. Then open `http://localhost:4173`. Supabase is loaded directly by the browser from its CDN; its URL and publishable key are configured in the account script in `index.html`. The publishable key is intended for browser use. Protect order data and admin actions with Supabase Row Level Security policies.

## Build and deployment

Deploy the repository root as a static site. `vercel.json` disables the build step and rewrites the former account-page URLs to the matching view in `index.html`.
