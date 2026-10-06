// Current AI course only. Standalone labs share the catalog with Explore/Path.
export const aiSections=[{id:'ai-foundations',title:'ช่วง 1 · ข้อมูลและการคำนวณของโมเดล'},{id:'ai-training',title:'ช่วง 2 · การฝึกและการตรวจโมเดล'}];
const rows=[
 ['ai-pixels','ข้อมูลเป็นตัวเลข','เปลี่ยน Pixel → เรียง Vector → หาร 255','ai-foundations','ai-foundations','data'],
 ['ai-vectors','Vector และ Dot product','จับคู่สมาชิก คูณ แล้วรวมเป็นหนึ่งค่า','ai-foundations','ai-foundations','vector'],
 ['ai-neuron','Neuron: Weight และ Bias','เปลี่ยน Weight แล้วดูผลรวมก่อน Activation','ai-foundations','ai-neural','neuron'],
 ['ai-activation','Activation: ความไม่เชิงเส้น','เทียบ Linear, ReLU, Sigmoid และ tanh','ai-foundations','ai-foundations','activation'],
 ['ai-forward','Forward Pass','ตามค่าจาก Input ผ่านชั้นซ่อนถึง Output','ai-foundations','ai-neural','forward'],
 ['ai-loss','Loss: วัดความคลาดเคลื่อน','Prediction → Error² → ค่าเฉลี่ย MSE','ai-foundations','ai-foundations','loss'],
 ['ai-gradient','Gradient Descent','ดูทิศทางลด Loss และผลของ Learning rate','ai-training','ai-neural','gradient'],
 ['ai-backprop','Backpropagation','ส่ง Gradient ย้อนกลับ แล้วปรับพารามิเตอร์','ai-training','ai-neural','backprop'],
 ['ai-batch','Batch และ Epoch','เทียบขนาด Batch กับจำนวนการอัปเดต','ai-training','ai-training','batch'],
 ['ai-validation','Validation และ Overfitting','เทียบ Train/Validation ก่อนประเมิน Test','ai-training','ai-training','fit'],
];
export const aiLessons=rows.map(([id,title,subtitle,section,page,topic],i)=>({id,title,subtitle,section,track:'ai',tag:`AI / ${String(i+1).padStart(2,'0')}`,time:15,href:new URL(`../../prototypes/${page}.html?v=ai-catalog-20261006#${topic}`,import.meta.url).href,preview:page==='ai-neural'?'neural':topic}));
export function aiCardPreview(l){
 const diagrams={data:'<g fill="#91bbb9"><rect x="45" y="40" width="22" height="22"/><rect x="75" y="40" width="22" height="22"/><rect x="45" y="70" width="22" height="22"/><rect x="75" y="70" width="22" height="22"/></g><path d="M120 65H190"/><text x="210" y="70">[0, 0.5, 1]</text>',vector:'<text x="30" y="60">x₁ × w₁</text><text x="30" y="95">x₂ × w₂</text><path d="M130 55L200 75M130 90L200 75"/><text x="220" y="80">Σ → Dot</text>',activation:'<path d="M50 100H300M140 115V30M60 100H140L240 35"/><text x="265" y="45">ReLU</text>',loss:'<text x="30" y="55">ŷ − y</text><path d="M110 50H170"/><text x="190" y="55">Error²</text><text x="120" y="100">เฉลี่ย → MSE</text>',neural:'<path d="M55 45L170 35M55 45L170 80M55 45L170 120M55 110L170 35M55 110L170 80M55 110L170 120M170 35L290 55M170 80L290 55M170 120L290 55M170 35L290 105M170 80L290 105M170 120L290 105"/><g fill="#102d3b"><circle cx="55" cy="45" r="12"/><circle cx="55" cy="110" r="12"/><circle cx="170" cy="35" r="12"/><circle cx="170" cy="80" r="12"/><circle cx="170" cy="120" r="12"/><circle cx="290" cy="55" r="12"/><circle cx="290" cy="105" r="12"/></g>',fit:'<path d="M40 110H320M45 120V25M50 95Q180 5 310 85"/><g fill="#c39ceb"><circle cx="70" cy="85" r="5"/><circle cx="125" cy="60" r="5"/><circle cx="175" cy="45" r="5"/><circle cx="230" cy="60" r="5"/><circle cx="290" cy="70" r="5"/></g><text x="170" y="135">Train / Validation</text>'};
 diagrams.data=`<g fill="#91bbb9">${Array.from({length:9},(_,i)=>`<rect x="${35+i%3*24}" y="${32+Math.floor(i/3)*24}" width="18" height="18"/>`).join('')}</g><path d="M120 65H190"/><text x="210" y="70">[0, 0.5, 1, …]</text>`;
 diagrams.batch=`<g fill="#91bbb9">${Array.from({length:8},(_,i)=>`<circle cx="${40+i%4*24}" cy="${48+Math.floor(i/4)*35}" r="7"/>`).join('')}</g><path d="M145 65H200"/><text x="220" y="70">∇ → w, b</text><text x="35" y="125">Batch → Update → Epoch</text>`;
 return `<svg viewBox="0 0 360 160" role="img" aria-label="ภาพแนวคิด ${l.title}" style="width:100%;height:100%;stroke:#7bdcc6;fill:none;stroke-width:2"><g style="font:16px monospace;fill:#d4f1ed;stroke:none"></g>${(diagrams[l.preview]||diagrams.neural).replaceAll('<text ','<text fill="#d4f1ed" stroke="none" ')}</svg>`;
}
