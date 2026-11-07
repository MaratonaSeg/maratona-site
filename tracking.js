/* Medição de visitas e contatos — Google (GA4 / Google Ads) e Meta Pixel
 *
 * COMO ATIVAR: preencha os IDs abaixo e publique. Enquanto estiverem vazios,
 * nada é carregado (nem o aviso de cookies aparece).
 *   googleTagId: ID da tag do Google, ex. 'G-ABC123XYZ' (Google Analytics 4)
 *   googleAdsId: opcional, ex. 'AW-123456789' (quando houver conta no Google Ads)
 *   metaPixelId: ID do Pixel da Meta, ex. '123456789012345'
 *
 * LGPD: as tags só são carregadas depois que o visitante clica em "Aceitar"
 * no aviso de cookies. A escolha fica salva no navegador.
 *
 * Eventos registrados (sem dados pessoais):
 *   - clique em link do WhatsApp  -> GA4 'contato_whatsapp'  | Meta 'Contact'
 *   - clique em telefone (tel:)   -> GA4 'contato_telefone'  | Meta 'Contact'
 *   - clique em e-mail (mailto:)  -> GA4 'contato_email'     | Meta 'Contact'
 *   - formulário de orçamento     -> GA4 'generate_lead'     | Meta 'Lead'
 */
(function () {
  'use strict';

  var TRACKING = {
    googleTagId: 'G-X2GW89NW79',
    googleAdsId: '',
    metaPixelId: '992369863941711'
  };

  var hasGoogle = !!TRACKING.googleTagId || !!TRACKING.googleAdsId;
  var hasMeta = !!TRACKING.metaPixelId;
  if (!hasGoogle && !hasMeta) return;

  var KEY = 'maratona_cookies';
  var loaded = false;

  function getConsent() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function setConsent(v) {
    try { localStorage.setItem(KEY, v); } catch (e) { /* ignora */ }
  }

  function loadTags() {
    if (loaded) return;
    loaded = true;

    if (hasGoogle) {
      var first = TRACKING.googleTagId || TRACKING.googleAdsId;
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(first);
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      if (TRACKING.googleTagId) window.gtag('config', TRACKING.googleTagId);
      if (TRACKING.googleAdsId) window.gtag('config', TRACKING.googleAdsId);
    }

    if (hasMeta) {
      /* eslint-disable */
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
      document,'script','https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */
      window.fbq('init', TRACKING.metaPixelId);
      window.fbq('track', 'PageView');
    }
  }

  function track(gaEvent, metaEvent, params) {
    if (!loaded) return;
    params = params || {};
    params.pagina = location.pathname;
    if (window.gtag) window.gtag('event', gaEvent, params);
    if (window.fbq) window.fbq('track', metaEvent, { content_category: params.pagina });
  }

  // Cliques em WhatsApp, telefone e e-mail
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('wa.me/') !== -1 || href.indexOf('api.whatsapp.com') !== -1) {
      track('contato_whatsapp', 'Contact', { canal: 'whatsapp' });
    } else if (href.indexOf('tel:') === 0) {
      track('contato_telefone', 'Contact', { canal: 'telefone' });
    } else if (href.indexOf('mailto:') === 0) {
      track('contato_email', 'Contact', { canal: 'email' });
    }
  }, true);

  // Formulário de orçamento (evento disparado pelo script.js após validar)
  document.addEventListener('maratona:lead', function (e) {
    var d = (e && e.detail) || {};
    track('generate_lead', 'Lead', { servico: d.servico || '', perfil: d.perfil || '' });
  });

  // Aviso de cookies
  function showBanner() {
    var bar = document.createElement('div');
    bar.className = 'cookie-bar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Aviso de cookies');
    bar.innerHTML =
      '<p>Usamos cookies para medir as visitas e melhorar nossos anúncios. Você aceita?</p>' +
      '<div class="cookie-bar__btns">' +
      '<button type="button" class="cookie-bar__no">Recusar</button>' +
      '<button type="button" class="cookie-bar__ok">Aceitar</button>' +
      '</div>';
    var css = document.createElement('style');
    css.textContent =
      '.cookie-bar{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;' +
      'background:#2A1147;color:#fff;border-radius:14px;padding:16px 18px;box-shadow:0 8px 30px rgba(0,0,0,.25);' +
      'display:flex;gap:14px;align-items:center;flex-wrap:wrap;font-size:14px;line-height:1.4}' +
      '.cookie-bar p{margin:0;flex:1 1 240px}' +
      '.cookie-bar__btns{display:flex;gap:8px}' +
      '.cookie-bar button{border:0;border-radius:10px;padding:9px 16px;font:inherit;font-weight:600;cursor:pointer}' +
      '.cookie-bar__no{background:transparent;color:#E6DDF5;border:1px solid rgba(255,255,255,.35)!important}' +
      '.cookie-bar__ok{background:#C9A45C;color:#1A0A2E}';
    document.head.appendChild(css);
    document.body.appendChild(bar);
    bar.querySelector('.cookie-bar__ok').addEventListener('click', function () {
      setConsent('sim'); bar.remove(); loadTags();
    });
    bar.querySelector('.cookie-bar__no').addEventListener('click', function () {
      setConsent('nao'); bar.remove();
    });
  }

  var c = getConsent();
  if (c === 'sim') {
    loadTags();
  } else if (c !== 'nao') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showBanner);
    else showBanner();
  }
})();
