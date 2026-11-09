/* ============================================================
   SKETCHBOOK RENDERER — runs on /sketchbook/ only
   Pages are built from ../data/*.json: every printed thing is a
   positioned DOM element, so left and right pages stay
   independent. Desktop shows spreads; phones show single
   portrait pages. Dev layout check: any URL with ?layout.
   Sizes that must stay in sync live in css/sketchbook.css.
   ============================================================ */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;

  /* the book sits one level below the site root, so every asset
     comes from one folder up (works with the /redesign/ subpath) */
  var ROOT_PREFIX = '../';

  if (new URLSearchParams(location.search).has('layout')) {
    root.classList.add('layout-mode');
  }

  /* dev-only layout check: ?layout outlines every element, and
     ?layout=phone checks the single-page phone layout on a desktop */
  var layoutParam = new URLSearchParams(location.search).get('layout');
  var layoutPhone = layoutParam === 'phone';
  if (layoutPhone) root.classList.add('layout-phone');

  /* max leaf width must stay .book-stage max-width / 2 in css/sketchbook.css */
  var LEAF_MAX = 600;

  var FONT_WEIGHT = {
    display: 'var(--weight-display)',
    body: 'var(--weight-regular)',
    mono: 'var(--weight-regular)',
    hand: 'var(--weight-medium)'
  };

  var site = null;
  var spreads = [];          /* {left:[], right:[], artworkIds:[]} */
  var artIndex = {};         /* id -> { i, work } */
  var flip = null;
  var pageCount = 0;
  var book = null;
  var railButtons = [];      /* one per work, in artwork order */

  var phoneMq = window.matchMedia('(max-width: 900px)');

  function phoneAtInit() {
    return layoutPhone || phoneMq.matches;
  }

  function fetchJSON(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(r.status + ' ' + url);
      return r.json();
    });
  }

  function pad2(n) {
    return (n < 10 ? '0' : '') + n;
  }

  function artworkOf(id) {
    var entry = artIndex[id];
    if (!entry) throw new Error('unknown artwork id: ' + id);
    return entry;
  }

  /* ---- element text: literal strings win; textSource pulls from data ---- */
  function resolveText(el, spread) {
    if (typeof el.text === 'string') return el.text;
    var path = el.textSource || '';
    if (path.indexOf('site/') === 0) {
      var parts = path.split('/');
      var value = site[parts[1]];
      return value ? value[parts[2]] : '';
    }
    var target = el.artworkId || (spread && spread.artworkIds && spread.artworkIds[0]);
    var entry = target ? artworkOf(target) : null;
    if (!entry) return '';
    var work = entry.work;
    if (path === 'artwork/title') return work.title;
    if (path === 'artwork/note') return work.note;
    if (path === 'artwork/meta') return work.meta;
    if (path === 'artwork/index') return pad2(entry.i + 1);
    return '';
  }

  /* artwork image plus the biggest variant that is still not larger than
     the page needs; empty variants fall back to the original file */
  function imageOf(el) {
    var entry = artworkOf(el.artworkId);
    var img = entry.work.images.filter(function (i) { return i.id === el.imageId; })[0];
    if (!img) throw new Error('unknown image ' + el.artworkId + '/' + el.imageId);
    var best = img.src;
    var widest = img.width;
    (img.variants || []).forEach(function (v) {
      if (v.width >= widest) return;
      /* target: desktop leaf cap scaled by the box size */
      var need = LEAF_MAX * (el.width / 100) * 1.5;   /* 1.5 for retina */
      if (v.width >= need) { widest = v.width; best = v.src; }
    });
    /* asset paths in the data files are site-root relative */
    best = ROOT_PREFIX + best;
    /* full is the untouched original for the inspector */
    return { src: best, full: ROOT_PREFIX + img.src, width: img.width, height: img.height, alt: img.alt };
  }

  function elementNode(el, spread, flags) {
    var lazy = !!flags.lazy;
    var phone = !!flags.phone;
    var box = doc.createElement('div');
    box.className = 'pe';
    box.dataset.id = el.id;
    box.dataset.type = el.type;

    var st = box.style;
    st.left = el.x + '%';
    st.top = el.y + '%';
    st.width = el.width + '%';
    st.height = el.height + '%';
    st.zIndex = el.z;
    if (el.rotation) st.transform = 'rotate(' + el.rotation + 'deg)';
    if (el.opacity !== 1) st.opacity = el.opacity;
    if (el.visible === false) st.display = 'none';

    var fs = el.fontSize;
    if (phone && el.mobile && el.mobile.fontSize != null) fs = el.mobile.fontSize;
    if (fs != null) st.fontSize = fs + 'cqh';   /* 1cqh = 1% of page height */

    if (el.font) {
      st.fontFamily = 'var(--font-' + el.font + ')';
      st.fontWeight = FONT_WEIGHT[el.font] || 'normal';
    }
    if (el.align) st.textAlign = el.align;
    if (el.tone) {
      if (el.type === 'block' || el.type === 'stamp') st.background = 'var(--' + el.tone + ')';
      else st.color = 'var(--' + el.tone + ')';
    }

    if (el.type === 'image') {
      var img = imageOf(el);
      var node = doc.createElement('img');
      node.src = img.src;
      node.width = img.width;
      node.height = img.height;
      node.alt = img.alt;
      if (lazy) node.loading = 'lazy';
      node.decoding = 'async';
      node.style.objectFit = el.fit === 'cover' ? 'cover' : 'contain';
      /* every artwork is inspectable, mouse or keyboard */
      node.tabIndex = 0;
      node.setAttribute('role', 'button');
      node.className = 'pe-art';
      wireInspect(node, el);
      box.appendChild(node);
    } else if (el.type === 'block') {
      box.setAttribute('aria-hidden', 'true');
    } else if (el.type === 'spec-list') {
      /* rows: medium, size, year; a null row stays hidden */
      var entry = artworkOf(el.artworkId || resolveArtworkId(spread));
      var work = entry.work;
      var rows = [['Medium', work.medium], ['Size', work.size], ['Year', work.year]];
      var dl = doc.createElement('dl');
      rows.forEach(function (row) {
        if (row[1] == null) return;
        var dt = doc.createElement('dt');
        dt.textContent = row[0];
        var dd = doc.createElement('dd');
        dd.textContent = row[1];
        dl.appendChild(dt);
        dl.appendChild(dd);
      });
      box.appendChild(dl);
    } else {
      var p = doc.createElement('p');
      p.textContent = resolveText(el, spread);
      box.appendChild(p);
    }
    return box;
  }

  function resolveArtworkId(spread) {
    return spread.artworkIds ? spread.artworkIds[0] : spread.artworkId;
  }

  /* ------------------------------------------------------------
     Inspector: click or Enter on any artwork opens it large.
     Escape closes, focus returns to what was opened, and arrow
     keys do not turn pages while it is open.
     ------------------------------------------------------------ */
  var inspect = null, inspectImg = null, inspectCap = null, inspectClose = null;
  var inspectOpen = false;
  var inspectReturn = null;   /* element to hand focus back to */

  function buildInspect() {
    var wrap = doc.createElement('div');
    wrap.className = 'inspect';
    wrap.id = 'inspect';
    wrap.hidden = true;
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-labelledby', 'inspect-cap');

    var scrim = doc.createElement('div');
    scrim.className = 'inspect-scrim';
    scrim.addEventListener('click', function () { closeInspect(); });
    wrap.appendChild(scrim);

    var panel = doc.createElement('figure');
    panel.className = 'inspect-panel';

    inspectImg = doc.createElement('img');
    inspectImg.id = 'inspect-img';
    inspectImg.decoding = 'async';
    inspectImg.alt = '';
    panel.appendChild(inspectImg);

    inspectCap = doc.createElement('figcaption');
    inspectCap.className = 'inspect-cap';
    inspectCap.id = 'inspect-cap';
    panel.appendChild(inspectCap);

    inspectClose = doc.createElement('button');
    inspectClose.type = 'button';
    inspectClose.className = 'btn inspect-close';
    inspectClose.textContent = 'Close';
    inspectClose.setAttribute('aria-label', 'Close artwork inspection');
    inspectClose.addEventListener('click', function () { closeInspect(); });
    panel.appendChild(inspectClose);

    panel.addEventListener('keydown', function (e) {
      /* the dialog has one focusable control, so Tab stays on it */
      if (e.key === 'Tab') e.preventDefault();
    });

    wrap.appendChild(panel);
    doc.body.appendChild(wrap);
    inspect = wrap;
  }

  function openInspect(el, opener) {
    if (!inspect) buildInspect();
    var entry = artworkOf(el.artworkId);
    var img = imageOf(el);
    inspectImg.src = img.full;
    inspectImg.alt = img.alt;
    var cap = entry.work.title;
    if (entry.work.meta) cap += ' · ' + entry.work.meta;
    inspectCap.textContent = cap;

    inspect.hidden = false;
    root.classList.add('inspect-open');
    inspectOpen = true;
    inspectReturn = opener;
    inspectClose.focus();
  }

  function closeInspect() {
    if (!inspectOpen) return;
    inspect.hidden = true;
    root.classList.remove('inspect-open');
    inspectOpen = false;
    if (inspectReturn && doc.contains(inspectReturn)) inspectReturn.focus();
    inspectReturn = null;
  }

  /* Escape closes from anywhere; Tab is trapped by the dialog itself */
  function onInspectGlobalKey(e) {
    if (!inspectOpen) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      closeInspect();
    }
  }

  /* Clicking artwork must never also turn a page. The flip library
     listens for mousedown/touchstart on its own block and decides
     flips at release, so the gesture start is swallowed on artwork:
     taps open the inspector, drags starting on artwork simply do
     nothing (page areas, buttons, rail and arrow keys still turn). */
  function wireInspect(node, el) {
    node.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      openInspect(el, node);
    });
    node.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        openInspect(el, node);
      }
    });
    ['mousedown', 'touchstart'].forEach(function (ev) {
      node.addEventListener(ev, function (e) { e.stopPropagation(); });
    });
  }


  function pageNode(side, elements, spread, flags) {
    flags = flags || {};
    var page = doc.createElement('div');
    page.className = 'page';
    page.dataset.side = side;
    var inner = doc.createElement('div');
    inner.className = 'page-inner';
    elements.forEach(function (el) {
      if (el.visible !== false) inner.appendChild(elementNode(el, spread, flags));
    });
    page.appendChild(inner);
    return page;
  }

  /* front cover, then left/right leaf per spread, then back cover.
     Page count is even, so a spread never sits half-open. */
  function buildBookDOM(phone) {
    var pages = [];
    pages.push(pageNode('solo', site.coversFront, null, { lazy: false, phone: phone }));
    spreads.forEach(function (spread, i) {
      pages.push(pageNode('left', spread.left, spread, { lazy: i > 0, phone: phone }));
      pages.push(pageNode('right', spread.right, spread, { lazy: i > 0, phone: phone }));
    });
    pages.push(pageNode('solo', site.coversBack, null, { lazy: true, phone: phone }));
    pages.forEach(function (p) { book.appendChild(p); });
    return pages;
  }

  /* ---- contents rail: one button per work, in artwork order ---- */
  function buildRail() {
    var list = doc.getElementById('contents');
    var works = Object.keys(artIndex).map(function (id) { return artIndex[id]; });
    works.sort(function (a, b) { return a.i - b.i; });
    works.forEach(function (entry) {
      var btn = doc.createElement('button');
      btn.type = 'button';
      var num = doc.createElement('span');
      num.className = 'rail-num';
      num.textContent = pad2(entry.i + 1);
      var title = doc.createElement('span');
      title.textContent = entry.work.title;
      btn.appendChild(num);
      btn.appendChild(title);
      btn.addEventListener('click', function () { turnToArtwork(entry.i); });
      var li = doc.createElement('li');
      li.appendChild(btn);
      list.appendChild(li);
      railButtons.push(btn);
    });
  }

  /* leaf index of a work: cover first, two leaves per spread */
  function leafIndex(spreadIndex) {
    return 1 + spreadIndex * 2;
  }

  function spreadIndexOfArtwork(workIndex) {
    for (var s = 0; s < spreads.length; s++) {
      if (spreads[s].artworkIdList.indexOf(workIndex) >= 0) return s;
    }
    return -1;
  }

  function turnToArtwork(workIndex) {
    if (!flip) return;
    var s = spreadIndexOfArtwork(workIndex);
    if (s < 0) return;
    var target = leafIndex(s);
    if (flip.getCurrentPageIndex() !== target) flip.turnToPage(target);
  }

  /* ---- controls, counter, rail state ---- */
  function sync() {
    if (!flip) return;
    var p = flip.getCurrentPageIndex();
    var btnPrev = doc.getElementById('btn-prev');
    var btnNext = doc.getElementById('btn-next');
    btnPrev.disabled = p <= 0;
    btnNext.disabled = p >= pageCount - 1;

    var counter = doc.getElementById('counter-page');
    var workLabel = doc.getElementById('counter-works');
    var activeWorks = [];
    if (p <= 0) {
      counter.textContent = 'Cover';
      workLabel.textContent = '';
    } else if (p >= pageCount - 1) {
      counter.textContent = 'Back cover';
      workLabel.textContent = '';
    } else {
      var s = Math.floor((p - 1) / 2);
      counter.textContent = 'Page ' + (s + 1) + ' / ' + spreads.length;
      activeWorks = spreads[s].artworkIdList;
      workLabel.textContent = activeWorks
        .map(function (i) { return artworksOrder[i].title; })
        .join(' + ');
    }

    railButtons.forEach(function (btn, i) {
      if (activeWorks.indexOf(i) >= 0) btn.setAttribute('aria-current', 'true');
      else btn.removeAttribute('aria-current');
    });
  }

  var artworksOrder = [];   /* work objects by index, for group spread labels */

  /* ---- flip init / teardown ---- */
  /* stretch sizing leaves portrait pages at 0x0 in the vendored build,
     so the phone leaf gets explicit px: the stage box at 3:4 */
  function flipOptions(phone) {
    if (phone) {
      var stage = doc.querySelector('.book-stage');
      var box = stage ? stage.getBoundingClientRect() : { width: 320, height: 426 };
      var w = Math.round(Math.max(260, Math.min(box.width, 520)));
      var h = Math.round(w / 0.75);
      return { width: w, height: h, size: 'fixed', usePortrait: true };
    }
    return {
      width: 420, height: 560, size: 'stretch',
      minWidth: 300, maxWidth: LEAF_MAX, minHeight: 400, maxHeight: 810,
      showCover: true, usePortrait: false
    };
  }

  function sharedOptions(phone) {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var o = flipOptions(phone);
    o.startPage = 0;
    o.drawShadow = !reduce;
    o.maxShadowOpacity = reduce ? 0 : 0.35;
    o.flippingTime = reduce ? 1 : 600;   /* 0 throws inside StPageFlip */
    o.showPageCorners = true;
    o.disableFlipByClick = false;
    o.clickEventForward = true;
    o.useMouseEvents = true;
    o.mobileScrollSupport = true;
    o.swipeDistance = 30;
    o.startZIndex = 0;
    return o;
  }

  function freshBook() {
    var old = doc.getElementById('book');
    var neu = old.cloneNode(false);
    old.parentNode.replaceChild(neu, old);
    book = neu;
    neu.setAttribute('aria-label', 'Sketchbook');
  }

  function teardownFlip() {
    if (flip && typeof flip.destroy === 'function') {
      try { flip.destroy(); } catch (e) { /* lib removes its nodes anyway */ }
    }
    flip = null;
  }

  function initFlip(phone) {
    /* pages are built even without the library: the no-flip CSS
       stacks them as a static gallery */
    var pages = buildBookDOM(phone);
    if (!window.St || !window.St.PageFlip) {
      root.classList.add('no-flip');
      return;
    }
    try {
      flip = new St.PageFlip(book, sharedOptions(phone));
      flip.loadFromHTML(pages);
    } catch (e) {
      console.error(e);
      root.classList.add('no-flip');
      flip = null;
      return;
    }
    pageCount = flip.getPageCount();
    flip.on('flip', sync);
    flip.on('changeState', sync);
    flip.on('changeOrientation', sync);
    sync();
  }

  function rebuild() {
    teardownFlip();
    freshBook();
    initFlip(phoneAtInit());
  }

  /* ---- keyboard: arrows always flip, whatever has focus.
       The old page ignored keys while a button was focused, which is
       why they stopped working after a click. Enter and Space still
       activate the focused button natively, so nothing is lost. ---- */
  function onKeyDown(e) {
    if (inspectOpen) return;   /* arrows never turn pages during inspection */
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' ||
              t.tagName === 'SELECT' || t.isContentEditable)) return;
    if (!flip || !pageCount) return;
    e.preventDefault();
    if (e.key === 'ArrowLeft') flip.flipPrev();
    else flip.flipNext();
  }

  function fillShell() {
    doc.querySelectorAll('[data-fill]').forEach(function (el) {
      var parts = el.dataset.fill.split('/');
      var value = site[parts[0]];
      parts.slice(1).forEach(function (k) { value = value ? value[k] : ''; });
      el.textContent = value || '';
    });
    doc.title = 'Sketchbook — ' + site.identity.name;
    var meta = doc.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', site.strings.metaDescription);

    var social = doc.getElementById('social');
    (site.social || []).forEach(function (s) {
      var a = doc.createElement('a');
      a.className = 'social-link';
      a.href = s.href;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = s.label;
      social.appendChild(a);
    });
  }

  function wireControls() {
    doc.getElementById('btn-prev').addEventListener('click', function () {
      if (flip) flip.flipPrev();
    });
    doc.getElementById('btn-next').addEventListener('click', function () {
      if (flip) flip.flipNext();
    });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keydown', onInspectGlobalKey, true);

    if (phoneMq.addEventListener) phoneMq.addEventListener('change', function () {
      if (!layoutPhone) rebuild();
    });
    else if (phoneMq.addListener) phoneMq.addListener(function () {
      if (!layoutPhone) rebuild();
    });
  }

  /* ---- boot ---- */
  Promise.all([
    fetchJSON(ROOT_PREFIX + 'data/site.json'),
    fetchJSON(ROOT_PREFIX + 'data/artworks.json'),
    fetchJSON(ROOT_PREFIX + 'data/sketchbook.json')
  ]).then(function (all) {
    var identity = all[0];
    var artworks = all[1].artworks;
    var sketchbook = all[2];

    site = {
      identity: identity.identity,
      strings: identity.strings,
      social: identity.social,
      coversFront: sketchbook.covers.front.elements,
      coversBack: sketchbook.covers.back.elements
    };

    artworks.forEach(function (w, i) {
      if (artIndex[w.id]) throw new Error('duplicate artwork id: ' + w.id);
      artIndex[w.id] = { i: i, work: w };
      artworksOrder.push(w);
    });

    spreads = sketchbook.spreads.map(function (sp) {
      var ids = sp.artworkIds || [sp.artworkId];
      ids.forEach(function (id) { artworkOf(id); });
      var list = ids.map(function (id) { return artIndex[id].i; });
      return { left: sp.left, right: sp.right, artworkIds: ids, artworkIdList: list };
    });

    fillShell();
    buildRail();
    wireControls();
    freshBook();
    initFlip(phoneAtInit());
  }).catch(function (err) {
    root.classList.add('no-flip');
    var notice = doc.getElementById('notice');
    if (notice) {
      notice.hidden = false;
      notice.textContent = 'The sketchbook data could not load (' + err.message + ').';
    }
  });
})();
