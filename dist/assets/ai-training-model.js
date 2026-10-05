export const batchData=Array.from({length:8},(_,i)=>{const x=-1+2*i/7;return {id:i+1,x,y:.8*x+.2+[.03,-.04,.02,-.01,.04,-.02,.01,-.03][i]};});
export function batchGradient(w,b,data){if(!data.length)throw Error('Batch ว่าง');let loss=0,dw=0,db=0;for(const {x,y} of data){const e=w*x+b-y;loss+=e*e/data.length;dw+=2*e*x/data.length;db+=2*e/data.length;}return {loss,dw,db};}
export function batchInitial(size=2){if(![2,4,8].includes(size))throw Error('Batch size ต้องเป็น2/4/8');return {w:-1,b:-.5,size,cursor:0,epoch:0,updates:0};}
export function nextBatch(s,rate=.1){if(!Number.isFinite(rate)||rate<=0||rate>1)throw Error('Learning rate ต้องมากกว่า0และไม่เกิน1');const data=batchData.slice(s.cursor,s.cursor+s.size),g=batchGradient(s.w,s.b,data),end=s.cursor+data.length,done=end===batchData.length;const next={...s,w:s.w-rate*g.dw,b:s.b-rate*g.db,cursor:done?0:end,epoch:s.epoch+Number(done),updates:s.updates+1};return {before:{...s},data,g,next,afterLoss:batchGradient(next.w,next.b,batchData).loss};}
const truth=x=>.25+.6*x-.8*x*x;
export const fitTrain=Array.from({length:8},(_,i)=>{const x=-1+2*i/7;return {x,y:truth(x)+[.12,-.16,.18,-.1,.15,-.2,.13,-.08][i]};});
export const fitValidation=Array.from({length:9},(_,i)=>{const x=-.92+1.84*i/8;return {x,y:truth(x)+[.01,-.02,.02,-.01,0,.01,-.02,.02,-.01][i]};});
// Separate synthetic hold-out; only the final evaluation button reveals its metrics.
const fitTest=Array.from({length:11},(_,i)=>{const x=-.94+1.83*i/10;return {x,y:truth(x)};});
export function splitSummary(){const all=[fitTrain,fitValidation,fitTest];return {counts:all.map(a=>a.length),overlap:all.reduce((n,a,i)=>n+a.filter(p=>all.slice(i+1).some(b=>b.some(q=>Math.abs(p.x-q.x)<1e-12))).length,0)};}
export function predict(coeff,x){return coeff.reduceRight((s,c)=>s*x+c,0);}
export function score(coeff,data){return data.reduce((s,p)=>s+(predict(coeff,p.x)-p.y)**2,0)/data.length;}
export function fitPolynomial(degree,train=fitTrain){if(![1,3,7].includes(degree)||train.length<degree+1)throw Error('รองรับ degree1/3/7 และข้อมูลต้องเพียงพอ');const n=degree+1,Q=[],R=Array.from({length:n},()=>Array(n).fill(0));
 for(let j=0;j<n;j++){let v=train.map(p=>p.x**j);for(let pass=0;pass<2;pass++)for(let k=0;k<j;k++){const r=v.reduce((s,a,i)=>s+a*Q[k][i],0);R[k][j]+=r;v=v.map((a,i)=>a-r*Q[k][i]);}R[j][j]=Math.hypot(...v);if(R[j][j]<1e-12)throw Error('ข้อมูลไม่พอแยกพารามิเตอร์');Q.push(v.map(a=>a/R[j][j]));}
 const qty=Q.map(q=>q.reduce((s,a,i)=>s+a*train[i].y,0)),coeff=Array(n).fill(0);for(let j=n-1;j>=0;j--)coeff[j]=(qty[j]-coeff.reduce((s,c,k)=>s+(k>j?R[j][k]*c:0),0))/R[j][j];return {degree,coeff,trainLoss:score(coeff,train),validationLoss:score(coeff,fitValidation)};
}
export function evaluateHoldout(coeff){return {loss:score(coeff,fitTest),count:fitTest.length};}
