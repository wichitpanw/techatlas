import assert from 'node:assert/strict';
import {buildOSI,osiSurface,osiPreview,osiLayers,osiDefinitions} from '../dist/assets/osi-lab.js';
assert.equal(osiDefinitions.length,7);
assert.equal(osiLayers.length,7);
assert(osiDefinitions.every(definition=>definition.length>20));
for(const message of ['Hello','ข้อความไทย','']) {
  const model=buildOSI(message),bytes=new TextEncoder().encode(message).length;
  assert.equal(model.length,15);
  assert.deepEqual(model.slice(0,7).map(s=>s.layer),[7,6,5,4,3,2,1]);
  assert.deepEqual(model.slice(8).map(s=>s.layer),[1,2,3,4,5,6,7]);
  assert.equal(model[3].bytes,bytes+20);
  assert.equal(model[4].bytes,bytes+40);
  assert.equal(model[5].bytes,bytes+58);
  assert.equal(model[9].bytes,bytes+40);
  assert.equal(model[10].bytes,bytes+20);
  assert.equal(model[14].bytes,bytes);
  assert(model.every(s=>s.message===message));
  const bad=buildOSI(message,'fcs');assert.equal(bad.at(-1).layer,2);assert(bad.at(-1).dropped);
  assert.equal(bad.at(-1).bytes,bytes+58);
}
assert(osiSurface().includes('maxlength="80"'));
assert(osiPreview().includes('Sender'));
console.log('PASS: OSI 15 stages, UTF-8 sizes, symmetric encapsulation, L2 drop and preview');
