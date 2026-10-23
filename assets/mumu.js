const scene = document.querySelector('#mixScene');
const range = document.querySelector('#mixProgress');
const play = document.querySelector('#mixPlay');
const label = document.querySelector('#mixLabel');
const percent = document.querySelector('#mixPercent');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const steps = [...document.querySelectorAll('[data-seek]')];
let value = 0;
let running = !reduced.matches;
let visible = false;
let frame = 0;
let elapsed = 0;
let previous = null;
const clamp = n => Math.max(0, Math.min(1, n));

for (let i = 0; i < 16; i++) {
  const grain = document.createElement('i');
  grain.style.setProperty('--left', `${(i * 17) % 90}%`);
  grain.style.setProperty('--delay', `${-i * .09}s`);
  document.querySelector('#powderStream').append(grain);
}

function render(progress) {
  value = Math.max(0, Math.min(100, progress));
  const enter = clamp(value / 18);
  const pour = clamp((value - 18) / 5) * (1 - clamp((value - 50) / 5));
  const exit = clamp((value - 55) / 14);
  const mix = clamp((value - 55) / 8) * (1 - clamp((value - 85) / 7));
  scene.style.setProperty('--scoop-x', `${(1 - enter) * 48 + exit * 60}px`);
  scene.style.setProperty('--scoop-y', `${-(1 - enter) * 12 - exit * 25}px`);
  scene.style.setProperty('--scoop-angle', `${-clamp((value - 18) / 10) * 24 + exit * 24}deg`);
  scene.style.setProperty('--scoop-opacity', 1 - exit);
  scene.style.setProperty('--powder-left', 1 - clamp((value - 20) / 32));
  scene.style.setProperty('--pour', pour);
  scene.style.setProperty('--mix', mix);
  scene.style.setProperty('--bottle-angle', `${Math.sin(value * .6) * 5 * mix}deg`);
  scene.style.setProperty('--milk-angle', `${Math.sin(value * .6 + 1) * 8 * mix}deg`);
  scene.style.setProperty('--swirl-angle', `${value * 12}deg`);
  scene.style.setProperty('--foam', clamp((value - 88) / 10));
  range.value = Math.round(value);
  percent.value = `${Math.round(value)}%`;
  label.textContent = value < 18 ? '一勺温柔，准备就绪' : value < 55 ? '粉末轻落，心意融入' : value < 90 ? '轻轻旋动，柔和交融' : '小小日常，满满温柔';
  steps.forEach((button, index) => {
    const active = index === (value < 18 ? 0 : value < 90 ? 1 : 2);
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function tick(time) {
  if (previous !== null) elapsed = (elapsed + time - previous) % 12000;
  previous = time;
  render(Math.min(100, elapsed / 100));
  frame = requestAnimationFrame(tick);
}

function schedule() {
  cancelAnimationFrame(frame);
  previous = null;
  const active = running && visible && !document.hidden;
  scene.classList.toggle('paused', !active);
  play.textContent = running ? '暂停 Ⅱ' : '播放 ▷';
  if (active) frame = requestAnimationFrame(tick);
}

function seek(next) {
  running = false;
  elapsed = next * 100;
  render(next);
  schedule();
}
range.addEventListener('input', () => seek(Number(range.value)));
play.addEventListener('click', () => {
  running = !running;
  if (running && value >= 100) elapsed = 0;
  schedule();
});
document.querySelector('#mixReplay').addEventListener('click', () => {
  elapsed = 0;
  render(0);
  running = true;
  schedule();
});
steps.forEach(button => button.addEventListener('click', () => seek(Number(button.dataset.seek))));
new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); }, { threshold: .25 }).observe(scene);
document.addEventListener('visibilitychange', schedule);
reduced.addEventListener('change', () => { if (reduced.matches) seek(100); });
render(reduced.matches ? 100 : 0);
schedule();

const art = document.querySelector('#heroArt');
let pointerFrame = 0;
art.addEventListener('pointermove', event => {
  if (reduced.matches || event.pointerType !== 'mouse') return;
  cancelAnimationFrame(pointerFrame);
  const { clientX, clientY } = event;
  pointerFrame = requestAnimationFrame(() => {
    if (reduced.matches) return;
    const rect = art.getBoundingClientRect();
    art.style.setProperty('--pointer-x', `${(clientX - rect.left - rect.width / 2) * .025}px`);
    art.style.setProperty('--pointer-y', `${(clientY - rect.top - rect.height / 2) * .018}px`);
  });
});
art.addEventListener('pointerleave', () => {
  cancelAnimationFrame(pointerFrame);
  art.style.setProperty('--pointer-x', '0px');
  art.style.setProperty('--pointer-y', '0px');
});

const quantities = document.querySelector('#quantity');
let size = 800;
let quantity = 1;
document.querySelectorAll('[data-size]').forEach(button => button.addEventListener('click', () => {
  size = Number(button.dataset.size);
  document.querySelector('#sizeName').textContent = `${size} g`;
  document.querySelectorAll('[data-size]').forEach(other => other.setAttribute('aria-pressed', String(Number(other.dataset.size) === size)));
}));
function updateQuantity(delta) {
  quantity = Math.min(9, Math.max(1, quantity + delta));
  quantities.value = quantity;
  document.querySelector('#minus').disabled = quantity === 1;
  document.querySelector('#plus').disabled = quantity === 9;
}
document.querySelector('#minus').addEventListener('click', () => updateQuantity(-1));
document.querySelector('#plus').addEventListener('click', () => updateQuantity(1));
let toastTimer;
document.querySelector('#add').addEventListener('click', () => {
  const toast = document.querySelector('#toast');
  toast.textContent = `已加入心愿袋：初芽概念款 ${size} g × ${quantity}（演示）`;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
});
