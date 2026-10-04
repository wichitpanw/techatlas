export const samples=()=>[{x:20,y:0},{x:40,y:0},{x:60,y:0},{x:80,y:1},{x:90,y:1}];
export const predict=(x,threshold)=>Number(x>=threshold);
export function trainThreshold(data){
 if(!data.length||data.some(p=>!Number.isFinite(p.x)||p.x<0||p.x>100||![0,1].includes(p.y)))throw Error('คะแนนต้องเป็น 0–100 และ label ต้องเป็น 0 หรือ 1');
 const unique=[...new Set(data.map(p=>p.x))].sort((a,b)=>a-b),candidates=[0,...unique.slice(1).map((x,i)=>(x+unique[i])/2),101];
 let best=null;for(const threshold of candidates){const errors=data.filter(p=>predict(p.x,threshold)!==p.y).length;if(!best||errors<best.errors)best={threshold,errors};}return {...best,size:data.length};
}
export const defaultCorpus='ฉัน ชอบ กาแฟ\nฉัน ชอบ ชา\nฉัน ดื่ม น้ำ\nเธอ ชอบ ชา';
export function trainBigram(corpus){
 const rows=corpus.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);if(!rows.length)throw Error('เพิ่มข้อความอย่างน้อยหนึ่งบรรทัด');if(corpus.length>4000)throw Error('ข้อความไม่เกิน 4,000 ตัวอักษร');
 const model=new Map();for(const row of rows){const tokens=['<START>',...row.split(/\s+/),'<END>'];for(let i=0;i<tokens.length-1;i++){if(!model.has(tokens[i]))model.set(tokens[i],new Map());const next=model.get(tokens[i]);next.set(tokens[i+1],(next.get(tokens[i+1])||0)+1);}}return model;
}
export function distribution(model,token){const next=model.get(token);if(!next)return [];const total=[...next.values()].reduce((a,b)=>a+b,0);return [...next].map(([token,count])=>({token,count,probability:count/total}));}
export function sampleToken(options,draw){if(!options.length)return null;let sum=0;for(const o of options){sum+=o.probability;if(draw<sum)return o.token;}return options.at(-1).token;}
