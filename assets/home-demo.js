// The new Home, played as a loop while it is on screen: the request, three
// helpers working at the same time (each saying what it is doing), then the
// finished file. Shows the final state at once when motion is reduced.

const root = document.querySelector('[data-home-demo]');
if (root) {
  const mark = root.querySelector('.owm');
  const status = root.querySelector('[data-status]');
  const answer = root.querySelector('.hx-answer');
  const cards = [...root.querySelectorAll('.hx-h')];
  const head = root.querySelector('[data-helpers-head]');
  const SCRIPT = [
    { doing: ['Searching the web for “bakery rents high street”', 'Reading rightmove.co.uk', 'Reading zoopla.co.uk', 'Comparing 9 listings'], done: 6200 },
    { doing: ['Searching the web for “artisan bread prices”', 'Reading 3 local bakery menus', 'Checking supplier price lists'], done: 7600 },
    { doing: ['Planning the slides', 'Designing slides', 'Writing speaker notes', 'Checking the slides'], done: 10200 }
  ];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timers = [];
  let playing = false;
  const later = (ms, fn) => timers.push(setTimeout(fn, ms));
  const fmt = (ms) => `${Math.max(0, Math.round(ms / 1000))}s`;

  function setCard(card, state, doing, time) {
    card.classList.toggle('on', state !== 'hidden');
    card.classList.toggle('working', state === 'working');
    card.classList.toggle('done', state === 'done');
    if (doing != null) card.querySelector('.hx-doing').textContent = doing;
    if (time != null) card.querySelector('time').textContent = time;
  }

  function finalState() {
    mark.dataset.state = 'idle';
    status.innerHTML = '';
    head.textContent = '3 helpers helped';
    cards.forEach((c, i) => setCard(c, 'done', 'Finished', fmt(SCRIPT[i].done - 1200 - i * 300)));
    answer.classList.add('on');
  }

  function play() {
    timers.forEach(clearTimeout);
    timers = [];
    mark.dataset.state = 'idle';
    status.innerHTML = '';
    answer.classList.remove('on');
    head.textContent = '';
    cards.forEach((c) => setCard(c, 'hidden', 'Getting started', '0s'));
    later(500, () => { mark.dataset.state = 'working'; status.innerHTML = '<b>Planning the work</b>'; });
    cards.forEach((card, i) => {
      const start = 1200 + i * 300;
      const s = SCRIPT[i];
      later(start, () => { setCard(card, 'working', 'Getting started', '0s'); head.textContent = `${cards.filter((c) => c.classList.contains('on')).length} helpers working`; status.innerHTML = '<b>Helpers are working</b>'; });
      s.doing.forEach((text, k) => later(start + 500 + k * ((s.done - start - 600) / s.doing.length), () => setCard(card, 'working', text)));
      for (let t = 1000; t < s.done - start; t += 1000) later(start + t, () => { if (card.classList.contains('working')) card.querySelector('time').textContent = fmt(t); });
      later(s.done, () => {
        setCard(card, 'done', 'Finished', fmt(s.done - start));
        const left = cards.filter((c) => c.classList.contains('working')).length;
        head.textContent = left ? `${left} helper${left === 1 ? '' : 's'} working` : '3 helpers helped';
      });
    });
    later(10500, () => { status.innerHTML = '<b>Writing the answer</b>'; });
    later(11200, () => { mark.dataset.state = 'idle'; status.innerHTML = ''; answer.classList.add('on'); });
    later(19000, () => { if (playing) play(); });
  }

  if (reduced) finalState();
  else {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !playing) { playing = true; play(); }
      else if (!e.isIntersecting && playing) { playing = false; timers.forEach(clearTimeout); timers = []; finalState(); }
    }, { threshold: 0.35 }).observe(root);
    finalState();
  }
}
