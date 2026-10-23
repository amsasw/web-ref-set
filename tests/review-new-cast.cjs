const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const ids=['nahida','klee','ganyu','kokomi','moon'];
(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage();
    await page.goto('http://127.0.0.1:8010/milk_formula_theme.html');
    await page.evaluate(async()=>{await mumuFilm.ready;mumuFilm.pause();});
    const captures=[];
    for(const id of ids){
      for(const t of [3,10,17,24]){
        captures.push(await page.evaluate(({id,t})=>{
          mumuFilm.selectCharacter(id);mumuFilm.render(t);
          return {id,t,data:document.querySelector('#growthFilm').toDataURL()};
        },{id,t}));
      }
    }
    const review=await browser.newPage({viewport:{width:1280,height:1000}});
    await review.setContent('<style>body{margin:0;background:#fff;display:grid;grid-template-columns:repeat(4,1fr);gap:4px}figure{margin:0}img{width:100%;display:block}figcaption{font:12px sans-serif;padding:3px}</style>'+captures.map(c=>'<figure><img src="'+c.data+'"><figcaption>'+c.id+' / '+c.t+'s</figcaption></figure>').join(''));
    await review.screenshot({path:'tmp/new-cast-review.png',fullPage:true});
    for(const id of ids){
      const meta=await page.evaluate(async id=>{
        const el=document.createElement('video');
        el.src='assets/mumu-'+id+'-growing-up.mp4';el.preload='metadata';
        await new Promise((resolve,reject)=>{el.onloadedmetadata=resolve;el.onerror=()=>reject(new Error(id+' video failed'));});
        return {duration:el.duration,width:el.videoWidth,height:el.videoHeight};
      },id);
      assert.equal(meta.width,960);assert.equal(meta.height,540);assert(Math.abs(meta.duration-28)<.1);
    }
    console.log('PASS: 20 stage previews and all five 28-second MP4 files');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
