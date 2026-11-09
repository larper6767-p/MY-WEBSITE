
(function () {
  'use strict';

  var root = document.documentElement;
  var styles = window.getComputedStyle(root);

  function token(name) {
    var value = styles.getPropertyValue('--' + name).trim();
    return value || '#000000';
  }

  function rgb(hex) {
    var value = String(hex).replace('#', '');
    if (value.length === 3) {
      value = value[0] + value[0] + value[1] + value[1] + value[2] + value[2];
    }
    var number = parseInt(value, 16);
    return [(number >> 16) & 255, (number >> 8) & 255, number & 255];
  }

  function channel(value) {
    var normalized = value / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  }

  function luminance(hex) {
    var parts = rgb(hex);
    return 0.2126 * channel(parts[0]) +
      0.7152 * channel(parts[1]) +
      0.0722 * channel(parts[2]);
  }

  function ratio(foreground, background) {
    var light = Math.max(luminance(foreground), luminance(background));
    var dark = Math.min(luminance(foreground), luminance(background));
    return (light + 0.05) / (dark + 0.05);
  }

  function status(passes) {
    return '<span class="status ' + (passes ? 'status--pass' : 'status--fail') + '">' +
      (passes ? 'Pass' : 'Fail') +
      '</span>';
  }

  var checks = {
    primary: [
      { foreground: 'ink', background: 'paper', note: 'Default reading pair' },
      { foreground: 'ink', background: 'white', note: 'Cards and isolated surfaces' },
      { foreground: 'paper', background: 'ink', note: 'Dark blocks' },
      { foreground: 'ink', background: 'stone', note: 'Structural section' },
      { foreground: 'ink', background: 'muted', note: 'Text on muted only' },
      { foreground: 'white', background: 'maroon', note: 'Accent surface' },
      { foreground: '#000000', background: 'vermilion', foregroundLabel: 'Black', note: 'Accent surface' },
      { foreground: 'white', background: 'cobalt', note: 'Accent surface' },
      { foreground: 'ink', background: 'butter', note: 'Accent surface' }
    ],
    restricted: [
      { foreground: 'ink', background: 'vermilion', note: 'Fails normal text; large only' },
      { foreground: 'white', background: 'vermilion', note: 'Fails normal text; large only' },
      { foreground: 'paper', background: 'vermilion', note: 'Fails normal text; large only' },
      { foreground: 'muted', background: 'paper', note: 'Non-text only' },
      { foreground: 'stone', background: 'paper', note: 'Structural only' },
      { foreground: 'ink', background: 'maroon', note: 'Never' },
      { foreground: 'white', background: 'butter', note: 'Never' },
      { foreground: 'ink', background: 'cobalt', note: 'Never' },
      { foreground: 'paper', background: 'butter', note: 'Never' }
    ]
  };

  function label(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  function render(group) {
    var body = document.querySelector('[data-contrast-table="' + group + '"]');
    if (!body) return [];

    var rows = [];
    checks[group].forEach(function (check) {
      var foreground = token(check.foreground);
      var background = token(check.background);
      var value = ratio(foreground, background);
      var foregroundName = check.foregroundLabel || label(check.foreground);
      var backgroundName = label(check.background);
      var normal = value >= 4.5;
      var large = value >= 3;

      rows.push({ normal: normal, large: large });

      var row = document.createElement('tr');
      row.innerHTML =
        '<td>' + foregroundName + ' on ' + backgroundName + '</td>' +
        '<td>' + value.toFixed(2) + ':1</td>' +
        '<td>' + status(normal) + '</td>' +
        '<td>' + status(large) + '</td>' +
        '<td class="is-note">' + check.note + '</td>';
      body.appendChild(row);
    });

    return rows;
  }

  var primary = render('primary');
  var restricted = render('restricted');
  var summary = document.querySelector('[data-contrast-summary]');

  if (summary) {
    var primaryPasses = primary.filter(function (row) { return row.normal; }).length;
    var restrictedFails = restricted.filter(function (row) { return !row.normal; }).length;
    summary.textContent = primaryPasses + '/' + primary.length +
      ' primary pairs pass AA normal; ' +
      restrictedFails + '/' + restricted.length +
      ' restricted pairs correctly fail it.';
  }
})();
