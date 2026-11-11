// Drift — home page (story builder + player)
(function () {
  'use strict';

  var themes = [
    { value: 'forest',  label: 'Moonlit forest', hint: 'Owls, ferns, a quiet stream' },
    { value: 'ocean',   label: 'Slow ocean',     hint: 'Tides, boats, soft waves' },
    { value: 'space',   label: 'Drifting stars', hint: 'A gentle trip past planets' },
    { value: 'village', label: 'Snowy village',  hint: 'Lanterns, warm kitchens' },
    { value: 'train',   label: 'Night train',    hint: 'Rocking carriages, rain' },
    { value: 'garden',  label: 'Secret garden',  hint: 'Fireflies and moss' }
  ];
  var moods = [
    { value: 'calm', label: 'Calm' },
    { value: 'cozy', label: 'Cozy' },
    { value: 'dreamy', label: 'Dreamy' },
    { value: 'nostalgic', label: 'Nostalgic' }
  ];
  var timers = [10, 20, 30, 45].map(function (n) { return { value: n, label: n + ' min' }; });
  var sounds = [
    { value: 'none', label: 'None' },
    { value: 'rain', label: 'Rain' },
    { value: 'waves', label: 'Waves' },
    { value: 'fire', label: 'Crackling fire' }
  ];
  var audiences = [
    { value: 'adults', label: 'For me' },
    { value: 'kids', label: 'For my kids' }
  ];
  var ages = [
    { value: '3-5', label: 'Ages 3–5' },
    { value: '6-8', label: 'Ages 6–8' },
    { value: '9-12', label: 'Ages 9–12' }
  ];

  var state = {
    theme: 'forest', mood: 'calm', timer: 20, sound: 'none',
    audience: 'adults', age: '6-8', hasStory: false, playing: false
  };

  function $(id) { return document.getElementById(id); }

  function find(list, value) {
    for (var i = 0; i < list.length; i++) if (list[i].value === value) return list[i];
    return list[0];
  }

  // Build a group of toggle buttons once; sync() updates aria-pressed in place
  // so keyboard focus is never lost on click.
  function buildGroup(containerId, options, key, className, withHint) {
    var root = $(containerId);
    options.forEach(function (opt) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = className;
      b._key = key;
      b._value = opt.value;
      if (withHint) {
        var l = document.createElement('span');
        l.className = 'label';
        l.textContent = opt.label;
        var h = document.createElement('span');
        h.className = 'hint';
        h.textContent = opt.hint;
        b.appendChild(l);
        b.appendChild(h);
      } else {
        b.textContent = opt.label;
      }
      b.addEventListener('click', function () {
        state[key] = opt.value;
        sync();
      });
      root.appendChild(b);
    });
  }

  function sync() {
    var buttons = document.querySelectorAll('[aria-pressed], .chip, .option-card');
    Array.prototype.forEach.call(buttons, function (b) {
      if (b._key) b.setAttribute('aria-pressed', String(state[b._key] === b._value));
    });

    var isKids = state.audience === 'kids';
    $('age-box').hidden = !isKids;

    $('player-story').hidden = !state.hasStory;
    $('player-empty').hidden = state.hasStory;
    $('generate-label').textContent = state.hasStory ? 'Create another story' : 'Create story';

    $('icon-pause').hidden = !state.playing;
    $('icon-play').hidden = state.playing;
    $('toggle-play').setAttribute('aria-label', state.playing ? 'Pause' : 'Play');

    var theme = find(themes, state.theme);
    var mood = find(moods, state.mood);
    var age = find(ages, state.age);
    $('story-title').textContent = '[Generated title] · ' + theme.label;
    $('story-meta').textContent =
      (isKids ? 'Kids · ' + age.label + ' · ' : '') +
      mood.label + ' · ' + state.timer + ' min sleep timer';
    $('timer-end').textContent = state.timer + ':00';
  }

  function generate() {
    state.hasStory = true;
    state.playing = true;
    sync();
  }

  buildGroup('audiences', audiences, 'audience', 'chip');
  buildGroup('ages', ages, 'age', 'chip');
  buildGroup('themes', themes, 'theme', 'option-card', true);
  buildGroup('moods', moods, 'mood', 'chip');
  buildGroup('timers', timers, 'timer', 'chip');
  buildGroup('sounds', sounds, 'sound', 'chip');

  $('generate').addEventListener('click', generate);
  $('regenerate').addEventListener('click', generate);
  $('toggle-play').addEventListener('click', function () {
    state.playing = !state.playing;
    sync();
  });

  sync();
})();
