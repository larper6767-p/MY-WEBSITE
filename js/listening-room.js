
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;

  var ROOT_PREFIX = '../';

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
    var social = doc.getElementById('social');
    if (social && site.social) {
      social.innerHTML = '';
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

  
  var TOKEN_COLORS = {
    maroon: 'var(--maroon)',
    vermilion: 'var(--vermilion)',
    butter: 'var(--butter)'
  };

  var TOKEN_ON = {
    maroon: 'var(--on-maroon)',
    vermilion: 'var(--on-vermilion)',
    butter: 'var(--on-butter)'
  };

  var tracks = [];
  var currentTrack = null;

  function isPlaceholder(id) {
    return !id || id.indexOf('PLACEHOLDER') >= 0 || id.indexOf('placeholder') >= 0;
  }

  function selectTrack(track) {
    currentTrack = track;
    var color = track.color || 'maroon';
    var colorVar = TOKEN_COLORS[color] || TOKEN_COLORS.maroon;
    var onColorVar = TOKEN_ON[color] || TOKEN_ON.maroon;

    /* room accent */
    var field = doc.getElementById('room-accent');
    field.className = 'turntable-field';
    field.classList.add('room-accent-' + color);

    /* label colour */
    var label = doc.querySelector('.turntable__label');
    if (label) label.setAttribute('fill', colorVar);

    /* selection panel */
    var art = doc.getElementById('album-art');
    if (track.art) {
      art.innerHTML = '';
      var img = doc.createElement('img');
      img.src = ROOT_PREFIX + track.art;
      img.alt = track.title + ' — ' + track.artist;
      img.width = 240;
      img.height = 240;
      art.appendChild(img);
    } else {
      art.textContent = '[PLACEHOLDER: album art]';
    }

    doc.getElementById('track-title').textContent = track.title;
    doc.getElementById('track-artist').textContent = track.artist + (track.album ? ' · ' + track.album : '');
    doc.getElementById('track-note').textContent = track.note;
    var mood = doc.getElementById('mood-tag');
    mood.textContent = track.mood;
    mood.style.background = colorVar;
    mood.style.color = onColorVar;

    /* embed */
    var wrap = doc.getElementById('embed-wrap');
    wrap.innerHTML = '';
    if (isPlaceholder(track.spotifyId)) {
      var ph = doc.createElement('p');
      ph.className = 'embed-placeholder';
      ph.textContent = 'Preview not available yet.';
      wrap.appendChild(ph);
    } else {
      var iframe = doc.createElement('iframe');
      iframe.src = 'https://open.spotify.com/embed/track/' + encodeURIComponent(track.spotifyId);
      iframe.width = '100%';
      iframe.height = '152';
      iframe.frameBorder = '0';
      iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
      iframe.loading = 'lazy';
      iframe.title = 'Spotify preview of ' + track.title;
      wrap.appendChild(iframe);
    }

    /* tonearm swing */
    var tonearm = doc.querySelector('.turntable__tonearm');
    if (tonearm) {
      tonearm.classList.remove('tonearm-swing');
      /* force reflow */
      void tonearm.offsetWidth;
      tonearm.classList.add('tonearm-swing');
    }

    /* track list highlight */
    doc.querySelectorAll('.track-item').forEach(function (btn) {
      if (btn.dataset.id === track.id) {
        btn.setAttribute('aria-current', 'true');
      } else {
        btn.removeAttribute('aria-current');
      }
    });

    /* live region */
    var live = doc.getElementById('live-region');
    if (live) live.textContent = 'Now selected: ' + track.title + ' by ' + track.artist;
  }

  function buildTrackList(tracks) {
    var list = doc.getElementById('track-list');
    tracks.forEach(function (track, i) {
      var li = doc.createElement('li');
      var btn = doc.createElement('button');
      btn.type = 'button';
      btn.className = 'track-item';
      btn.dataset.id = track.id;
      btn.innerHTML =
        '<span class="track-num">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<span><span class="track-item-title">' + track.title + '</span><br>' +
        '<span class="track-item-artist">' + track.artist + '</span></span>' +
        '<span class="track-item-mood">' + track.mood + '</span>';
      btn.addEventListener('click', function () { selectTrack(track); });
      li.appendChild(btn);
      list.appendChild(li);
    });
  }

  
  function wirePause() {
    var toggle = doc.getElementById('pause-toggle');
    var record = doc.querySelector('.turntable__record');
    if (!toggle || !record) return;
    toggle.addEventListener('click', function () {
      var paused = toggle.getAttribute('aria-pressed') === 'true';
      if (paused) {
        record.style.animationPlayState = 'running';
        toggle.setAttribute('aria-pressed', 'false');
        toggle.textContent = 'Pause record';
      } else {
        record.style.animationPlayState = 'paused';
        toggle.setAttribute('aria-pressed', 'true');
        toggle.textContent = 'Play record';
      }
    });
  }

  
  Promise.all([
    fetchJSON(ROOT_PREFIX + 'data/site.json'),
    fetchJSON(ROOT_PREFIX + 'data/tracks.json')
  ]).then(function (all) {
    var site = all[0];
    var tracksData = all[1].tracks || [];

    fillShell(site);

    tracks = tracksData.slice().sort(function (a, b) {
      return (a.order || 0) - (b.order || 0);
    });

    buildTrackList(tracks);
    wirePause();

    if (tracks.length > 0) {
      selectTrack(tracks[0]);
    }
  }).catch(function (err) {
    console.error(err);
  });
})();
