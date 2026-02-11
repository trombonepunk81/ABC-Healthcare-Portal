const VIEWER_JS = 'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js';
const VIEWER_CSS = 'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css';

let viewer = null;

export async function render(root, cfg){
  root.innerHTML = await (await fetch('./modules/twin/twin.html', {cache:'no-store'})).text();

  const status = root.querySelector('#status');
  const viewerDiv = root.querySelector('#tandem-viewer');
  const loadDefaultBtn = root.querySelector('#load-default');
  loadDefaultBtn.style.display = cfg.defaultFacilityUrn ? 'inline-block' : 'none';

  await loadCss(VIEWER_CSS); await loadScript(VIEWER_JS);

  loadDefaultBtn.onclick = async () => {
    status.textContent = 'Loading default facility...';
    await initViewer(viewerDiv, cfg.tokenUrl);
    await loadFacilityWithSdk(cfg.defaultFacilityUrn);  // (wired in follow-up)
    await tryDeepLinkSelect();                          // deep-link select from QR (follow-up)
    status.textContent = '';
  };

  if (cfg.defaultFacilityUrn) loadDefaultBtn.click();

  async function initViewer(container, tokenUrl){
    if (viewer) return;
    const opts = {
      env: 'AutodeskProduction',
      api: 'derivativeV2',
      // APS Viewer pattern: provide 2‑legged token via callback from your Vercel function
      getAccessToken: async (cb) => {
        const r = await fetch(tokenUrl, { cache: 'no-store' });
        const { access_token, expires_in } = await r.json();
        cb(access_token, expires_in);
      }
    };
    await Autodesk.Viewing.Initializer(opts, () => {
      viewer = new Autodesk.Viewing.GuiViewer3D(container);
      viewer.start();
    });
  }

  // TODO: Tandem SDK: resolve facility view & load into viewer (next commit)
  async function loadFacilityWithSdk(twinUrn){ /* implemented in follow-up */ }

  // TODO: Tandem SDK: select & zoom element from deep-link (next commit)
  async function tryDeepLinkSelect(){
    const u = new URL(location.href);
    const assetId = u.searchParams.get('asset');
    const link = u.searchParams.get('tandem');
    if (!assetId || !link) return;
  }

  function loadCss(href){ const l=document.createElement('link'); l.rel='stylesheet'; l.href=href; document.head.appendChild(l); }
  function loadScript(src){ return new Promise(r=>{ const s=document.createElement('script'); s.src=src; s.onload=r; document.head.appendChild(s); }); }
}
``
