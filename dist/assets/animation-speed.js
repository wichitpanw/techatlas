// Presentation rate only: never changes packet latency, simulation inputs or Python execution.
export function clampSpeed(value){const n=Number(value);return Number.isFinite(n)?Math.max(.5,Math.min(2,n)):1;}
export function mountSpeed(container,{hidden=false,staticView=false,inline=false}={}){
  let rate=1;
  const label=document.createElement('label');label.className=inline?'animation-speed inline':'animation-speed';label.hidden=hidden;
  label.append(document.createTextNode(staticView?'ภาพนิ่ง · ':'ความเร็ว '));
  const select=document.createElement('select');select.setAttribute('aria-label','ความเร็วการแสดงผล 3D');
  for(const value of [.5,.75,1,1.25,1.5,1.75,2]){const option=document.createElement('option');option.value=String(value);option.textContent=value+'×';select.append(option);}
  select.value='1';select.disabled=staticView;label.title=staticView?'ฉากนี้เปลี่ยนตามการคลิก ไม่มีการเล่นตามเวลา':'ปรับความเร็วภาพและการเล่นขั้นตอน ไม่ใช่ความเร็วระบบจริง';
  select.onchange=()=>{rate=clampSpeed(select.value);select.value=String(rate);};label.append(select);container.append(label);
  return {get:()=>rate,set(value){rate=clampSpeed(value);select.value=String(rate);},dispose(){label.remove();}};
}
