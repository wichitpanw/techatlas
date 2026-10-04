import assert from 'node:assert/strict';
import {networkLessons} from '../dist/assets/network-curriculum.js';
import {arrangeNetwork} from '../dist/assets/network-foundations.js';
import {pythonLessons} from '../dist/assets/python-curriculum.js';
import {programmingLessons} from '../dist/assets/programming-curriculum.js';
import {aiLessons} from '../dist/assets/ai-curriculum.js';

// Structural duplicate audit only; does not replay previously verified labs.
const groups={network:arrangeNetwork(networkLessons),python:pythonLessons,programming:programmingLessons,ai:aiLessons};
const normalize=value=>String(value||'').replace(/\s+/g,' ').trim();
for(const [track,lessons] of Object.entries(groups)){
  for(const field of ['id','title','explain','starter']){
    const seen=new Map();
    for(const lesson of lessons){
      const value=normalize(lesson[field]);
      if(!value)continue;
      assert(!seen.has(value),`${track}: duplicate ${field}: ${seen.get(value)} / ${lesson.id}`);
      seen.set(value,lesson.id);
    }
  }
  console.log(`PASS ${track}: ${lessons.length} lessons, unique IDs/titles/explanations/starter code`);
}
const ids=Object.values(groups).flat().map(lesson=>lesson.id);
assert.equal(new Set(ids).size,ids.length,'Cross-course lesson ID collision');
console.log('PASS global lesson routes; not a semantic-equivalence or full UI audit');
