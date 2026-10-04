import {mkdtemp, readdir, readFile, writeFile, mkdir, copyFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve, join} from 'node:path';
import assert from 'node:assert/strict';

// Build a disposable public artifact; keep all draft source files untouched.
const root = resolve(import.meta.dirname, '..');
const stage = await mkdtemp(join(tmpdir(), 'techatlas-release-'));
const output = join(stage, 'dist');
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
  ["import {aiLessons as draftAILessons,aiSections} from './ai-curriculum.js';", "const draftAILessons=['ai-map','ai-rules','ai-training','ai-tokens'].map(id=>({id})); const aiSections=[];"],
  ["import {aiSurface,initAI} from './ai-lab.js';", "const aiSurface=()=>'', initAI=()=>{throw Error('Course unavailable');};"],
];
for (const [from,to] of replacements) {
  assert(main.includes(from),'Release transform out of date: '+from);
  main=main.replace(from,to);
}
await writeFile(mainPath,main);
const cardPath=join(output,'assets/card-scene.js');
let card=await readFile(cardPath,'utf8');
card=card.replace("import {programmingPreview} from './programming-lab.js';",'');
card=card.replace("import {aiPreview} from './ai-lab.js';",'');
const start=card.indexOf("  if(lesson.track==='ai')");
const end=card.indexOf("  if (lesson.track === 'python')",start);
assert(start>=0 && end>start,'Card release transform out of date');
card=card.slice(0,start)+card.slice(end);
await writeFile(cardPath,card);
const assets=await readdir(join(output,'assets'));
assert(!assets.some(name=>excluded.test(name)),'Draft files in release');
for (const name of assets.filter(name=>name.endsWith('.js'))) {
  const code=await readFile(join(output,'assets',name),'utf8');
  assert(!/(?:from\s*|import\s*\()\s*['"]\.\/(?:ai|programming)-/.test(code),'Draft import in '+name);
}
console.log(output);
