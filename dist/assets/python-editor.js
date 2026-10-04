// Four-space editing, shared by main.py and supplementary module editors.
export function pythonEdit(value, start, end, action) {
  const lineStart=start===0?0:value.lastIndexOf('\n',start-1)+1;
  if(action==='newline'){
    const before=value.slice(lineStart,start),indent=before.match(/^ */)[0]+(/[:{]\s*(?:(?:#|\/\/).*)?$/.test(before)?'    ':'');
    const insert='\n'+indent;return {from:start,to:end,text:insert,start:start+insert.length,end:start+insert.length};
  }
  if(action==='indent'&&start===end)return {from:start,to:end,text:'    ',start:start+4,end:start+4};
  // A selection ending at the beginning of the next line does not select that line.
  const last=end>start&&value[end-1]==='\n'?end-1:end;
  const newline=value.indexOf('\n',last),lineEnd=newline<0?value.length:newline;
  const lines=value.slice(lineStart,lineEnd).split('\n');let firstDelta=0,total=0;
  const transformed=lines.map((line,i)=>{
    const remove=action==='outdent'?Math.min(4,line.match(/^ */)[0].length):0;
    const delta=action==='indent'?4:-remove;if(i===0)firstDelta=delta;total+=delta;
    return action==='indent'?'    '+line:line.slice(remove);
  }).join('\n');
  return {from:lineStart,to:lineEnd,text:transformed,start:Math.max(lineStart,start+firstDelta),end:Math.max(lineStart,end+total)};
}
export function bindPythonEditor(editor){
  editor.wrap='off';
  editor.addEventListener('scroll',()=>paintPythonLine(editor));
  editor.addEventListener('input',()=>clearPythonHighlights());
  editor.style.tabSize='4';editor.spellcheck=false;editor.setAttribute('autocapitalize','off');editor.setAttribute('autocorrect','off');
  let escapeTab=false;
  function apply(action){const edit=pythonEdit(editor.value,editor.selectionStart,editor.selectionEnd,action);editor.setRangeText(edit.text,edit.from,edit.to,'preserve');editor.setSelectionRange(edit.start,edit.end);editor.dispatchEvent(new Event('input',{bubbles:true}));}
  editor.addEventListener('keydown',e=>{
    if(e.isComposing||e.ctrlKey||e.metaKey||e.altKey)return;
    if(e.key==='Escape'){escapeTab=true;return;}
    if(e.key==='Tab'){if(escapeTab){escapeTab=false;return;}e.preventDefault();e.stopPropagation();apply(e.shiftKey?'outdent':'indent');}
    else if(e.key==='Enter'){escapeTab=false;e.preventDefault();apply('newline');}else escapeTab=false;
  },true);
  const tools=document.createElement('div');tools.className='python-editor-tools';
  for(const [action,label]of [['indent','เพิ่มย่อหน้า · Tab'],['outdent','ลดย่อหน้า · Shift+Tab']]){const button=document.createElement('button');button.type='button';button.textContent=label;button.addEventListener('mousedown',e=>e.preventDefault());button.addEventListener('click',()=>{editor.focus();apply(action);});tools.append(button);}
  const note=document.createElement('span');note.textContent='4 ช่องว่าง · Enter เยื้องต่อ · Esc แล้ว Tab เพื่อออกจากช่องโค้ด';tools.append(note);editor.before(tools);
  const position=document.createElement('span');position.className='python-editor-position';position.setAttribute('aria-live','polite');tools.append(position);
}

function paintPythonLine(editor){
  const line=Number(editor.dataset.traceLine);
  if(!line){editor.style.backgroundImage='';return;}
  const style=getComputedStyle(editor),height=parseFloat(style.lineHeight);
  const top=parseFloat(style.paddingTop)+(line-1)*height-editor.scrollTop;
  editor.style.backgroundImage='linear-gradient(#35c7ab33, #35c7ab33)';
  editor.style.backgroundSize=`100% ${height}px`;editor.style.backgroundPosition=`0 ${top}px`;editor.style.backgroundRepeat='no-repeat';
}
export function clearPythonHighlights(){
  document.querySelectorAll('.editor').forEach(editor=>{delete editor.dataset.traceLine;paintPythonLine(editor);});
  document.querySelectorAll('.python-editor-position').forEach(note=>note.textContent='');
}
export function highlightPythonLine(frame, context){
  clearPythonHighlights();
  const editor=frame.file==='main.py'?document.querySelector('#code'):[...document.querySelectorAll('[data-file]')].find(el=>el.dataset.file===frame.file);
  const original=frame.file==='main.py'?context.code:context.files?.[frame.file];
  if(!editor||editor.value!==original)return false;
  if(frame.line<1||frame.line>editor.value.split('\n').length)return false;
  editor.dataset.traceLine=frame.line;
  const height=parseFloat(getComputedStyle(editor).lineHeight),top=(frame.line-1)*height;
  if(top<editor.scrollTop||top+height>editor.scrollTop+editor.clientHeight-44)editor.scrollTop=Math.max(0,top-editor.clientHeight/2);
  paintPythonLine(editor);
  const note=editor.previousElementSibling?.querySelector('.python-editor-position');
  if(note)note.textContent=`ย้อนหลัง · ${frame.file} · บรรทัด ${frame.line}${frame.event==='line'?' · ก่อนทำคำสั่ง':frame.event==='exception'?' · เกิดข้อผิดพลาด':' · '+(frame.event==='return'?'จบการทำงาน':'เริ่มการทำงาน')}`;
  return true;
}
