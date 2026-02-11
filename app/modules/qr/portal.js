export async function render(root, CONFIG){
  root.innerHTML = `<div id="qr-portal-root" style="padding:0"></div>`;
  const html = await (await fetch('./modules/qr/portal.html', {cache:'no-store'})).text();
  document.getElementById('qr-portal-root').innerHTML = html;
}
