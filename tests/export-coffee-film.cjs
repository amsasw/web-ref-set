const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const {once}=require('node:events');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('http://127.0.0.1:8010/coffee_theme.html');
  await page.evaluate(async()=>{
   await atelier.ready;atelier.seek(0);await document.fonts.ready;
   const film=document.createElement('canvas');film.width=1280;film.height=720;
   const c=film.getContext('2d'),source=document.querySelector('#productScene');
   window.renderCoffeeFilm=t=>{
    const p=t<7?t/7*33:t<14?33+(t-7)/7*37:70+(t-14)/6*24;
    atelier.seek(p);
    const bg=c.createLinearGradient(0,0,1280,720);bg.addColorStop(0,'#f7efdf');bg.addColorStop(1,'#ddc5a0');
    c.fillStyle=bg;c.fillRect(0,0,1280,720);
    c.save();c.translate(920,330);c.rotate(-.3);
    c.fillStyle='#fff7e833';c.fillRect(-100,-600,75,1200);c.fillRect(80,-600,140,1200);c.restore();
    c.fillStyle='#775a43';c.font='15px Georgia';c.letterSpacing='5px';c.fillText('SLOW / COFFEE RITUAL',72,94);c.letterSpacing='0px';
    c.fillStyle='#493329';c.font='58px "Microsoft YaHei", sans-serif';c.fillText('把早晨，',72,245);c.fillText('慢慢唤醒。',72,325);
    const index=t<7?0:t<14?1:2;
    const titles=['01 / 轻轻注入','02 / 香气升腾','03 / 慢享此刻'];
    const descriptions=['一束咖啡，落进晨间的杯子。','让温热的香气，慢慢升起来。','给自己，留一杯咖啡的时间。'];
    c.font='21px "Microsoft YaHei", sans-serif';c.fillStyle='#86593c';c.fillText(titles[index],74,425);
    c.font='16px "Microsoft YaHei", sans-serif';c.fillStyle='#887360';c.fillText(descriptions[index],74,465);
    c.save();
    const zoom=1+t/20*.025;c.translate(900,380);c.scale(zoom,zoom);c.drawImage(source,-320,-350,640,640);c.restore();
    c.strokeStyle='#977a4b33';c.lineWidth=1;c.beginPath();c.moveTo(72,620);c.lineTo(1208,620);c.stroke();
    c.strokeStyle='#8c603c';c.lineWidth=2;c.beginPath();c.moveTo(72,620);c.lineTo(72+1136*t/20,620);c.stroke();
    c.font='italic 18px Georgia';c.fillStyle='#81684e';c.fillText('Good things take a little time.',72,660);
    c.font='12px sans-serif';c.fillText('SLOW CONCEPT STUDIO  /  20 SEC',964,660);
    const fade=Math.min(1,t/.7,(20-t)/.7);
    if(fade<1){c.fillStyle='rgba(247,239,223,'+(1-fade)+')';c.fillRect(0,0,1280,720);}
    return film.toDataURL('image/png').split(',')[1];
   };
  });
  const encoder=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate','30','-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','19','-pix_fmt','yuv420p','-movflags','+faststart',path.resolve(__dirname,'../assets/coffee-ritual.mp4')],{stdio:['pipe','inherit','inherit'],windowsHide:true});
  const completed=once(encoder,'close');
  for(let i=0;i<600;i++){
   const data=await page.evaluate(t=>renderCoffeeFilm(t),i/30);
   if(!encoder.stdin.write(Buffer.from(data,'base64')))await once(encoder.stdin,'drain');
  }
  encoder.stdin.end();const [code]=await completed;if(code!==0)throw new Error('FFmpeg exit '+code);
  console.log('Exported assets/coffee-ritual.mp4: 20 seconds, 1280x720, 30 fps, H.264');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
