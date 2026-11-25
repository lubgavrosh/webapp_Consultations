// Szkielet: ekrany E1-E6, nawigacja po hash (#start, #terminy, ...).
const SCREENS = {
  start: {title: 'Start', nav: 'start', render: renderStart},
  terminy: {title: 'Wolne terminy', nav: 'terminy', render: renderTerminy},
  szczegoly: {title: 'Szczegóły terminu', nav: 'terminy', render: renderSzczegoly},
  zapis: {title: 'Zapis na konsultacje', nav: 'terminy', render: renderZapis},
  moje: {title: 'Moje zapisy', nav: 'moje', render: renderMoje},
  prowadzacy: {title: 'Terminy prowadzącego', nav: 'prowadzacy', render: renderProwadzacy}
};
const main = document.getElementById('main');
let terminy = [];
let wybrany = null;

const wolne = t => t.limit - t.zapisani;
const fmt = d => new Date(d).toLocaleDateString('pl-PL', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'});
const ESC = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'};
const h = s => String(s).replace(/[&<>"]/g, c => ESC[c]);
const crumbs = (...p) => '<p class="crumbs"><a href="#start">Start</a>' + p.map(x => ' / ' + x).join('') + '</p>';

function renderStart() {
  return `<h1>Czego potrzebujesz?</h1>
  <div class="tiles">
    <a class="tile primary" href="#terminy"><strong>Znajdź termin</strong>Przeglądaj wolne konsultacje i zapisz się.</a>
    <a class="tile" href="#moje"><strong>Moje zapisy</strong>Sprawdź swoje wizyty lub zrezygnuj.</a>
    <a class="tile" href="#prowadzacy"><strong>Terminy prowadzącego</strong>Dodaj termin i zobacz zapisanych.</a>
  </div>`;
}

function detailHtml(t) {
  return `<h2>Szczegóły terminu</h2><dl><dt>Prowadzący</dt><dd>${h(t.prowadzacy)}</dd>
  <dt>Data</dt><dd>${fmt(t.data)}</dd><dt>Godzina</dt><dd>${h(t.godzina)}</dd>
  <dt>Stacjonarnie</dt><dd>${h(t.sala)}</dd><dt>Online</dt><dd>link do spotkania</dd>
  <dt>Wolne miejsca</dt><dd>${wolne(t)} z ${t.limit}</dd></dl>
  <div class="row"><a class="btn" href="#zapis">Zapisz się →</a></div>`;
}

function renderTerminy() {
  const items = terminy.map(t => `<li><button class="item" data-id="${t.id}" aria-pressed="${!!wybrany && wybrany.id === t.id}">
    <strong>${h(t.prowadzacy)}</strong><br>${fmt(t.data)}, ${h(t.godzina)}<br>
    ${wolne(t) > 0 ? wolne(t) + ' wolne miejsca' : 'Brak wolnych miejsc'}</button></li>`).join('');
  return `${crumbs('Wolne terminy')}<h1>Wolne terminy</h1>
  <div class="split"><ul class="list" aria-label="Lista terminów">${items}</ul>
  <div class="panel" aria-live="polite">${wybrany ? detailHtml(wybrany) : '<p class="note">Wybierz termin z listy, aby zobaczyć szczegóły.</p>'}</div></div>`;
}

function renderSzczegoly() {
  if (!wybrany) return renderTerminy();
  return `${crumbs('<a href="#terminy">Wolne terminy</a>', 'Szczegóły')}<div class="panel">${detailHtml(wybrany)}</div>
  <div class="row"><a class="btn sec" href="#terminy">← Wstecz</a></div>`;
}

function renderZapis() {
  if (!wybrany) return renderTerminy();
  return `${crumbs('<a href="#terminy">Wolne terminy</a>', 'Zapis')}<h1>Zapis na konsultacje</h1>
  <form class="panel" novalidate><p class="note">* pola obowiązkowe</p>
  <label for="termin">Termin *</label><input id="termin" type="text" readonly value="${h(fmt(wybrany.data))}, ${h(wybrany.godzina)}, ${h(wybrany.prowadzacy)}">
  <label for="temat">Temat konsultacji *</label><input id="temat" name="temat" type="text" aria-describedby="temat-err">
  <p class="err" id="temat-err" role="alert"></p>
  <fieldset><legend>Forma konsultacji *</legend>
  <label><input type="radio" name="forma" checked> Stacjonarnie (${h(wybrany.sala)})</label>
  <label><input type="radio" name="forma"> Online (link)</label></fieldset>
  <div class="row"><button class="btn" type="submit">Potwierdź zapis</button><a class="btn sec" href="#szczegoly">Anuluj</a></div></form>`;
}

function renderMoje() {
  return `${crumbs('Moje zapisy')}<h1>Moje zapisy</h1><div class="panel"><p class="note">Brak zapisów. Lista własnych wizyt pojawi się w kolejnym etapie.</p><a class="btn" href="#terminy">Znajdź termin</a></div>`;
}

function renderProwadzacy() {
  return `${crumbs('Terminy prowadzącego')}<h1>Terminy prowadzącego</h1><div class="panel"><p class="note">Dodawanie i edycja terminów oraz lista zapisanych – do zrobienia.</p></div>`;
}

function route() {
  const key = (location.hash || '#start').slice(1);
  const s = SCREENS[key] || SCREENS.start;
  main.innerHTML = s.render();
  document.title = s.title + ' – Zapisy na konsultacje';
  document.querySelectorAll('nav a').forEach(a => {
    if (a.dataset.nav === s.nav) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  if (key === 'terminy') main.querySelectorAll('.item').forEach(b => b.onclick = () => {
    wybrany = terminy.find(t => t.id == b.dataset.id);
    if (matchMedia('(max-width:720px)').matches) location.hash = '#szczegoly'; else route();
  });
  const f = main.querySelector('form');
  if (f) f.onsubmit = e => {
    e.preventDefault();
    const v = f.temat.value.trim();
    document.getElementById('temat-err').textContent = v.length < 5 ? 'Wpisz temat konsultacji (co najmniej 5 znaków).' : '';
  };
}

fetch('dane/terminy.json').then(r => r.json()).then(d => { terminy = d; route(); })
  .catch(() => { main.innerHTML = '<p class="err">Nie udało się wczytać danych. Uruchom aplikację przez serwer (zob. README).</p>'; });
addEventListener('hashchange', route);
