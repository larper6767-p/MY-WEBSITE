/* ============================================================
   SHARED PAGE SCRIPT
   Fills data-fill attributes and social links from site.json.
   On the About page, renders the blocks from about.blocks.
   ============================================================ */
(function () {
  'use strict';

  var doc = document;

  var ROOT_PREFIX = (function () {
    /* pages sit at the site root or one level down */
    return location.pathname.indexOf('/about/') >= 0 ||
           location.pathname.indexOf('/beyond/') >= 0 ||
           location.pathname.indexOf('/sketchbook/') >= 0
      ? '../' : '';
  })();

  function fetchJSON(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(r.status + ' ' + url);
      return r.json();
    });
  }

  function fillShell(site) {
    doc.querySelectorAll('[data-fill]').forEach(function (el) {
      var parts = el.dataset.fill.split('/');
      var value = site[parts[0]];
      parts.slice(1).forEach(function (k) { value = value ? value[k] : ''; });
      el.textContent = value || '';
    });
    var title = doc.querySelector('title');
    if (title && site.identity && site.identity.name) {
      /* keep the page-specific title; only update if it is a placeholder */
    }

    var social = doc.getElementById('social');
    if (social && site.social) {
      site.social.forEach(function (s) {
        var a = doc.createElement('a');
        a.className = 'social-link';
        a.href = s.href;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = s.label;
        social.appendChild(a);
      });
    }
  }

  function renderAboutBlocks(about) {
    var container = doc.getElementById('about-blocks');
    if (!container || !about || !about.blocks) return;

    about.blocks.forEach(function (block) {
      var type = block.type || 'text';

      if (type === 'text') {
        var sec = doc.createElement('div');
        sec.className = 'block block--text';
        if (block.heading) {
          var h = doc.createElement('h2');
          h.className = 'block-heading';
          h.textContent = block.heading;
          sec.appendChild(h);
        }
        (block.paragraphs || []).forEach(function (para) {
          var p = doc.createElement('p');
          p.textContent = para;
          sec.appendChild(p);
        });
        container.querySelector('.about-left').appendChild(sec);

      } else if (type === 'photo') {
        var fig = doc.createElement('figure');
        fig.className = 'block block--photo';
        var frame = doc.createElement('div');
        frame.className = 'photo-frame';
        if (block.src) {
          var img = doc.createElement('img');
          img.src = ROOT_PREFIX + block.src;
          img.alt = block.alt || '';
          img.width = block.width || 600;
          img.height = block.height || 400;
          img.loading = 'lazy';
          frame.appendChild(img);
        } else {
          frame.textContent = block.alt || '[PLACEHOLDER: photo]';
        }
        fig.appendChild(frame);
        if (block.caption) {
          var cap = doc.createElement('figcaption');
          cap.textContent = block.caption;
          fig.appendChild(cap);
        }
        container.querySelector('.about-left').appendChild(fig);

      } else if (type === 'list') {
        var sec2 = doc.createElement('div');
        sec2.className = 'block block--list';
        if (block.heading) {
          var h2 = doc.createElement('h2');
          h2.className = 'block-heading';
          h2.textContent = block.heading;
          sec2.appendChild(h2);
        }
        var dl = doc.createElement('dl');
        (block.rows || []).forEach(function (row) {
          var dt = doc.createElement('dt');
          dt.textContent = row.year;
          var dd = doc.createElement('dd');
          dd.textContent = row.label;
          dl.appendChild(dt);
          dl.appendChild(dd);
        });
        sec2.appendChild(dl);
        container.querySelector('.about-right').appendChild(sec2);

      } else if (type === 'tags') {
        var sec3 = doc.createElement('div');
        sec3.className = 'block block--tags';
        if (block.heading) {
          var h3 = doc.createElement('h2');
          h3.className = 'block-heading';
          h3.textContent = block.heading;
          sec3.appendChild(h3);
        }
        var ul = doc.createElement('ul');
        ul.className = 'tags';
        (block.items || []).forEach(function (item) {
          var li = doc.createElement('li');
          li.textContent = item;
          ul.appendChild(li);
        });
        sec3.appendChild(ul);
        container.querySelector('.about-right').appendChild(sec3);

      } else {
        /* unknown type: render as text in the left column */
        var sec4 = doc.createElement('div');
        sec4.className = 'block block--text';
        var p = doc.createElement('p');
        p.textContent = JSON.stringify(block);
        sec4.appendChild(p);
        container.querySelector('.about-left').appendChild(sec4);
      }
    });
  }

  fetchJSON(ROOT_PREFIX + 'data/site.json').then(function (site) {
    fillShell(site);
    renderAboutBlocks(site.about);
  }).catch(function (err) {
    console.error(err);
  });
})();
