import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {pythonNextLessons} from '../dist/assets/python-next.js';
import {pythonLessons} from '../dist/assets/python-curriculum.js';
import {visualFor} from '../dist/assets/python-visuals.js';
import {termsForLesson} from '../dist/assets/lesson-terms.js';
for(const lesson of pythonNextLessons){
 assert(lesson.task.goal && lesson.task.actions.length>=2);
 assert(visualFor(lesson)?.mode);
 assert(termsForLesson(lesson).length,'missing glossary '+lesson.id);
 const result=spawnSync('python3',['-c',lesson.solution+'\n'+lesson.tests[0].append],{encoding:'utf8',timeout:10000});
 assert.equal(result.status,0,lesson.id+result.stderr);
 assert.equal(result.stdout.trim(),lesson.expected.trim(),lesson.id);
 const starter=spawnSync('python3',['-c',lesson.starter+'\n'+lesson.tests[0].append],{encoding:'utf8',timeout:10000});
 assert(starter.status!==0 || starter.stdout.trim()!==lesson.expected.trim(),'starter passes '+lesson.id);
 console.log('PASS '+lesson.id);
}
assert.equal(pythonLessons.length,48);
console.log('PASS 13 new lessons only: real CPython solutions, tests, nonpassing starters, visuals, glossary; existing labs not rerun');
