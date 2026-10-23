(() => {
  const canvas = document.querySelector('#growthFilm');
  const ctx = canvas.getContext('2d');
  const slider = document.querySelector('#feedingProgress');
  const play = document.querySelector('#feedingPlay');
  const scene = document.querySelector('#feedingScene');
  const buttons = [...document.querySelectorAll('[data-growth]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const duration = 28;
  const names = ['幼儿 · 蹒跚起步', '儿童 · 向世界出发', '少女 · 走向自己的梦想', '成年 · 成为喜欢的自己'];
  const sizes = [170, 224, 282, 328];
  // Measured opaque bounds in the generated 1254 × 1254 sheet.
  // Every frame is anchored at its feet, independent of source-cell spacing.
  const frames = [
    [[127,8,146,252],[427,8,131,252],[721,8,145,252],[1014,8,135,252]],
    [[106,266,171,277],[411,271,136,272],[702,265,169,278],[1011,268,136,275]],
    [[84,548,212,302],[393,547,147,303],[687,549,210,302],[994,548,164,302]],
    [[98,851,218,375],[399,853,153,372],[698,852,224,374],[995,852,171,374]]
  ];
  const characters = {
    furina: {name:'芙宁娜',src:'assets/mumu-furina-sheet.png',video:'assets/mumu-furina-growing-up.mp4',frames:[
      [[155,2,180,277],[432,6,186,271],[717,3,184,276],[1015,4,184,275]],
      [[141,280,188,296],[424,280,186,296],[713,281,194,295],[1011,281,186,295]],
      [[131,577,211,323],[427,576,182,324],[711,577,216,323],[1016,578,177,322]],
      [[86,900,275,354],[387,900,233,352],[675,900,266,351],[988,901,212,352]]
    ]},
    original: {name:'棕发女孩',src:'assets/mumu-walk-sheet.png',video:'assets/mumu-growing-up.mp4',frames},
    princess: {name:'金发公主',src:'assets/mumu-princess-sheet.png',video:'assets/mumu-princess-growing-up.mp4',frames:[
      [[130,15,174,242],[396,14,180,243],[687,14,175,243],[971,7,181,250]],
      [[106,267,183,275],[394,267,179,276],[682,266,176,275],[979,266,180,275]],
      [[104,544,207,294],[381,543,212,295],[677,542,210,296],[965,542,204,296]],
      [[76,841,250,389],[371,842,236,387],[649,842,261,387],[953,845,245,384]]
    ]}
  };
  Object.assign(characters, {"nahida": {"name": "纳西妲", "src": "assets/mumu-nahida-sheet.png", "video": "assets/mumu-nahida-growing-up.mp4", "frames": [[[80, 9, 171, 233], [376, 7, 193, 236], [699, 7, 190, 235], [1012, 7, 194, 235]], [[85, 245, 167, 285], [389, 245, 169, 285], [699, 248, 193, 281], [997, 245, 192, 285]], [[42, 530, 249, 340], [369, 530, 207, 340], [671, 530, 246, 340], [990, 530, 215, 340]], [[21, 870, 276, 375], [365, 870, 219, 375], [652, 870, 288, 371], [991, 870, 219, 375]]]}, "klee": {"name": "可莉", "src": "assets/mumu-klee-sheet.png", "video": "assets/mumu-klee-growing-up.mp4", "frames": [[[146, 2, 170, 241], [432, 2, 159, 241], [725, 2, 171, 241], [1020, 2, 159, 240]], [[144, 244, 184, 286], [430, 244, 163, 285], [733, 244, 182, 286], [1021, 243, 159, 285]], [[132, 530, 205, 345], [419, 530, 189, 345], [728, 530, 208, 345], [1015, 530, 166, 345]], [[99, 875, 249, 379], [406, 875, 204, 375], [710, 875, 227, 374], [1000, 875, 200, 372]]]}, "ganyu": {"name": "甘雨", "src": "assets/mumu-ganyu-sheet.png", "video": "assets/mumu-ganyu-growing-up.mp4", "frames": [[[121, 2, 171, 248], [419, 4, 169, 244], [721, 5, 164, 246], [1038, 7, 165, 244]], [[96, 258, 186, 288], [409, 257, 163, 289], [707, 259, 178, 287], [1031, 259, 160, 287]], [[92, 548, 209, 332], [395, 548, 169, 332], [705, 548, 203, 332], [1019, 548, 171, 332]], [[57, 880, 250, 365], [364, 880, 210, 365], [667, 880, 253, 364], [985, 880, 213, 365]]]}, "kokomi": {"name": "珊瑚宫心海", "src": "assets/mumu-kokomi-sheet.png", "video": "assets/mumu-kokomi-growing-up.mp4", "frames": [[[89, 8, 213, 235], [369, 7, 210, 236], [682, 6, 205, 237], [969, 5, 206, 238]], [[92, 251, 210, 276], [380, 250, 200, 276], [677, 249, 223, 279], [979, 250, 194, 277]], [[55, 530, 276, 320], [369, 530, 257, 319], [680, 530, 272, 320], [974, 531, 233, 319]], [[48, 850, 307, 387], [369, 850, 245, 386], [679, 850, 300, 386], [974, 853, 231, 386]]]}, "moon": {"name": "月亮公主", "src": "assets/mumu-moon-sheet.png", "video": "assets/mumu-moon-growing-up.mp4", "frames": [[[107, 10, 188, 244], [409, 10, 182, 244], [709, 10, 180, 244], [1025, 8, 176, 246]], [[102, 261, 160, 270], [403, 261, 155, 271], [710, 261, 173, 271], [1032, 261, 153, 271]], [[80, 536, 222, 334], [374, 536, 199, 334], [677, 536, 236, 334], [1004, 536, 179, 334]], [[23, 870, 302, 374], [352, 870, 261, 374], [641, 870, 304, 375], [976, 870, 254, 375]]]}});
  const requestedCharacter = new URLSearchParams(location.search).get('character');
  let character = Object.hasOwn(characters, requestedCharacter) ? requestedCharacter : 'furina';
  Object.values(characters).forEach(config=>{config.image=new Image();config.image.src=config.src;});
  let time = 0, playing = !reduced.matches, visible = false, previous = null, raf = 0;
  const ease = x => x * x * (3 - 2 * x);
  function ellipse(x,y,rx,ry,color) { ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill(); }
  function tree(x,y,scale) {
    ctx.fillStyle='#c9b695';ctx.fillRect(x-3*scale,y-90*scale,6*scale,90*scale);
    ellipse(x,y-102*scale,36*scale,56*scale,'#cbd4b6');
    ellipse(x-20*scale,y-78*scale,26*scale,35*scale,'#d9dec2');
  }
  function waterStage(t) {
    const sky=ctx.createLinearGradient(0,0,0,540);
    sky.addColorStop(0,'#dae8fa');sky.addColorStop(.7,'#edf6ff');sky.addColorStop(1,'#b8d4e8');
    ctx.fillStyle=sky;ctx.fillRect(0,0,960,540);
    for(let i=-1;i<7;i++){
      const x=i*210-(t*18)%210;
      ctx.strokeStyle='#aec8e0';ctx.lineWidth=9;
      ctx.beginPath();ctx.moveTo(x,405);ctx.lineTo(x,205);ctx.bezierCurveTo(x,105,x+150,105,x+150,205);ctx.lineTo(x+150,405);ctx.stroke();
      ctx.fillStyle='#cfdeee';ctx.fillRect(x-10,387,29,18);ctx.fillRect(x+137,387,29,18);
    }
    for(const origin of [100,820]){
      const sweep=Math.sin(t*.3+origin)*70;
      const light=ctx.createLinearGradient(origin,0,origin+sweep,430);
      light.addColorStop(0,'#ffffff10');light.addColorStop(1,'#ffffff66');
      ctx.fillStyle=light;ctx.beginPath();ctx.moveTo(origin,0);ctx.lineTo(origin+sweep+135,430);ctx.lineTo(origin+sweep-135,430);ctx.closePath();ctx.fill();
    }
    ctx.fillStyle='#9bb8d1';ctx.fillRect(0,409,960,6);
    ctx.fillStyle='#dae8f3';ctx.fillRect(0,415,960,125);
    ctx.strokeStyle='#b9cfdf';ctx.lineWidth=1;
    for(let i=-2;i<15;i++){const x=i*100-(t*75)%100;ctx.beginPath();ctx.moveTo(x,415);ctx.lineTo(x-90,540);ctx.stroke();}
    for(const y of [443,483,535]){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(960,y);ctx.stroke();}
    for(let i=0;i<18;i++){
      const x=(i*137+t*11)%1040-40;
      const y=410-((i*67+t*(12+i%4))%370);
      const radius=5+i%5*3;
      ctx.strokeStyle='#80b3db66';ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.stroke();
      ellipse(x-radius*.3,y-radius*.35,2,3,'#ffffffc0');
    }
  }
  const themes = {
    nahida: {sky:'#e5f0d6',floor:'#cbd7ac',hill:'#a9c39b',ink:'#496748'},
    klee: {sky:'#fff0d8',floor:'#e5caa2',hill:'#c4d49d',ink:'#905b43'},
    ganyu: {sky:'#dceafa',floor:'#f5faff',hill:'#b9cce3',ink:'#4b6589'},
    kokomi: {sky:'#d8e4fa',floor:'#c9cee9',hill:'#afbddf',ink:'#655c91'},
    moon: {sky:'#242a50',floor:'#4a5075',hill:'#393e66',ink:'#f0e6ff'}
  };
  function characterLandscape(t,theme) {
    const gradient=ctx.createLinearGradient(0,0,0,540);
    gradient.addColorStop(0,theme.sky);gradient.addColorStop(1,theme.floor);
    ctx.fillStyle=gradient;ctx.fillRect(0,0,960,540);
    if(character==='moon'){
      ellipse(789,103,43,43,'#f7e7b5');ellipse(805,91,40,40,theme.sky);
    } else if(character==='ganyu'){
      for(let i=-1;i<7;i++){
        const x=i*220-(t*9)%220;
        ctx.fillStyle=theme.hill;ctx.beginPath();ctx.moveTo(x-120,410);ctx.lineTo(x+70,176);ctx.lineTo(x+240,410);ctx.fill();
        ctx.fillStyle='#f7fbff';ctx.beginPath();ctx.moveTo(x+70,176);ctx.lineTo(x+22,235);ctx.lineTo(x+68,223);ctx.lineTo(x+112,234);ctx.fill();
      }
    } else {
      for(let i=-1;i<7;i++)ellipse(i*210-(t*12)%210,380,170,85,theme.hill);
    }
    if(character==='nahida'||character==='klee'){
      for(let i=-1;i<8;i++)tree(i*180-(t*25)%180,410,character==='nahida'?1.5:.8);
    }
    if(character==='kokomi'){
      for(let i=0;i<6;i++){
        const x=(i*193-t*10+1100)%1100-60,y=170+i%3*58+Math.sin(t+i)*14;
        ctx.fillStyle='#ede1ff9c';ctx.beginPath();ctx.ellipse(x,y,24,17,0,Math.PI,0);ctx.closePath();ctx.fill();
        ctx.strokeStyle='#eee4ffb0';ctx.lineWidth=2;
        for(let j=-2;j<=2;j++){ctx.beginPath();ctx.moveTo(x+j*8,y);ctx.bezierCurveTo(x+j*8+12,y+18,x+j*8-12,y+30,x+j*8+Math.sin(t+j)*9,y+46);ctx.stroke();}
      }
    }
    ctx.fillStyle=theme.floor;ctx.fillRect(0,415,960,125);
    ctx.fillStyle=character==='moon'?'#8388ad':'#ffffff77';
    for(let i=-1;i<19;i++)ctx.fillRect(i*65-(t*75)%65,460+(i%3)*13,23,2);
    for(let i=0;i<42;i++){
      const x=(i*113+t*(character==='ganyu'?9:4))%960;
      const y=character==='ganyu'?(i*73+t*22)%410:70+(i*59)%320+Math.sin(t+i)*8;
      const color=character==='nahida'?'#f3ffc6':character==='klee'?'#fff3c5':character==='kokomi'?'#f6ebff':'#fffaff';
      ctx.save();ctx.globalAlpha=.35+(Math.sin(t*1.5+i)+1)*.25;
      ellipse(x,y,character==='moon'?1.4:2,character==='ganyu'?2:2.5,color);ctx.restore();
    }
    if(character==='klee'){
      for(let i=-1;i<15;i++){
        const x=i*90-(t*100)%90;
        ellipse(x,510,4,4,'#fff6dd');ellipse(x+5,514,4,4,'#fff6dd');ellipse(x-4,515,4,4,'#fff6dd');ellipse(x,514,2,2,'#d5a467');
      }
    }
  }
  function background(t) {
    if(themes[character]){characterLandscape(t,themes[character]);return;}
    if(character==='furina'){waterStage(t);return;}
    const sky=ctx.createLinearGradient(0,0,0,540);sky.addColorStop(0,'#f8eddb');sky.addColorStop(1,'#fffaf0');
    ctx.fillStyle=sky;ctx.fillRect(0,0,960,540);
    ellipse(777,105,49,49,'#efd6ad');
    for(let i=-1;i<6;i++) {
      const x=i*250-(t*8)%250;
      ellipse(x,351,240,107,'#e1e5cd');
      ellipse(x+100,389,175,93,'#d4ddc0');
    }
    for(let i=-1;i<8;i++) tree(i*190-(t*27)%190,388,.65+(i%2)*.2);
    ctx.fillStyle='#e7d9c0';ctx.fillRect(0,409,960,131);
    ctx.fillStyle='#f3e6d0';ctx.fillRect(0,420,960,68);
    for(let i=-1;i<18;i++){
      const x=i*74-(t*83)%74;
      ctx.fillStyle='#d5c4a8';ctx.fillRect(x,463+(i%3)*6,27,2);
      const fx=i*79-(t*110)%79;
      ctx.strokeStyle='#99aa83';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(fx,530);ctx.lineTo(fx+3,514);ctx.stroke();
      ellipse(fx+3,513,4,4,i%2?'#ecd3b3':'#fff7df');
    }
  }
  function actor(stage,frame,x,height,alpha,t) {
    if(alpha<=0)return;
    const config=characters[character];
    const [sx,sy,sw,sh]=config.frames[stage][frame];
    const w=height*sw/sh;
    ctx.save();ctx.globalAlpha=alpha;
    const bounce=Math.sin(t*Math.PI*4)*1.5;
    ctx.drawImage(config.image,sx,sy,sw,sh,x-w/2,423-height+bounce,w,height);
    ctx.restore();
  }
  function render(seconds) {
    time=Math.max(0,Math.min(duration,seconds));
    background(time);
    const stage=Math.min(3,Math.floor(time/7));
    const local=time-stage*7;
    const blend=stage>0?ease(Math.min(1,local/1.2)):1;
    const previousStage=Math.max(0,stage-1);
    const height=sizes[previousStage]+(sizes[stage]-sizes[previousStage])*blend;
    const x=280+time/duration*350;
    const frame=Math.floor(time*7)%4;
    ellipse(x,427,height*.22,7,'#b4a58c55');
    if(stage>0&&blend<1)actor(previousStage,frame,x,height,1-blend,time);
    actor(stage,frame,x,height,blend,time);
    if(stage>0&&blend<1) {
      ctx.save();ctx.globalAlpha=Math.sin(blend*Math.PI)*.65;
      for(let i=0;i<16;i++){const angle=i*2.399+time;const radius=30+i*4;ellipse(x+Math.cos(angle)*radius,410-height*.5+Math.sin(angle)*radius,2,3,'#fffdf1');}
      ctx.restore();
    }
    const aquatic=character==='furina';
    const ink=themes[character]?.ink;
    ctx.fillStyle=ink||(aquatic?'#526c91':'#87755f');ctx.font='12px sans-serif';ctx.letterSpacing='3px';ctx.fillText(aquatic?'FURINA  /  A LITTLE ENCORE':character.toUpperCase()+'  /  GROWING WITH YOU',38,37);
    ctx.letterSpacing='0px';ctx.font='26px sans-serif';ctx.fillStyle=ink||(aquatic?'#345881':'#5e6d53');ctx.fillText(names[stage],38,82);
    ctx.font='13px sans-serif';ctx.fillStyle=ink||(aquatic?'#637f9e':'#95836c');ctx.fillText(aquatic?'每一步，都是新的登场。':'每一步，都是新的自己。',38,108);
    const index=Math.min(3,Math.floor(time/7));
    buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));
    document.querySelector('#growthCaption').textContent=characters[character].name+' / '+names[index];
    canvas.dataset.character=character;
    canvas.setAttribute('aria-label',characters[character].name+'步行成长动画');
    document.querySelectorAll('[data-character]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.character===character)));
    document.querySelector('.film-download').href=characters[character].video;
    document.querySelector('#feedingLabel').textContent='向前走，慢慢长大';
    document.querySelector('#feedingPercent').value=time.toFixed(1)+' / 28s';
    slider.value=time/duration*100;
    canvas.dataset.stage=String(index);canvas.dataset.frame=String(frame);
  }
  function tick(now) {
    if(previous!==null)time+=(now-previous)/1000;
    previous=now;
    if(time>=duration){time=duration;playing=false;render(time);schedule();return;}
    render(time);raf=requestAnimationFrame(tick);
  }
  function schedule() {
    cancelAnimationFrame(raf);previous=null;
    play.textContent=playing?'暂停 Ⅱ':'播放 ▷';
    if(playing&&visible&&!document.hidden)raf=requestAnimationFrame(tick);
  }
  const ready=Promise.all(Object.values(characters).map(config=>config.image.decode())).then(()=>{render(0);schedule();}).catch(error=>{
    document.querySelector('#feedingLabel').textContent='角色图片加载失败，请刷新重试';
    playing=false;schedule();throw error;
  });
  function selectCharacter(id) {
    if(!Object.hasOwn(characters,id))throw new Error('Unknown character: '+id);
    character=id;render(time);
  }
  window.mumuFilm={ready,render,duration,selectCharacter,pause(){playing=false;schedule();}};
  document.querySelectorAll('[data-character]').forEach(b=>b.addEventListener('click',()=>ready.then(()=>selectCharacter(b.dataset.character))));
  buttons.forEach((b,i)=>b.addEventListener('click',()=>{playing=false;render(i*7+1.2);schedule();}));
  slider.addEventListener('input',()=>{playing=false;render(Number(slider.value)/100*duration);schedule();});
  play.addEventListener('click',()=>{if(time>=duration)render(0);playing=!playing;ready.then(schedule);});
  document.querySelector('#feedingReplay').addEventListener('click',()=>{render(0);playing=true;ready.then(schedule);});
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;ready.then(schedule);},{threshold:.15}).observe(scene);
  document.addEventListener('visibilitychange',schedule);
  reduced.addEventListener('change',()=>{if(reduced.matches){playing=false;schedule();}});
})();
