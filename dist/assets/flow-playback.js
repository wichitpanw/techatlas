// Presentation timing only: never changes a protocol model or simulated latency.
export function flowSchedule(transfers){
  const result=[];
  for(const transfer of transfers){let lane=0;for(const prior of result)if(prior.to===transfer.from)lane=Math.max(lane,prior.lane+1);result.push({...transfer,lane});}
  return result;
}
export const FLOW_HOP_MS=1600;
export function flowDuration(transfers){return (Math.max(0,...flowSchedule(transfers).map(t=>t.lane))+1)*FLOW_HOP_MS+450;}
export function startFlowPlayback({scene,advance,atEnd,onEnd,connected=()=>true}){
  let cancelled=false,raf,last=null,elapsed=0;
  scene()?.resume?.();
  function tick(now){
    if(cancelled)return;
    if(!connected()){onEnd();return;}
    if(last!==null&&!document.hidden)elapsed+=Math.min(50,now-last)*(scene()?.speed?.()??1);
    last=now;
    if(elapsed>=(scene()?.stepDuration?.()??2050)){
      if(atEnd()){onEnd();return;}
      advance();elapsed=0;
    }
    raf=requestAnimationFrame(tick);
  }
  raf=requestAnimationFrame(tick);
  return {stop(){cancelled=true;cancelAnimationFrame(raf);scene()?.pause?.();}};
}
