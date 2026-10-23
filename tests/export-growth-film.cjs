const {chromium} = require('playwright');
const {spawn} = require('node:child_process');
const {once} = require('node:events');
const path = require('node:path');
const character = process.argv[2] || 'original';
if (!['original','princess','furina','nahida','klee','ganyu','kokomi','moon'].includes(character)) throw new Error('Unknown character');
const filename = character === 'original' ? 'mumu-growing-up.mp4' : 'mumu-'+character+'-growing-up.mp4';
(async () => {
  const browser = await chromium.launch({channel:'msedge',headless:true});
  try {
    const page = await browser.newPage({viewport:{width:1280,height:900}});
    await page.goto('http://127.0.0.1:8010/milk_formula_theme.html');
    await page.evaluate(async id=>{await window.mumuFilm.ready;window.mumuFilm.pause();window.mumuFilm.selectCharacter(id);},character);
    const encoder = spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate','24','-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',path.resolve(__dirname,'../assets',filename)],{stdio:['pipe','inherit','inherit'],windowsHide:true});
    const completed = once(encoder,'close');
    for(let i=0;i<28*24;i++){
      const data = await page.evaluate(t=>{window.mumuFilm.render(t);return document.querySelector('#growthFilm').toDataURL('image/png').split(',')[1];},i/24);
      if(!encoder.stdin.write(Buffer.from(data,'base64')))await once(encoder.stdin,'drain');
    }
    encoder.stdin.end();
    const [code] = await completed;
    if(code!==0)throw new Error('Video encoder failed: '+code);
    console.log('Exported: assets/'+filename+', 960x540, 24 fps, 28 seconds');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
