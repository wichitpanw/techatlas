import assert from 'node:assert/strict';
import {samples,predict,trainThreshold,trainBigram,distribution,sampleToken,defaultCorpus} from '../dist/assets/ai-models.js';
import {aiLessons,aiSections} from '../dist/assets/ai-curriculum.js';
assert.equal(aiLessons.length,4);
assert.equal(aiSections[0].id,'ai-basics');assert.equal(trainThreshold(samples().filter(p=>p.x!==60)).threshold,60);
const data=samples(),model=trainThreshold(data);assert.equal(model.threshold,70);assert.equal(model.errors,0);data.push({x:55,y:1});assert.equal(model.threshold,70);assert.equal(trainThreshold(data).threshold,47.5);assert.equal(predict(65,70),0);assert.equal(predict(65,47.5),1);
assert.throws(()=>trainThreshold([]));assert.throws(()=>trainThreshold([{x:101,y:1}]));
const lm=trainBigram(defaultCorpus),options=distribution(lm,'ชอบ');assert.equal(options.find(x=>x.token==='ชา').probability,2/3);assert.equal(options.find(x=>x.token==='กาแฟ').probability,1/3);assert.equal(sampleToken(options,0),'กาแฟ');assert.equal(sampleToken(options,.9),'ชา');assert.deepEqual(distribution(lm,'<END>'),[]);assert.throws(()=>trainBigram(''));
for(const l of aiLessons){assert(l.steps.length===3&&l.choices[l.answer]&&l.source&&l.hint);}
console.log('PASS: four AI lessons, threshold training/frozen inference, bigram counts and sampling');
