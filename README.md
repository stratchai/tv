# stratchai-tv

A one-function Vercel app behind **`tv.stratchai.com`**. It 302-redirects to the
dashboard's **read-only TV kiosk** on the Tailscale Funnel, so a Fire Stick /
living-room browser reaches the full-screen 3D portfolio scene from one short
HTTPS URL.

## Why it exists

The kiosk itself lives in the [`dashboard`](https://github.com/stratchai/dashboard)
repo (`/api/kiosk?k=<token>` → `/?kiosk=1`, see `dashboard/docs/kiosk.md`). Its URL
is long and its host is a `*.ts.net` name that TV remotes are painful to type.
Namecheap's free URL-forward can't front it because it serves **HTTP only**, and
HTTPS-first TV browsers refuse that. Vercel gives `tv.stratchai.com` a real cert
and reads the secret token from an env var, so the public repo never holds it.

```
https://tv.stratchai.com
  → 302 → https://<funnel-host>/api/kiosk?k=<KIOSK_TOKEN>   (token from Vercel env)
  → 302 → /?kiosk=1                                          (funnel sets read cookie)
  → the full-screen scene
```

## Files

- `api/index.js` — the redirect. Reads `KIOSK_TOKEN` + optional `KIOSK_FUNNEL_URL`.
- `vercel.json` — routes every path to the function (`framework: null`, no build).

## Deploy (one-time)

1. **Import** this repo at [vercel.com/new](https://vercel.com/new) → deploy (no
   build step; it's just a serverless function).
2. **Env vars** (Project → Settings → Environment Variables), Production:
   - `KIOSK_TOKEN` = the dashboard's kiosk token (from `dashboard/.env.local`).
   - `KIOSK_FUNNEL_URL` = *(optional)* the funnel kiosk endpoint if the host ever
     changes. Default: `https://bradys-mac-mini.tail3bccb5.ts.net/api/kiosk`.
   - Redeploy so the vars take effect.
3. **Domain** (Project → Settings → Domains): add `tv.stratchai.com`. Vercel shows
   the DNS record to create.
4. **DNS at Namecheap** (Advanced DNS → Host Records): add a **CNAME**, Host `tv`,
   Value `cname.vercel-dns.com` (use whatever Vercel shows). **Delete the old
   `tv` URL-Redirect record first** — a host can't have both. Everything else on
   `stratchai.com` (apex, `www`, MX/email) stays untouched.
5. Vercel auto-issues the cert (~minutes). `https://tv.stratchai.com` is live.

## Rotating the token

Rotate `KIOSK_TOKEN` in `dashboard/.env.local` (rebuild + restart the funnel),
then update the `KIOSK_TOKEN` env var here and redeploy. No code change.
