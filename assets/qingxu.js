const scene = document.querySelector('#toothScene');
const slider = document.querySelector('#whitening');
const play = document.querySelector('#play');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const progressValue = document.querySelector('#progressValue');
const shadeName = document.querySelector('#shadeName');
const shadeDot = document.querySelector('#shadeDot');
let progress = 0;
let playing = false;
let frame = 0;
let lastTime = null;
let cycleTime = 0;
let inView = false;
const duration = 8000;
const holdDuration = 1800;
const returnDuration = 1600;
const cycleDuration = duration + holdDuration + returnDuration;

const foam = document.querySelector('#brushFoam');
for (let index = 0; index < 18; index++) {
  const bubble = document.createElement('i');
  bubble.style.left = `${(index * 29) % 85}%`;
  bubble.style.top = `${(index * 37) % 70}%`;
  bubble.style.setProperty('--bubble-size', `${18 + index % 5 * 7}px`);
  foam.append(bubble);
}

function paint(value, resetting = false) {
  progress = Math.min(100, Math.max(0, value));
  // One timeline drives the brush, foam and enamel, including manual scrubbing.
  const whitening = Math.min(1, Math.max(0, (progress - 15) / 70));
  const enter = Math.min(1, progress / 10);
  const exit = Math.min(1, Math.max(0, (progress - 82) / 16));
  const stroke = Math.sin(progress / 100 * Math.PI * 24);
  const foamAmount = Math.min(1, Math.max(0, (progress - 14) / 20)) * (1 - Math.min(1, Math.max(0, (progress - 77) / 19)));
  scene.style.setProperty('--progress', whitening);
  scene.style.setProperty('--brush-opacity', resetting ? 0 : enter * (1 - exit));
  scene.style.setProperty('--brush-x', `${(1 - enter) * 20 + stroke * 5 + exit * 26}%`);
  scene.style.setProperty('--brush-y', `${stroke * .7 + exit * 9}%`);
  scene.style.setProperty('--brush-angle', `${-5 + stroke * 2 + exit * 14}deg`);
  scene.style.setProperty('--foam-opacity', resetting ? 0 : foamAmount);
  scene.style.setProperty('--foam-scale', .65 + foamAmount * .45 + stroke * .035);
  slider.value = Math.round(progress);
  progressValue.value = `${Math.round(progress)}%`;
  shadeName.textContent = resetting ? '准备下一次刷动' : progress < 15 ? '牙膏已就位' : progress < 78 ? '轻轻刷动 · 绵密起泡' : progress < 98 ? '泡沫散去 · 笑容焕亮' : '清新亮白';
  shadeDot.style.background = `hsl(43 ${45 - whitening * 40}% ${68 + whitening * 29}%)`;
}

function syncMotion() {
  scene.classList.toggle('is-paused', !playing || !inView || document.hidden);
}

function pause() {
  playing = false;
  cancelAnimationFrame(frame);
  lastTime = null;
  play.textContent = progress >= 100 ? '播放 ↻' : '播放 ▷';
  syncMotion();
}

function tick(time) {
  if (!playing) return;
  if (lastTime !== null) cycleTime = (cycleTime + time - lastTime) % cycleDuration;
  lastTime = time;
  if (cycleTime <= duration) {
    paint(cycleTime / duration * 100);
  } else if (cycleTime <= duration + holdDuration) {
    paint(100);
  } else {
    const returning = (cycleTime - duration - holdDuration) / returnDuration;
    paint(100 * (1 - returning * returning * (3 - 2 * returning)), true);
  }
  frame = requestAnimationFrame(tick);
}

function schedule() {
  cancelAnimationFrame(frame);
  lastTime = null;
  syncMotion();
  if (playing && inView && !document.hidden) frame = requestAnimationFrame(tick);
}

function start() {
  if (progress >= 100) paint(0);
  cycleTime = progress / 100 * duration;
  playing = true;
  play.textContent = '暂停 Ⅱ';
  schedule();
}

