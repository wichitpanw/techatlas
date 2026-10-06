import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {aiLessons,aiSections,aiCardPreview} from '../dist/assets/ai-course.js';
assert.equal(aiLessons.length,10);assert.equal(new Set(aiLessons.map(l=>l.id)).size,10);
assert.equal(aiSections.length,2);
for(const l of aiLessons){assert(aiSections.some(s=>s.id===l.section));const url=new URL(l.href);assert(url.hash);const html=await readFile(url,'utf8').catch(()=>null); // file URL includes hash, ignored by readFile
assert(html?.includes('ai-catalog-back'));assert(aiCardPreview(l).includes('<svg'));}
assert.deepEqual(aiLessons.map(l=>new URL(l.href).hash),['#data','#vector','#neuron','#activation','#forward','#loss','#gradient','#backprop','#batch','#fit']);
console.log('PASS: 10 current AI cards, unique IDs, sections, lesson targets and back links (no lesson replay)');
