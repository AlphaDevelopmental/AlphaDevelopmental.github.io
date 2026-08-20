document.getElementById('year').textContent = new Date().getFullYear();

const lines = [
  { tag: '[WEB]', text: 'web & software development module' },
  { tag: '[SEC]', text: 'cybersecurity & application security module' },
  { tag: '[MKT]', text: 'digital marketing module' },
  { tag: '[TRAIN]', text: 'technical training module' },
];

const container = document.getElementById('boot-sequence');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function renderStatic() {
  container.innerHTML = lines
    .map(l => `<div class="boot-line done" data-tag="${l.tag}">${l.text}</div>`)
    .join('');
}

if (prefersReducedMotion) {
  renderStatic();
} else {
  container.innerHTML = '';
  let i = 0;

  function nextLine() {
    if (i >= lines.length) return;
    const div = document.createElement('div');
    div.className = 'boot-line';
    div.dataset.tag = lines[i].tag;
    div.innerHTML = lines[i].text + '<span class="cursor">&#9608;</span>';
    container.appendChild(div);

    setTimeout(() => {
      div.classList.add('done');
      div.innerHTML = lines[i].text;
      i++;
      if (i < lines.length) {
        setTimeout(nextLine, 220);
      }
    }, 550);
  }

  nextLine();
}
