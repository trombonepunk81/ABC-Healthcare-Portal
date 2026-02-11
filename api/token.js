// Vercel Serverless Function: /api/token
export default async function handler(req, res) {
  // Allow only GET and set CORS for your GitHub Pages domain
  const ALLOW_ORIGIN = 'https://trombonepunk81.github.io';
  res.setHeader('Access-Control-Allow-Origin', ALLOW_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const clientId = process.env.APS_CLIENT_ID;
  const clientSecret = process.env.APS_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Missing APS env vars' });
  }

  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    // Minimal read scope for viewing Tandem; expand only if needed
    params.append('scope', 'data:read');

    const r = await fetch('https://developer.api.autodesk.com/authentication/v2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // OAuth v2: Basic base64(client_id:client_secret)
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
      },
      body: params.toString()
    });

    const text = await r.text();
    if (!r.ok) return res.status(r.status).send(text);

    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(text);
  } catch (err) {
    return res.status(500).json({ error: 'Token function failed', details: String(err) });
  }
}
