const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto((process.env.PREVIEW_URL || 'http://127.0.0.1:8011')+'/coffee_theme.html#film');
  const video=page.locator('#coffeeFilm');
  await video.evaluate(async el=>{
   if(el.readyState<1)await new Promise((resolve,reject)=>{el.addEventListener('loadedmetadata',resolve,{once:true});el.addEventListener('error',reject,{once:true});});
  });
  const meta=await video.evaluate(el=>({duration:el.duration,width:el.videoWidth,height:el.videoHeight}));
  assert.equal(meta.width,1280);assert.equal(meta.height,720);assert.equal(meta.duration,20);
  await video.evaluate(el=>{el.muted=true;return el.play();});
  await page.waitForFunction(()=>document.querySelector('#coffeeFilm').currentTime>.2);
  await video.evaluate(el=>el.pause());
  const frozen=await video.evaluate(el=>el.currentTime);
  await page.waitForTimeout(200);assert.equal(await video.evaluate(el=>el.currentTime),frozen);
  for(const time of [3,10,17]){
   await video.evaluate((el,t)=>new Promise(resolve=>{el.addEventListener('seeked',resolve,{once:true});el.currentTime=t;}),time);
   assert(Math.abs(await video.evaluate(el=>el.currentTime)-time)<.1);
  }
  for(const width of [390,768,1440]){
   await page.setViewportSize({width,height:900});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  assert.equal(await page.locator('a[download][href="assets/coffee-ritual.mp4"]').count(),1);
  assert.deepEqual(errors,[]);console.log('PASS: 20s 720p video metadata, playback, pause, seek, responsive widths and download link');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
