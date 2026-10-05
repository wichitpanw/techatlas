import {mkdtemp, readdir, readFile, writeFile, mkdir, copyFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve, join} from 'node:path';
import assert from 'node:assert/strict';

// Build a disposable public artifact; keep all draft source files untouched.
const root = resolve(import.meta.dirname, '..');
const stage = await mkdtemp(join(tmpdir(), 'techatlas-release-'));
const output = join(stage, 'dist');
const publishAI = process.argv.includes('--publish-ai');
const excluded = /^(ai|programming)-.*\.js$/;
async function copyTree(source, destination) {
  await mkdir(destination, {recursive:true});
  for (const entry of await readdir(source, {withFileTypes:true})) {
    if (excluded.test(entry.name)) continue;
    const from=join(source,entry.name), to=join(destination,entry.name);
    if (entry.isDirectory()) await copyTree(from,to);
    else await copyFile(from,to);
  }
}
await copyTree(join(root,'dist'),output);
const mainPath=join(output,'assets/main.js');
let main=await readFile(mainPath,'utf8');
const replacements = [
  ["import {programmingLessons as withdrawnProgrammingLessons, programmingSections} from './programming-curriculum.js';", "const withdrawnProgrammingLessons = ['web-overview','web-html','web-css','web-javascript','js-variables','js-conditions'].map(id=>({id})); const programmingSections=[];"],
  ["import {programmingSurface, initProgramming} from './programming-lab.js';", "const programmingSurface=()=>'', initProgramming=()=>{throw Error('Course unavailable');};"],
];
for (const [from,to] of replacements) {
  assert(main.includes(from),'Release transform out of date: '+from);
  main=main.replace(from,to);
}
await writeFile(mainPath,main);
if (publishAI) {
  const tile=/<article class="subject-tile planned-subject"><span class="subject-code">04 \/ ARTIFICIAL INTELLIGENCE<\/span>[\s\S]*?<\/article>/;
  assert(tile.test(main),'AI entry transform out of date');
  main=main.replace(tile,'<a class="subject-tile planned-subject" href="prototypes/ai-foundations.html"><span class="subject-code">04 / ARTIFICIAL INTELLIGENCE</span><h2>ปัญญาประดิษฐ์</h2><p>ข้อมูล → Neural Network → ฝึกและตรวจโมเดล</p><span>10 บททดลอง · 3D Interactive · เปิดเรียน ↗</span></a>');
  await writeFile(mainPath,main);
  await mkdir(join(output,'prototypes'),{recursive:true});
  for (const name of ['ai-foundations.html','ai-neural.html','ai-training.html','ai-neural.css']) {
    let content=await readFile(join(root,'prototypes',name),'utf8');
    content=content.replaceAll('../dist/','../').replaceAll('AI / LOCAL PROTOTYPE · ยังไม่เผยแพร่','AI / VISUAL LAB · รุ่นทดลอง').replaceAll('01 Neuron','03 Neuron').replaceAll('02 Forward Pass','05 Forward Pass').replaceAll('03 Gradient Descent','07 Gradient Descent').replaceAll('04 Backpropagation','08 Backpropagation').replaceAll('ต้นแบบไม่บันทึกความคืบหน้า Production','รุ่นทดลอง · ยังไม่บันทึกความคืบหน้า').replaceAll('ต้นแบบไม่บันทึกความคืบหน้าบนเว็บจริง','รุ่นทดลอง · ยังไม่บันทึกความคืบหน้า').replaceAll('ต้นแบบในเครื่อง ไม่บันทึกความคืบหน้าเว็บจริง','รุ่นทดลอง · ยังไม่บันทึกความคืบหน้า');
    await writeFile(join(output,'prototypes',name),content);
  }
  for (const name of await readdir(join(root,'dist/assets'))) {
    if (/^ai-(foundation|neural|training)-(lab|model|scene)\.js$/.test(name)) await copyFile(join(root,'dist/assets',name),join(output,'assets',name));
  }
}
const cardPath=join(output,'assets/card-scene.js');
let card=await readFile(cardPath,'utf8');
card=card.replace("import {programmingPreview} from './programming-lab.js';",'');
const start=card.indexOf("  if(lesson.track==='programming')");
const end=card.indexOf("  if (lesson.track === 'python')",start);
assert(start>=0 && end>start,'Card release transform out of date');
card=card.slice(0,start)+card.slice(end);
await writeFile(cardPath,card);
const assets=await readdir(join(output,'assets'));
const allowedAI=name=>publishAI && /^ai-(foundation|neural|training)-(lab|model|scene)\.js$/.test(name);
assert(!assets.some(name=>excluded.test(name)&&!allowedAI(name)),'Draft files in release');
for (const name of assets.filter(name=>name.endsWith('.js'))) {
  const code=await readFile(join(output,'assets',name),'utf8');
  if (!allowedAI(name)) assert(!/(?:from\s*|import\s*\()\s*['"]\.\/(?:ai|programming)-/.test(code),'Draft import in '+name);
}
console.log(output);
