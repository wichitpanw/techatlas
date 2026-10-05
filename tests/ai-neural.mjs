import assert from 'node:assert/strict';
import {initial,clone,forward,backward,entries,get,update,numericalGradient,linear,linearStep} from '../dist/assets/ai-neural-model.js';
const p=initial(),snapshot=clone(p);assert.equal(entries(p).length,17);
for(const x of [[1,.5],[0,0],[-2,2],[.03,-.8]]){const f=backward(p,x);for(const e of entries(p)){assert.ok(Math.abs(get(f.grad,e)-numericalGradient(p,x,[1,-.5],e))<1e-7,e.name);}assert.equal(f.loss,forward(p,x).loss);}
assert.deepEqual(p,snapshot);const f=backward(p,[1,.5]);const next=update(p,f.grad,.15);assert.ok(forward(next,[1,.5]).loss<f.loss);assert.deepEqual(p,snapshot);assert.deepEqual(initial(),snapshot);assert.throws(()=>update(p,f.grad,NaN));
let w=-1.2,b=-.8,start=linear(w,b).loss;for(let i=0;i<10;i++){({w,b}=linearStep(w,b,.15));}assert.ok(linear(w,b).loss<start);
let high=linearStep(-1.2,-.8,2);assert.ok(linear(high.w,high.b).loss>start,'Large rate must show actual overshoot');
const eps=1e-5,q=linear(.2,-.3);assert.ok(Math.abs(q.dw-(linear(.2+eps,-.3).loss-linear(.2-eps,-.3).loss)/(2*eps))<1e-8);assert.ok(Math.abs(q.db-(linear(.2,-.3+eps).loss-linear(.2,-.3-eps).loss)/(2*eps))<1e-8);
console.log('PASS: 17 gradients × 4 inputs, immutability, deterministic reset, regression loss, learning-rate overshoot, linear finite differences');
