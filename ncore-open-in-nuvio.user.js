// ==UserScript==
// @name         nCore – Open in Nuvio
// @namespace    https://github.com/emgeje/ncore-open-in-nuvio
// @version      1.0.1
// @description  Nuvio (IMDb) és StremHU (torrent) gombok az nCore-on a filmekhez és sorozatokhoz
// @author       emgeje
// @license      MIT
// @homepageURL  https://github.com/emgeje/ncore-open-in-nuvio
// @supportURL   https://github.com/emgeje/ncore-open-in-nuvio/issues
// @updateURL    https://raw.githubusercontent.com/emgeje/ncore-open-in-nuvio/main/ncore-open-in-nuvio.user.js
// @downloadURL  https://raw.githubusercontent.com/emgeje/ncore-open-in-nuvio/main/ncore-open-in-nuvio.user.js
// @match        https://ncore.pro/*
// @resource     nuvioLogo https://raw.githubusercontent.com/NuvioMedia/NuvioTV/dev/assets/brand/app_logo_wordmark.png
// @resource     stremhuLogo https://raw.githubusercontent.com/s4pp1/stremhu-source/main/docs/assets/logo.png
// @grant        GM_getResourceURL
// ==/UserScript==
(function () {
  const RES = (name, url) => (typeof GM_getResourceURL === 'function' && GM_getResourceURL(name)) || url;
  const NUVIO_LOGO = RES('nuvioLogo', 'https://raw.githubusercontent.com/NuvioMedia/NuvioTV/dev/assets/brand/app_logo_wordmark.png');
  const STREMHU_LOGO = RES('stremhuLogo', 'https://raw.githubusercontent.com/s4pp1/stremhu-source/main/docs/assets/logo.png');
  const BTN = 'display:inline-flex;align-items:center;margin-left:6px;padding:3px 8px;background:#111;border-radius:10px;vertical-align:middle;text-decoration:none;color:#fff;font:bold 12px sans-serif';
  const isDetails = /action=details/.test(location.search);

  // nCore kategória → 'movie' | 'series' | null (nem kell gomb) | undefined (ismeretlen)
  function typeFromCategory(tipus) {
    if (!tipus) return undefined;
    if (/^(xvidser|hdser)(_hun)?$/.test(tipus)) return 'series';
    if (/^(xvid|hd)(_hun)?$/.test(tipus) || /^xxx_(xvid|hd)$/.test(tipus)) return 'movie';
    return null; // DVD, XXX DVD/képek, program, zene, könyv, játék stb.
  }
  const isSeriesName = t => /(^|[.\s_-])S\d{1,2}(E\d{1,3})?([.\s_-]|$)|évad|season/i.test(t);
  const tipusOf = el => el && new URL(el.href, location.href).searchParams.get('tipus');

  function logoButton(href, title, src, imgCss, fallbackText, extraCss = '') {
    const a = document.createElement('a');
    a.href = href;
    a.title = title;
    a.style.cssText = BTN + extraCss;
    const img = document.createElement('img');
    img.src = src;
    img.alt = fallbackText;
    img.style.cssText = imgCss;
    img.onerror = () => { img.remove(); a.textContent = fallbackText; };
    a.appendChild(img);
    return a;
  }

  function addTo(container, torrentId, tipus, nameText) {
    let type = typeFromCategory(tipus);
    const imdbLink = container.querySelector('a[href*="imdb.com/title/tt"]');
    if (type === null) return;
    if (type === undefined) {
      if (!imdbLink) return;
      type = isSeriesName(nameText) ? 'series' : 'movie';
    }

    const anchor = imdbLink
      || container.querySelector('a[href*="action=details"]')
      || container.querySelector('.torrent_reszletek_cim');
    if (!anchor) return;

    const btns = [];
    const imdbId = imdbLink?.href.match(/tt\d+/)?.[0];
    if (imdbId) {
      btns.push(logoButton(`nuvio://meta?type=${type}&id=${imdbId}`,
        'Megnyitás Nuvióban (IMDb)', NUVIO_LOGO, 'height:14px;width:auto;display:block', '▶ Nuvio'));
    }
    if (torrentId) {
      btns.push(logoButton(`nuvio://meta?type=movie&id=stremhu-source:ncore:${torrentId}`,
        'Ez a torrent Nuvióban (StremHU)', STREMHU_LOGO, 'height:16px;width:16px;display:block', 'StremHU', ';padding:2px 6px'));
    }
    if (btns.length) anchor.after(...btns);
  }

  if (isDetails) {
    const torrentId = new URLSearchParams(location.search).get('id');
    const label = [...document.querySelectorAll('.dt, td, div')]
      .find(e => e.children.length === 0 && /^\s*Típus:?\s*$/.test(e.textContent));
    const catLink = label?.nextElementSibling?.querySelector('a[href*="tipus="]');
    const name = document.querySelector('.torrent_reszletek_cim')?.textContent || document.title;
    addTo(document, torrentId, tipusOf(catLink), name);
  } else {
    document.querySelectorAll('.box_torrent').forEach(row => {
      const link = row.querySelector('a[href*="action=details"][href*="id="]');
      const torrentId = link && new URL(link.href, location.href).searchParams.get('id');
      addTo(row, torrentId, tipusOf(row.querySelector('a[href*="tipus="]')), row.textContent);
    });
  }
})();
