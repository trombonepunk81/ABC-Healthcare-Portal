/**
 * Twin Module – Tandem Facility Viewer (iframe embed)
 *
 * Embeds the Autodesk Tandem web viewer in an iframe.
 * This avoids the complexity of the Model Derivative viewer SDK
 * (which can't render Tandem facilities anyway) and gives us
 * the full 3D experience with zero SDK dependencies.
 *
 * Auth: the user authenticates through Tandem's own login flow
 * inside the iframe — no 2-legged token needed for viewing.
 *
 * Deep-link: if ?asset=...&tandem=... params are present (from a
 * QR scan), we can append them to the Tandem URL to jump to a
 * specific element. This is wired for future integration.
 */

const TANDEM_BASE = 'https://tandem.autodesk.com/pages/facilities';

export async function render(root, cfg) {
  // Load the HTML template
  root.innerHTML = await (await fetch('./modules/twin/twin.html', { cache: 'no-store' })).text();

  const status    = root.querySelector('#status');
  const viewerDiv = root.querySelector('#tandem-viewer');
  const loadBtn   = root.querySelector('#load-default');

  // Only show button if a facility URN is configured
  loadBtn.style.display = cfg.defaultFacilityUrn ? 'inline-block' : 'none';

  loadBtn.onclick = () => loadFacility(cfg.defaultFacilityUrn);

  // Auto-load if configured
  if (cfg.defaultFacilityUrn) loadBtn.click();

  /**
   * Extract the facility ID from a Tandem URN
   * Format: urn:adsk.dtt:<facilityId>
   */
  function parseFacilityId(urn) {
    if (!urn) return null;
    const parts = urn.split(':');
    return parts[parts.length - 1] || null;
  }

  /**
   * Build the Tandem embed URL, optionally with deep-link params
   */
  function buildTandemUrl(facilityId) {
    let url = `${TANDEM_BASE}/${facilityId}`;

    // Check for QR deep-link params
    const params = new URLSearchParams(window.location.search);
    const assetId   = params.get('asset');
    const tandemLink = params.get('tandem');

    // If we have a direct Tandem link from a QR scan, prefer that
    if (tandemLink) return tandemLink;

    // Future: append element selection params for deep-link zoom
    // e.g. url += `?elementId=${assetId}` when Tandem supports it

    return url;
  }

  /**
   * Load the Tandem facility into an iframe
   */
  function loadFacility(urn) {
    const facilityId = parseFacilityId(urn);
    if (!facilityId) {
      status.textContent = '⚠ No facility URN configured';
      return;
    }

    status.textContent = 'Loading Tandem viewer…';
    viewerDiv.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.src             = buildTandemUrl(facilityId);
    iframe.style.width     = '100%';
    iframe.style.height    = '100%';
    iframe.style.border    = 'none';
    iframe.style.borderRadius = '0 0 16px 16px';
    iframe.allow           = 'fullscreen';
    iframe.title           = 'Autodesk Tandem – Facility Viewer';

    iframe.onload = () => {
      status.textContent = '';
      loadBtn.textContent = '↻ Reload Facility';
    };

    iframe.onerror = () => {
      status.textContent = '⚠ Could not load Tandem viewer';
      showFallback(facilityId);
    };

    viewerDiv.appendChild(iframe);

    // Fallback timeout — if Tandem blocks the iframe (X-Frame-Options),
    // the onerror won't always fire, so we check after a delay
    setTimeout(() => {
      try {
        // Cross-origin access will throw — that's expected and fine.
        // If the iframe has NO content at all, offer the fallback.
        const doc = iframe.contentDocument;
        if (doc && doc.body && doc.body.innerHTML === '') {
          showFallback(facilityId);
        }
      } catch (e) {
        // Cross-origin block = iframe loaded Tandem successfully
        status.textContent = '';
      }
    }, 5000);
  }

  /**
   * If iframe embedding is blocked, offer a direct link
   */
  function showFallback(facilityId) {
    const url = `${TANDEM_BASE}/${facilityId}`;
    viewerDiv.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
                  height:100%;gap:1rem;color:#64748b;text-align:center;padding:2rem">
        <p style="font-size:1.1rem">
          Tandem's viewer couldn't be embedded directly.<br/>
          This can happen due to browser security policies.
        </p>
        <a href="${url}" target="_blank" rel="noopener"
           style="padding:.75rem 1.5rem;background:linear-gradient(135deg,#0f172a,#334155);
                  color:#2dd4bf;border-radius:10px;text-decoration:none;font-weight:600">
          Open Tandem in New Tab ↗
        </a>
        <p style="font-size:.85rem;max-width:400px">
          Tip: You can keep this platform open alongside the Tandem tab
          for a side-by-side workflow.
        </p>
      </div>`;
    status.textContent = '';
  }
}
