// tv.stratchai.com → the dashboard TV kiosk.
//
// A living-room shortcut. Opening https://tv.stratchai.com 302-redirects to the
// dashboard's READ-ONLY kiosk entry on the Tailscale Funnel, so a Fire Stick / TV
// browser reaches the full-screen 3D portfolio scene from ONE short HTTPS URL.
// (Vercel gives tv.stratchai.com a real cert; Namecheap's URL-forward was
// HTTP-only, which HTTPS-first TV browsers refuse.)
//
// The kiosk token is a SECRET — anyone who has it gets read access to the live
// book — so it is read from the Vercel env var KIOSK_TOKEN and NEVER committed.
// The funnel base URL is overridable via KIOSK_FUNNEL_URL (defaults below), so a
// machine/hostname change is an env edit, not a code change.
export default function handler(req, res) {
  const token = process.env.KIOSK_TOKEN;
  const base =
    process.env.KIOSK_FUNNEL_URL ||
    "https://bradys-mac-mini.tail3bccb5.ts.net/api/kiosk";
  if (!token) {
    res.status(501).send("kiosk not configured — set KIOSK_TOKEN in the Vercel env");
    return;
  }
  res.writeHead(302, { Location: `${base}?k=${encodeURIComponent(token)}` });
  res.end();
}
