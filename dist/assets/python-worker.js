let runtime;
self.onmessage=async({data})=>{
 try{
  if(data.type==='init'){
   importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js');
   runtime=await loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'});
   self.postMessage({type:'ready'});return;
  }
  if(!runtime)throw new Error('Python ยังไม่พร้อม');
  const lines=[];runtime.setStdout({batched:line=>lines.push(line)});runtime.setStderr({batched:line=>lines.push(line)});
  const scope=runtime.globals.get('dict')();
  try{await runtime.runPythonAsync(data.code,{globals:scope});self.postMessage({type:'result',id:data.id,output:lines.join('\n')});}finally{scope.destroy();}
 }catch(error){const raw=String(error);const index=raw.lastIndexOf('  File "<exec>"');const message=index>=0?'Python error:\n'+raw.slice(index):raw;self.postMessage({type:'error',id:data.id,message});}
};
