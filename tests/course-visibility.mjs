import assert from 'node:assert/strict';
import {courseIsVisible} from '../dist/assets/course-visibility.js';
import {pythonLessons} from '../dist/assets/python-curriculum.js';
import {pythonVisuals} from '../dist/assets/python-visuals.js';
import {networkLearningGuide} from '../dist/assets/network-learning-guide.js';
import {arrangeNetwork} from '../dist/assets/network-foundations.js';
import {networkLessons} from '../dist/assets/network-curriculum.js';
for (const hostname of ['localhost','127.0.0.1','[::1]','techatlas-aoh.pages.dev','preview.pages.dev']) {
  assert.equal(courseIsVisible('programming',hostname),false);
  assert.equal(courseIsVisible('network',hostname),true);
  assert.equal(courseIsVisible('python',hostname),true);
  assert.equal(courseIsVisible('ai',hostname),false);
}
assert.equal(courseIsVisible('unknown','localhost'),false);
for (const id of ['number-conversion','for-else','function-arguments','recursion']) {
  const l=pythonLessons.find(l=>l.id===id);
  assert(l?.task?.actions.length>=2 && pythonVisuals[id]);
  assert.notEqual(l.starter,l.solution);
}
const network=arrangeNetwork(networkLessons);
for (const [id,guide] of Object.entries(networkLearningGuide)) {
  assert(network.some(l=>l.id===id),id);
  assert.equal(guide.length,2);
}
console.log('PASS: course visibility, 4 new Python missions/visuals, 16 Network observation guides');
