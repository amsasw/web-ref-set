const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try {
    const page=await browser.newPage();
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:8010/milk_formula_theme.html');
    await page.evaluate(async()=>{await mumuFilm.ready;mumuFilm.pause();});
    for(const id of ['original','princess','furina','nahida','klee','ganyu','kokomi','moon']){
      await page.locator('[data-character="'+id+'"]').click();
      assert.equal(await page.locator('#growthFilm').getAttribute('data-character'),id);
      for(let i=0;i<4;i++){
        await page.locator('[data-growth="'+i+'"]').click();
        assert.equal(await page.locator('#growthFilm').getAttribute('data-stage'),String(i));
      }
    }
    assert((await page.locator('.film-download').getAttribute('href')).includes('moon'));
    for(const width of [390,768,1440]){
      await page.setViewportSize({width,height:900});
      for(let i=0;i<4;i++){
        await page.locator('[data-growth="'+i+'"]').click();
        assert.equal(await page.locator('#growthFilm').getAttribute('data-stage'),String(i));
      }
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    }
    const hashes=await page.evaluate(()=>{
      return [0,.2,7.6,8.5,15,24].map(t=>{mumuFilm.render(t);return document.querySelector('canvas').toDataURL();});
    });
    assert.equal(new Set(hashes).size,6,'Walking and growth frames must differ');
    await page.locator('#feedingReplay').click();
    await page.waitForTimeout(400);
    assert(Number(await page.locator('#feedingProgress').inputValue())>0);
    await page.locator('#feedingPlay').click();
    const frozen=await page.locator('#feedingProgress').inputValue();
    await page.waitForTimeout(300);
    assert.equal(await page.locator('#feedingProgress').inputValue(),frozen);
    await page.emulateMedia({reducedMotion:'reduce'});await page.reload();
    await page.evaluate(()=>mumuFilm.ready);
    await page.waitForTimeout(300);
    assert.equal(await page.locator('#feedingProgress').inputValue(),'0');
    const video=await page.evaluate(async()=>{
      const el=document.createElement('video');el.src=document.querySelector('.film-download').href;el.preload='metadata';
      await new Promise((resolve,reject)=>{el.onloadedmetadata=resolve;el.onerror=reject;});
      return {duration:el.duration,width:el.videoWidth,height:el.videoHeight};
    });
    assert.equal(video.width,960);assert.equal(video.height,540);assert(Math.abs(video.duration-28)<.1);
    assert.deepEqual(errors,[]);
    console.log('PASS: 4 growth stages; changing walk frames; 3 responsive widths; replay/pause; reduced motion; 28-second MP4 metadata; no JS errors');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
