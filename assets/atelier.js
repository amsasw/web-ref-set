(() => {
  const theme=document.body.dataset.theme;
  const canvas=document.querySelector('#productScene'),ctx=canvas.getContext('2d');
  const slider=document.querySelector('#motionProgress'),play=document.querySelector('#motionPlay');
  const stageButtons=[...document.querySelectorAll('[data-seek]')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const image=new Image();image.src='assets/'+theme+'-hero.png';
  const labels=stageButtons.map(b=>b.querySelector('span').firstChild.textContent);
  let progress=0,playing=!reduced.matches,visible=false,frame=0,previous=null,loaded=false;
  const clamp=x=>Math.max(0,Math.min(1,x));
  function ellipse(x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
  function coffee(p){
    ctx.drawImage(image,60,110,480,480);
    const pouring=clamp(p/8)*(1-clamp((p-28)/8));
    ctx.save();ctx.globalAlpha=pouring;ctx.strokeStyle='#74503a';ctx.lineCap='round';ctx.lineWidth=7;
    ctx.beginPath();ctx.moveTo(237,99);ctx.quadraticCurveTo(290,165,300,263);ctx.stroke();
    ctx.strokeStyle='#c5baa5';ctx.lineWidth=18;ctx.beginPath();ctx.moveTo(148,48);ctx.bezierCurveTo(167,88,218,76,237,99);ctx.stroke();
    ellipse(300,264,14+Math.sin(p)*3,4,'#c89757');ctx.restore();
    const warmth=clamp((p-22)/25)*(1-clamp((p-93)/7));
    ctx.save();ctx.lineWidth=5;ctx.lineCap='round';
    for(let i=0;i<5;i++){
      const drift=((p*.018+i*.2)%1);
      ctx.strokeStyle='rgba(255,250,234,'+warmth*(1-drift)*.7+')';
      const x=248+i*25,y=255-drift*120;
      ctx.beginPath();ctx.moveTo(x,y);ctx.bezierCurveTo(x-20,y-25,x+22,y-40,x+Math.sin(p*.1+i)*12,y-70);ctx.stroke();
    }ctx.restore();
  }
  function perfume(p){
    ctx.drawImage(image,100,110,400,400);
    const amount=clamp(p/12)*(1-clamp((p-72)/28));
    const spread=clamp(p/55);
    for(let i=0;i<100;i++){
      const depth=((i*37)%101)/100;
      const length=depth*(40+spread*180);
      const angle=(((i*17)%97)/96-.5)*.8;
      const x=330+length,y=142+Math.sin(angle)*length-12*spread;
      ellipse(x,y,1+depth*3,1+depth*2,'rgba(245,224,183,'+amount*(1-depth)*.45+')');
    }
    ctx.save();ctx.globalAlpha=amount*.18;
    const mist=ctx.createRadialGradient(365+spread*70,137,3,365+spread*70,137,80);
    mist.addColorStop(0,'#f9e8c7');mist.addColorStop(1,'#f9e8c700');
    ctx.fillStyle=mist;ctx.fillRect(310,50,270,200);ctx.restore();
  }
  function serum(p){
    ctx.drawImage(image,255,80,325,325);
    const pool=ctx.createRadialGradient(190,444,5,190,444,135);pool.addColorStop(0,'#e6f7df');pool.addColorStop(1,'#7aaf8a20');
    ellipse(190,444,138,35,pool);
    ctx.fillStyle='#fbf9ef';ctx.beginPath();ctx.roundRect(145,84,50,85,24);ctx.fill();
    ctx.fillStyle='#d4dec9';ctx.fillRect(139,155,62,25);
    ctx.fillStyle='#ffffff70';ctx.strokeStyle='#9bb99d';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(162,180,16,77,7);ctx.fill();ctx.stroke();
    const fall=clamp((p-25)/35),alpha=1-clamp((p-59)/4);
    ctx.save();ctx.globalAlpha=alpha;
    const y=260+fall*176,r=5+clamp(p/22)*5;
    ctx.fillStyle='#9ac9a1';ctx.beginPath();ctx.moveTo(170,y-r*1.8);ctx.bezierCurveTo(170-r*2,y,170-r,y+r,170,y+r);ctx.bezierCurveTo(170+r,y+r,170+r*2,y,170,y-r*1.8);ctx.fill();
    ellipse(168,y-2,2,4,'#f7fff3');ctx.restore();
    for(let i=0;i<4;i++){
      const phase=clamp((p-58-i*6)/32);
      if(phase<=0||phase>=1)continue;
      ctx.strokeStyle='rgba(90,145,105,'+(1-phase)*.55+')';ctx.lineWidth=2;
      ctx.beginPath();ctx.ellipse(170,441,8+phase*120,3+phase*28,0,0,Math.PI*2);ctx.stroke();
    }
  }
  const painters={coffee,perfume,serum};
  function paint(value){
    progress=Math.max(0,Math.min(100,value));ctx.clearRect(0,0,600,600);
    if(loaded)painters[theme](progress);
    const stage=progress<33?0:progress<72?1:2;
    document.querySelector('#motionLabel').textContent=labels[stage];
    document.querySelector('#motionValue').value=Math.round(progress)+'%';slider.value=Math.round(progress);
    stageButtons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===stage)));
    canvas.dataset.progress=progress.toFixed(2);
  }
  function tick(now){
    if(previous!==null)progress=(progress+(now-previous)/110)%100;
    previous=now;paint(progress);frame=requestAnimationFrame(tick);
  }
  function schedule(){
    cancelAnimationFrame(frame);previous=null;play.textContent=playing?'暂停 Ⅱ':'播放 ▷';
    if(playing&&visible&&!document.hidden&&loaded)frame=requestAnimationFrame(tick);
  }
  function seek(value){playing=false;paint(value);schedule();}
  const ready=image.decode().then(()=>{loaded=true;paint(reduced.matches?65:0);schedule();}).catch(error=>{
    document.querySelector('#motionLabel').textContent='图片加载失败，请刷新重试';playing=false;schedule();throw error;
  });
  slider.addEventListener('input',()=>seek(Number(slider.value)));
  stageButtons.forEach(b=>b.addEventListener('click',()=>seek(Number(b.dataset.seek))));
  play.addEventListener('click',()=>{playing=!playing;schedule();});
  document.querySelector('#motionReplay').addEventListener('click',()=>{paint(0);playing=true;schedule();});
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;schedule();},{threshold:.1}).observe(canvas);
  document.addEventListener('visibilitychange',schedule);
  reduced.addEventListener('change',()=>{if(reduced.matches){playing=false;paint(65);schedule();}});
  let quantity=1,toastTimer;const options=[...document.querySelectorAll('[data-option]')];
  options.forEach(b=>b.addEventListener('click',()=>{
    options.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    document.querySelector('#selectedOption').textContent=b.dataset.option;
  }));
  function updateQuantity(delta){quantity=Math.max(1,Math.min(9,quantity+delta));document.querySelector('#quantity').value=quantity;document.querySelector('#minus').disabled=quantity===1;document.querySelector('#plus').disabled=quantity===9;}
  document.querySelector('#minus').addEventListener('click',()=>updateQuantity(-1));
  document.querySelector('#plus').addEventListener('click',()=>updateQuantity(1));
  document.querySelector('#addWish').addEventListener('click',()=>{
    const toast=document.querySelector('#toast');toast.textContent='已加入心愿单：'+document.querySelector('#selectedOption').textContent+' × '+quantity;
    toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),3000);
  });
  window.atelier={ready,seek};paint(0);schedule();
})();
