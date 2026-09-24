(function(){
  const API_BASE = 'https://botkey.vshtechteam.workers.dev';
  const BRAND_TITLE = 'App Đã Được Crack';
  const TZ = 'Asia/Ho_Chi_Minh';
  let deviceId = localStorage.getItem('vsh_license_device');
  if(!deviceId){
    deviceId = (crypto.randomUUID?.() || (Date.now().toString(36)+Math.random().toString(36).slice(2,10))).toUpperCase();
    localStorage.setItem('vsh_license_device', deviceId);
  }

  const css = `
  #vgGate{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:16px;background:rgba(6, 2, 3,.78);backdrop-filter:blur(20px) saturate(125%);-webkit-backdrop-filter:blur(20px) saturate(125%);opacity:0;pointer-events:none;transition:opacity .24s ease}
  #vgGate.is-open{opacity:1;pointer-events:auto}
  #vgGate .vg-panel{position:relative;width:min(430px,calc(100vw - 24px));border-radius:22px;overflow:hidden;color:var(--text,#fff4f5);font-family:"Bahnschrift","Segoe UI",sans-serif;background:linear-gradient(145deg,rgba(28, 10, 13,.92),rgba(12, 5, 7,.97));border:1px solid rgba(255, 138, 151,.18);box-shadow:0 22px 56px rgba(0,0,0,.48),0 0 30px rgba(255, 59, 82,.12);transform:translateY(20px) scale(.98);transition:transform .24s ease}
  #vgGate.is-open .vg-panel{transform:translateY(0) scale(1)}
  #vgGate .vg-panel::before{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.08),transparent 28%),radial-gradient(circle at top right,rgba(255, 59, 82,.22),transparent 34%);pointer-events:none}
  #vgGate .vg-hd{position:relative;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:16px 18px;border-bottom:1px solid rgba(255, 138, 151,.12)}
  #vgGate .vg-brand{font-size:19px;font-weight:900;letter-spacing:.1em;text-transform:uppercase}
  #vgGate .vg-bd{position:relative;padding:18px}
  #vgGate .vg-label{margin:0 0 6px;color:#c4a8ad;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase}
  #vgGate .vg-field{display:grid;grid-template-columns:1fr auto auto;gap:8px;align-items:center}
  #vgGate .vg-input{width:100%;min-height:44px;padding:0 12px;border-radius:14px;border:1px solid rgba(255, 108, 124,.14);background:linear-gradient(145deg,rgba(255,255,255,.04),rgba(255,255,255,.015)),rgba(10, 4, 6,.88);color:#fff4f5;outline:none;transition:border-color .22s ease,box-shadow .22s ease}
  #vgGate .vg-input:focus{border-color:rgba(255, 138, 151,.34);box-shadow:0 0 0 4px rgba(255, 59, 82,.12)}
  #vgGate .vg-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}
  #vgGate .vg-btn,#vgGate .vg-icon{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:42px;padding:0 14px;border-radius:14px;border:1px solid rgba(255, 108, 124,.14);background:linear-gradient(145deg,rgba(255,255,255,.04),rgba(255,255,255,.015)),rgba(10, 4, 6,.88);color:#fff4f5;cursor:pointer;transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease}
  #vgGate .vg-btn:hover,#vgGate .vg-icon:hover{transform:translateY(-1px);border-color:rgba(255, 138, 151,.3);box-shadow:0 16px 30px rgba(0,0,0,.26),0 0 20px rgba(255, 59, 82,.12)}
  #vgGate .vg-btn--pri{border-color:rgba(255, 176, 185,.24);background:linear-gradient(145deg,rgba(255, 92, 110,.28),rgba(148, 12, 31,.88)),#3c0812;box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 16px 28px rgba(0,0,0,.3),0 0 24px rgba(255, 59, 82,.16)}
  #vgGate .vg-btn--ghost{background:linear-gradient(145deg,rgba(255,255,255,.04),rgba(255,255,255,.015)),rgba(10, 4, 6,.88)}
  #vgGate .vg-msg{margin-top:14px;padding:12px 14px;border-radius:16px;border:1px solid rgba(255, 108, 124,.14);background:rgba(10, 3, 5,.74);font-size:12px;line-height:1.55}
  #vgGate .vg-msg.ok{border-color:rgba(165,255,210,.28);background:rgba(11,26,18,.82);color:#c8ffe0}
  #vgGate .vg-msg.warn{border-color:rgba(255,214,136,.28);background:rgba(26,21,9,.82);color:#ffe7b8}
  #vgGate .vg-msg.err{border-color:rgba(255,168,194,.28);background:rgba(33,12,19,.84);color:#ffd3df}
  #vgGate details{margin-top:12px;border-radius:16px;border:1px solid rgba(255, 108, 124,.12);overflow:hidden;background:rgba(6, 2, 3,.52)}
  #vgGate summary{padding:12px 14px;cursor:pointer;list-style:none;color:#c4a8ad;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase}
  #vgGate summary::-webkit-details-marker{display:none}
  #vgGate .vg-pre{margin:0;padding:12px 14px 14px;max-height:220px;overflow:auto;background:rgba(7, 2, 4,.78);color:#ffc7cd;font:11px/1.5 Consolas,"Courier New",monospace}
  #vgGate .vg-icon svg{width:15px;height:15px;display:block}
  #vgGate .vg-foot{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:12px;color:#c4a8ad;font-size:11px}
  html.vg-lock,html.vg-lock body{overflow:hidden}
  @media (max-width:560px){
    #vgGate{padding:10px}
    #vgGate .vg-panel{width:min(100%,calc(100vw - 20px));border-radius:20px}
    #vgGate .vg-hd,#vgGate .vg-bd{padding:14px}
    #vgGate .vg-brand{font-size:17px}
    #vgGate .vg-field{grid-template-columns:1fr}
    #vgGate .vg-hd,#vgGate .vg-foot{flex-wrap:wrap}
    #vgGate .vg-actions{display:grid;grid-template-columns:1fr}
  }`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function $(sel, root=document){ return root.querySelector(sel); }
  function build(){
    let wrap = $('#vgGate');
    if(wrap) return wrap;
    wrap = document.createElement('div');
    wrap.id = 'vgGate';
    wrap.innerHTML = `
      <div class="vg-panel">
        <div class="vg-hd">
          <div class="vg-brand">${BRAND_TITLE}</div>
        </div>

        <div class="vg-bd">
          <div style="text-align:center; padding:20px 0;">
            <div class="vg-label" style="text-align:center; font-size:14px; margin-bottom:10px;">Bởi Minh Hoàng</div>
            <div style="color:#ff3c52; font-size:32px; margin-bottom:20px;">✓</div>
          </div>

          <div class="vg-actions">
            <button class="vg-btn vg-btn--pri" id="vgEnter" style="flex:1;">Vào App</button>
          </div>

          <div style="text-align:center; margin-top:14px; font-size:11px; color:#c4a8ad;">
            No Key Full Function
          </div>
        </div>
      </div>`;
    document.body.appendChild(wrap);

    $('#vgEnter').onclick = ()=> hide();

    return wrap;
  }

  function show(){
    const gate = build();
    gate.style.display = 'grid';
    document.documentElement.classList.add('vg-lock');
    requestAnimationFrame(()=> gate.classList.add('is-open'));
  }
  function hide(){
    const g = document.getElementById('vgGate');
    if(!g) return;
    g.classList.remove('is-open');
    document.documentElement.classList.remove('vg-lock');
    setTimeout(()=>{ g.style.display = 'none'; }, 240);
  }

  function guardOnLoad(){
    show();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', guardOnLoad);
  else guardOnLoad();

  window.VSHKeyGate = { show, hide, reset(){ show(); } };
})();
