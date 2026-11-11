// Drift — "My stories" library
(function () {
  'use strict';

  // SAMPLE DATA: edit or replace these entries with real stories.
  var stories = [
    { id: 's1', title: 'The Owl Who Counted Stars',   setting: 'Moonlit forest', kids: false, age: '',    meta: 'Calm · 20 min · Soft & low',            date: 'Nov 9' },
    { id: 's2', title: 'Pip and the Firefly Lantern', setting: 'Secret garden',  kids: true,  age: '3–5',  meta: 'Cozy · 10 min · Gentle whisper',        date: 'Nov 8' },
    { id: 's3', title: 'The 11:40 to Nowhere',        setting: 'Night train',    kids: false, age: '',    meta: 'Nostalgic · 30 min · Warm storyteller', date: 'Nov 6' },
    { id: 's4', title: 'A Slow Trip Past Saturn',     setting: 'Drifting stars', kids: true,  age: '6–8',  meta: 'Dreamy · 20 min · Warm storyteller',    date: 'Nov 4' },
    { id: 's5', title: 'Where the Tide Turns Back',   setting: 'Slow ocean',     kids: false, age: '',    meta: 'Calm · 45 min · Soft & low',            date: 'Nov 2' },
    { id: 's6', title: 'The Lantern Keeper’s Kitchen', setting: 'Snowy village', kids: true, age: '9–12', meta: 'Cozy · 20 min · Soft & low',         date: 'Oct 30' }
  ];

  var filters = [
    { value: 'all', label: 'All' },
    { value: 'fav', label: 'Favorites' },
    { value: 'kids', label: 'Kids' },
    { value: 'adults', label: 'For me' }
  ];

  var STORAGE_KEY = 'drift:favorites';
  var state = { filter: 'all', query: '', favs: loadFavs() };

  function loadFavs() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* storage unavailable: fall through */ }
    return { s2: true, s4: true };
  }

  function saveFavs() {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.favs)); }
    catch (e) { /* ignore */ }
  }

  function $(id) { return document.getElementById(id); }

  function svg(markup, size) {
    var span = document.createElement('span');
    span.innerHTML = '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true">' + markup + '</svg>';
    return span.firstChild;
  }

  var STAR = '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"></path>';
  var PLAY = '<path d="M7 4v16l13-8z" fill="currentColor" stroke="none"></path>';

  function visible() {
    var q = state.query.trim().toLowerCase();
    return stories.filter(function (s) {
      if (state.filter === 'fav' && !state.favs[s.id]) return false;
      if (state.filter === 'kids' && !s.kids) return false;
      if (state.filter === 'adults' && s.kids) return false;
      if (q && (s.title + ' ' + s.setting + ' ' + s.meta).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
  }

  function el(tag, className, text) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    if (text != null) n.textContent = text;
    return n;
  }

  function card(s) {
    var fav = !!state.favs[s.id];
    var art = el('article', 'story-card');

    var top = el('div', 'story-card-top');
    var tags = el('div', 'tags');
    tags.appendChild(el('span', 'tag', s.setting));
    if (s.kids) tags.appendChild(el('span', 'tag tag--kids', 'Kids · ' + s.age));
    top.appendChild(tags);

    var btn = el('button', 'fav-btn');
    btn.type = 'button';
    btn.dataset.fav = s.id;
    btn.setAttribute('aria-pressed', String(fav));
    btn.setAttribute('aria-label', fav ? 'Remove from favorites' : 'Add to favorites');
    btn.appendChild(svg(STAR, 20));
    btn.addEventListener('click', function () {
      state.favs[s.id] = !fav;
      saveFavs();
      render(s.id);
    });
    top.appendChild(btn);
    art.appendChild(top);

    var titleBlock = el('div', 'title-block');
    titleBlock.appendChild(el('h2', null, s.title));
    titleBlock.appendChild(el('span', 'meta', s.meta));
    art.appendChild(titleBlock);

    var foot = el('div', 'story-card-foot');
    foot.appendChild(el('span', 'date', s.date));
    var play = el('a', 'play-link');
    play.href = 'index.html';
    play.appendChild(svg(PLAY, 14));
    play.appendChild(document.createTextNode('Play'));
    foot.appendChild(play);
    art.appendChild(foot);

    return art;
  }

  function render(refocusId) {
    // filter chips
    Array.prototype.forEach.call($('filters').children, function (b) {
      b.setAttribute('aria-pressed', String(b._value === state.filter));
    });

    var items = visible();
    var grid = $('story-grid');
    grid.textContent = '';
    items.forEach(function (s) { grid.appendChild(card(s)); });

    grid.hidden = items.length === 0;
    $('empty').hidden = items.length !== 0;
    $('empty-text').textContent = state.filter === 'fav' && !state.query
      ? 'Tap the star on a story to add it to your favorites.'
      : 'Try a different filter or search.';

    if (refocusId) {
      var again = grid.querySelector('[data-fav="' + refocusId + '"]');
      if (again) again.focus();
    }
  }

  filters.forEach(function (f) {
    var b = el('button', 'chip', f.label);
    b.type = 'button';
    b._value = f.value;
    b.addEventListener('click', function () { state.filter = f.value; render(); });
    $('filters').appendChild(b);
  });

  $('search').addEventListener('input', function (e) {
    state.query = e.target.value;
    render();
  });

  render();
})();
