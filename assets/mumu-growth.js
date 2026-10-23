(() => {
  const scene = document.querySelector('#feedingScene'), slider = document.querySelector('#feedingProgress'), play = document.querySelector('#feedingPlay');
  const frames = [...document.querySelectorAll('.growth-frame')], buttons = [...document.querySelectorAll('[data-growth]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const names = ['婴儿时期', '童年时光', '少女时代', '长大后的自己'];
  const captions = ['小小的手，抱住第一份温柔', '放学回家，一杯熟悉的味道', '慢慢长大，收藏自己的小日常', '成为自己，温柔依然相伴'];
  let progress = 0, playing = !reduced.matches, visible = false, frame = 0, previous = null;
  function paint(value) {
    progress = Math.max(0, Math.min(100, value));
    const index = Math.min(3, Math.floor(progress / 25));
    frames.forEach((el, i) => { el.classList.toggle('active', i === index); el.setAttribute('aria-hidden', String(i !== index)); });
    buttons.forEach((el, i) => el.setAttribute('aria-pressed', String(i === index)));
    document.querySelector('#growthCaption').textContent = '0' + (index + 1) + ' / ' + names[index];
    document.querySelector('#feedingLabel').textContent = captions[index];
    document.querySelector('#feedingPercent').value = Math.round(progress) + '%';
    slider.value = Math.round(progress);
  }
  function tick(time) {
    if (previous !== null) paint((progress + (time - previous) / 240) % 100);
    previous = time; frame = requestAnimationFrame(tick);
  }
  function schedule() {
    cancelAnimationFrame(frame); previous = null;
    play.textContent = playing ? '暂停 Ⅱ' : '播放 ▷';
    scene.classList.toggle('growth-playing', playing && visible && !document.hidden);
    if (playing && visible && !document.hidden) frame = requestAnimationFrame(tick);
  }
  function seek(value) { playing = false; paint(value); schedule(); }
  buttons.forEach((button, index) => button.addEventListener('click', () => seek(index * 25)));
  slider.addEventListener('input', () => seek(Number(slider.value)));
  play.addEventListener('click', () => { playing = !playing; schedule(); });
  document.querySelector('#feedingReplay').addEventListener('click', () => { paint(0); playing = true; schedule(); });
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); }, {threshold: .15}).observe(scene);
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', () => { if (reduced.matches) { playing = false; schedule(); } });
  paint(0); schedule();
})();