slider.addEventListener('input', () => {
  pause();
  paint(Number(slider.value));
});
play.addEventListener('click', () => playing ? pause() : start());
document.querySelector('#replay').addEventListener('click', () => {
  paint(0);
  start();
});
document.addEventListener('visibilitychange', () => {
  schedule();
});
const sceneObserver = new IntersectionObserver(([entry]) => {
  inView = entry.isIntersecting;
  schedule();
}, { threshold: 0.15 });
sceneObserver.observe(scene);
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) {
    pause();
    scene.style.removeProperty('--pointer-x');
    scene.style.removeProperty('--pointer-y');
    document.getAnimations().forEach(animation => {
      if (animation.effect.getComputedTiming().endTime !== Infinity) animation.finish();
    });
  }
});
paint(reducedMotion.matches ? 100 : 0);
if (!reducedMotion.matches) {
  const tooth = document.querySelector('#tooth');
  const brushImage = document.querySelector('.toothbrush-image');
  function startWhenImagesReady() {
    if (tooth.complete && tooth.naturalWidth && brushImage.complete && brushImage.naturalWidth && !reducedMotion.matches) start();
  }
  tooth.addEventListener('load', startWhenImagesReady, { once: true });
  brushImage.addEventListener('load', startWhenImagesReady, { once: true });
  startWhenImagesReady();
} else pause();

// Decorative effects follow the same pause state as the whitening timeline.
const particles = document.createElement('div');
particles.className = 'clean-particles';
particles.setAttribute('aria-hidden', 'true');
for (let index = 0; index < 12; index++) {
  const particle = document.createElement('i');
  particle.style.setProperty('--index', index);
  particle.style.left = `${18 + (index * 17) % 66}%`;
  particle.style.top = `${22 + (index * 13) % 43}%`;
  particles.append(particle);
}
scene.append(particles);

let pointerFrame = 0;
scene.addEventListener('pointermove', event => {
  if (reducedMotion.matches || event.pointerType !== 'mouse' || !playing) return;
  cancelAnimationFrame(pointerFrame);
  const { clientX, clientY } = event;
  pointerFrame = requestAnimationFrame(() => {
    if (reducedMotion.matches || !playing) return;
    const bounds = scene.getBoundingClientRect();
    scene.style.setProperty('--pointer-x', `${(clientX - bounds.left - bounds.width / 2) * .025}px`);
    scene.style.setProperty('--pointer-y', `${(clientY - bounds.top - bounds.height / 2) * .018}px`);
  });
});
scene.addEventListener('pointerleave', () => {
  cancelAnimationFrame(pointerFrame);
  scene.style.setProperty('--pointer-x', '0px');
  scene.style.setProperty('--pointer-y', '0px');
});

// Content stays visible without JavaScript; animate only when it enters view.
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    revealObserver.unobserve(entry.target);
    if (!reducedMotion.matches) entry.target.animate([
      { opacity: 0, transform: 'translateY(28px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 850, easing: 'cubic-bezier(.2,.65,.25,1)' });
  });
}, { threshold: 0.12 });
document.querySelectorAll('.section-heading,.ritual-card,.product-image,.product-copy,.closing').forEach(element => revealObserver.observe(element));

const prices = { 90: 19.9, 120: 29.9, 180: 39.9 };
let size = 120;
let quantity = 1;
function updateProduct() {
  document.querySelector('#quantity').value = quantity;
  document.querySelector('#sizeLabel').textContent = `${size} g`;
  document.querySelector('#price').textContent = `¥${(prices[size] * quantity).toFixed(2)}`;
  document.querySelector('#minus').disabled = quantity <= 1;
  document.querySelector('#plus').disabled = quantity >= 9;
  document.querySelectorAll('[data-size]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.size) === size)));
}
document.querySelectorAll('[data-size]').forEach(button => button.addEventListener('click', () => {
  size = Number(button.dataset.size);
  updateProduct();
}));
document.querySelector('#minus').addEventListener('click', () => {
  quantity = Math.max(1, quantity - 1);
  updateProduct();
});
document.querySelector('#plus').addEventListener('click', () => {
  quantity = Math.min(9, quantity + 1);
  updateProduct();
});
let toastTimer;
document.querySelector('#buy').addEventListener('click', () => {
  const toast = document.querySelector('#toast');
  toast.textContent = `已加入体验袋：清序薄荷牙膏 ${size} g × ${quantity}（演示）`;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
});
