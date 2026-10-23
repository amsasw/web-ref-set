(() => {
  const scene = document.querySelector('#feedingScene');
  const slider = document.querySelector('#feedingProgress');
  const play = document.querySelector('#feedingPlay');
  const baby = document.querySelector('#feedingBaby');
  const bottle = document.querySelector('#feedingBottle');
  const mouth = document.querySelector('#feedingMouthAnchor');
  const heart = document.querySelector('#feedingHeart');
  const label = document.querySelector('#feedingLabel');
  const output = document.querySelector('#feedingPercent');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = n => Math.max(0, Math.min(1, n));
  let progress = 0, elapsed = 0, previous = null, frame = 0;
  let playing = !reduced.matches, visible = false;

  function paint(value) {
    progress = Math.max(0, Math.min(100, value));
    const approach = 1 - clamp(progress / 20);
    const leave = clamp((progress - 82) / 18);
    const contact = progress >= 20 && progress <= 82;
    const breathe = Math.sin(progress * .24) * 1.4;
    baby.setAttribute('transform', `translate(0 ${breathe})`);
    // Both assets use measured source-image anchors, not their bounding boxes.
    // Keep the nipple at the lip while the entire baby group gently breathes.
    const mouthX = mouth.cx.baseVal.value;
    const mouthY = mouth.cy.baseVal.value;
    bottle.setAttribute('transform', `translate(${mouthX + approach * 48 + leave * 50} ${mouthY - approach * 16 - leave * 28}) rotate(${-18 + approach * 13 + leave * 10 + (contact ? Math.sin(progress * .22) * 1 : 0)})`);
    heart.setAttribute('opacity', .2 + clamp((progress - 30) / 50) * .55);
    heart.setAttribute('transform', `translate(0 ${-clamp(progress / 100) * 8})`);
    slider.value = Math.round(progress);
    output.value = `${Math.round(progress)}%`;
    label.textContent = progress < 20 ? '奶瓶轻轻靠近' : progress < 82 ? '小口慢慢喝，温柔陪伴' : '喝完啦，再抱抱';
  }

  function tick(time) {
    if (previous !== null) elapsed = (elapsed + time - previous) % 16000;
    previous = time;
    paint(Math.min(100, elapsed / 140));
    frame = requestAnimationFrame(tick);
  }
  function schedule() {
    cancelAnimationFrame(frame);
    previous = null;
    play.textContent = playing ? '暂停 Ⅱ' : '播放 ▷';
    if (playing && visible && !document.hidden) frame = requestAnimationFrame(tick);
  }
  slider.addEventListener('input', () => {
    playing = false;
    elapsed = Number(slider.value) * 140;
    paint(Number(slider.value));
    schedule();
  });
  play.addEventListener('click', () => {
    playing = !playing;
    if (playing && progress >= 100) elapsed = 0;
    schedule();
  });
  document.querySelector('#feedingReplay').addEventListener('click', () => {
    elapsed = 0;
    playing = true;
    paint(0);
    schedule();
  });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    schedule();
  }, { threshold: .2 }).observe(scene);
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      playing = false;
      elapsed = 60 * 140;
      paint(60);
      schedule();
    }
  });
  paint(reduced.matches ? 60 : 0);
  elapsed = progress * 140;
  schedule();
})();
