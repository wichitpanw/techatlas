import assert from 'node:assert/strict';
import {normalize,dot,activate,mse} from '../dist/assets/ai-foundation-model.js';
assert.deepEqual(normalize([0,255,128,0,255,128,0,255,128]),[0,1,128/255,0,1,128/255,0,1,128/255]);assert.throws(()=>normalize([256]));assert.throws(()=>normalize(Array(9).fill(NaN)));
assert.ok(Math.abs(dot([1,.5],[.8,-.4]).sum-.6)<1e-12);assert.equal(dot([1,.5],[.8,.4]).sum,1);assert.throws(()=>dot([1],[1,2]));assert.throws(()=>dot([],[]));
assert.equal(activate(-1,'relu'),0);assert.equal(activate(1,'relu'),1);assert.equal(activate(0,'sigmoid'),.5);assert.equal(activate(0,'tanh'),0);assert.equal(activate(-3,'linear'),-3);assert.ok(Number.isFinite(activate(-1000,'sigmoid')));assert.throws(()=>activate(1,'unknown'));
assert.deepEqual(mse([0,.5],[1,-.5]),{errors:[-1,1],squares:[1,1],loss:1});assert.equal(mse([1,-.5],[1,-.5]).loss,0);assert.throws(()=>mse([],[]));assert.throws(()=>mse([1],[1,2]));
console.log('PASS: pixel order/ranges, dot dimensions/products, activation boundaries/stability, MSE cancellation/zero/errors');
