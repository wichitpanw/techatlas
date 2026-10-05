// Tiny regression network: 2 inputs, 3 tanh hidden units, 2 linear outputs.
export const initial = () => ({w1:[[.8,-.4],[-.3,.7],[.5,.2]],b1:[.1,-.1,.05],w2:[[.6,-.5,.3],[-.2,.4,.7]],b2:[.1,-.15]});
export const clone = p => structuredClone(p);
export function forward(p,x,target=[1,-.5]) {
  const z=p.w1.map((row,j)=>row.reduce((s,w,i)=>s+w*x[i],p.b1[j]));
  const h=z.map(Math.tanh);
  const y=p.w2.map((row,k)=>row.reduce((s,w,j)=>s+w*h[j],p.b2[k]));
  const loss=y.reduce((s,v,k)=>s+(v-target[k])**2,0)/y.length;
  return {x:[...x],z,h,y,target:[...target],loss};
}
export function backward(p,x,target=[1,-.5]) {
  const f=forward(p,x,target), dy=f.y.map((v,k)=>2*(v-target[k])/f.y.length);
  const dh=f.h.map((_,j)=>dy.reduce((s,v,k)=>s+v*p.w2[k][j],0));
  const dz=dh.map((v,j)=>v*(1-f.h[j]**2));
  return {...f,dy,dh,dz,grad:{w1:dz.map(v=>x.map(a=>v*a)),b1:[...dz],w2:dy.map(v=>f.h.map(a=>v*a)),b2:[...dy]}};
}
export function entries(p) {
  return ['w1','b1','w2','b2'].flatMap(key=>p[key].flatMap((v,i)=>Array.isArray(v)?v.map((value,j)=>({key,i,j,value,name:`${key}[${i+1},${j+1}]`})):[{key,i,value:v,name:`${key}[${i+1}]`}]));
}
export function get(p,e){return e.j===undefined?p[e.key][e.i]:p[e.key][e.i][e.j];}
function set(p,e,v){if(e.j===undefined)p[e.key][e.i]=v;else p[e.key][e.i][e.j]=v;}
export function update(p,grad,rate) {
  if(!Number.isFinite(rate)||rate<=0||rate>2)throw Error('Learning rate ต้องมากกว่า 0 และไม่เกิน 2');
  const next=clone(p); for(const e of entries(p)) {const v=e.value-rate*get(grad,e);if(!Number.isFinite(v)||Math.abs(v)>1e6)throw Error('ค่าฝึกสูงเกินขอบเขตต้นแบบ ให้เริ่มใหม่และลด Learning rate');set(next,e,v);}return next;
}
export function numericalGradient(p,x,target,e,epsilon=1e-5){const a=clone(p),b=clone(p);set(a,e,get(p,e)+epsilon);set(b,e,get(p,e)-epsilon);return (forward(a,x,target).loss-forward(b,x,target).loss)/(2*epsilon);}
export const data=[[-1,-.6],[-.6,-.3],[-.2,.1],[.2,.3],[.6,.7],[1,.9]];
export function linear(w,b){let loss=0,dw=0,db=0;for(const [x,y]of data){const error=w*x+b-y;loss+=error**2/data.length;dw+=2*error*x/data.length;db+=2*error/data.length;}return {loss,dw,db};}
export function linearStep(w,b,rate){const f=linear(w,b);return {w:w-rate*f.dw,b:b-rate*f.db,...f};}
