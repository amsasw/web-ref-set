const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const id of ['coffee','perfume','serum']){
   await page.goto('http://127.0.0.1:8010/'+id+'_theme.html');
   await page.evaluate(()=>atelier.ready);
   await page.locator('.hero-image').evaluate(img=>img.decode());
   const ratio=await page.locator('.hero-image').evaluate(img=>{const style=getComputedStyle(img);return Math.abs(parseFloat(style.width)/parseFloat(style.height)-img.naturalWidth/img.naturalHeight);});
   assert(ratio<.01,'Hero image must retain its natural aspect ratio');
   assert.equal(await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor),{coffee:'rgb(244, 234, 217)',perfume:'rgb(30, 37, 37)',serum:'rgb(238, 242, 231)'}[id]);
   for(const width of [390,768,1440]){
    await page.setViewportSize({width,height:900});
    for(const seek of [12,48,88]){
     await page.locator('[data-seek="'+seek+'"]').click();
     assert.equal(await page.locator('#motionProgress').inputValue(),String(seek));
     assert.equal(await page.locator('[data-seek="'+seek+'"]').getAttribute('aria-pressed'),'true');
    }
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   }
   const frames=await page.evaluate(()=>[12,48,88].map(v=>{atelier.seek(v);return document.querySelector('canvas').toDataURL();}));
   assert.equal(new Set(frames).size,3,'Animation stages must visibly differ');
   await page.locator('#motionReplay').click();await page.waitForTimeout(500);
   assert(Number(await page.locator('#motionProgress').inputValue())>0);
   await page.locator('#motionPlay').click();const paused=await page.locator('#motionProgress').inputValue();
   await page.waitForTimeout(200);assert.equal(await page.locator('#motionProgress').inputValue(),paused);
   await page.locator('[data-option]').last().click();await page.locator('#plus').click();await page.locator('#addWish').click();
   assert((await page.locator('#toast').textContent()).endsWith('× 2'));
   for(let i=0;i<10;i++)await page.locator('#minus').evaluate(b=>b.click());
   assert(await page.locator('#minus').isDisabled());
   await page.emulateMedia({reducedMotion:'reduce'});await page.reload();await page.evaluate(()=>atelier.ready);
   assert.equal(await page.locator('#motionProgress').inputValue(),'65');
   await page.emulateMedia({reducedMotion:'no-preference'});
   await page.setViewportSize({width:1440,height:1000});
   await page.locator('header').scrollIntoViewIfNeeded();
   await page.screenshot({path:'tmp/'+id+'-desktop.png'});
   await page.locator('[data-seek="48"]').click();await page.locator('#sceneCard').screenshot({path:'tmp/'+id+'-motion.png'});
   await page.setViewportSize({width:390,height:844});await page.locator('header').scrollIntoViewIfNeeded();await page.screenshot({path:'tmp/'+id+'-mobile.png'});
  }
  await page.goto('http://127.0.0.1:8010/stylekit_website_gallery.html');
  for(const id of ['coffee','perfume','serum'])assert.equal(await page.locator('.product-theme[href="'+id+'_theme.html"]').count(),1);
  assert.deepEqual(errors,[]);console.log('PASS: 3 themes, 27 stage/viewport checks, image loading, motion/pause/replay, options, quantity, reduced motion, gallery links');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
