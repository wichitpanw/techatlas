import { mountScene as networkScene } from "./lab-scene.js";
import { mountScene as foundationScene } from "./foundation-scene.js";
import { conceptPreview } from "./network-concepts.js";
import { mountScene as pythonScene } from './python-scene.js';
import { mountScene as mechanismScene } from './network-mechanism-scene.js';
import { networkLabSpecs, buildNetworkLab } from './network-lab-models.js';
import {programmingPreview} from './programming-lab.js';
import {aiPreview} from './ai-lab.js';
import {osiPreview} from './osi-lab.js';
import {mountOSI} from './osi-scene.js';
import {buildOSI} from './osi-lab.js';
import {buildInternet} from './internet-model.js';
import {qualityPreview,simulateQueue} from './network-quality.js';
import {queueSceneModel} from './quality-scene-model.js';
import {serviceLessons,serviceScene,simulateVideo,simulateRate} from './service-tools.js';
import {repairInitial,repairModel} from './repair-lab.js';

// Actual lesson renderers/data are the single source of truth for Explore previews.
export function mountScene(container, { lesson } = {}) {
  if(lesson.id==='noc-incident')return mechanismScene(container,{lesson,preview:true,initialModel:repairModel(repairInitial('uplink'))});
  if(serviceLessons.some(s=>s.id===lesson.id)){const m=lesson.id==='video-buffer'?simulateVideo():simulateRate();const scene=mechanismScene(container,{lesson,preview:true,initialModel:serviceScene(lesson,m)});scene.showStep(3);return scene;}
  if(['network-quality','qos-queues'].includes(lesson.id)){const scene=mechanismScene(container,{lesson,preview:true,initialModel:queueSceneModel(simulateQueue())});scene.showStep(3);return scene;}
  if(lesson.id==='internet')return mechanismScene(container,{lesson,preview:true,initialModel:buildInternet()});
  if(lesson.id==='osi-model'){
    try{const scene=mountOSI(container,{preview:true});scene.showStep(buildOSI()[5]);return scene;}
    catch{const preview=document.createElement('div');preview.innerHTML=osiPreview();container.append(preview);return {dispose(){preview.remove();}};}
  }
  if(lesson.track==='ai'){const preview=document.createElement('div');preview.innerHTML=aiPreview(lesson);container.append(preview);return {dispose(){preview.remove();}};}
  if(lesson.track==='programming'){
    const preview=document.createElement('div');preview.innerHTML=programmingPreview(lesson);container.append(preview);
    return {dispose(){preview.remove();}};
  }
  if (lesson.track === 'python') {
    const scene = pythonScene(container, { preview: true, lesson });
    scene.update('รันโค้ดเพื่อดูผลของคุณ', 'idle');
    if (['identity', 'list-copy'].includes(lesson.id)) {
      // Illustration of the supplied starter, not a claimed runtime trace.
      const sample = {type:'list', value:"['สมุด', 'ปากกา']", objectId:'object 1'};
      const variables = [{name:'original', ...sample}, {name:lesson.id==='identity'?'alias':'draft', ...sample}];
      if (lesson.id==='identity') variables.push({name:'separate', ...sample, objectId:'object 2'});
      scene.displayFrame({variables});
      scene.update('ตัวอย่างการอ้างถึงจากโค้ดเริ่มต้น', 'example');
    }
    return scene;
  }
  if (
    lesson.track === "network" &&
    lesson.section === "foundation" &&
    lesson.conceptLab
  ) {
    container.dataset.state = "0";
    container.dataset.value = "192";
    return foundationScene(container, { variant: lesson.id, preview: true });
  }
  if (lesson.track === "network" && !lesson.conceptLab) {
    const scene = networkScene(container, {
      variant: lesson.scene,
      preview: true,
    });
    if (lesson.id === "subnet") scene.setSubnet(24);
    return scene;
  }
  if (networkLabSpecs[lesson.id]?.mode === '3d') {
    const scene = mechanismScene(container, {lesson, preview:true});
    const model = buildNetworkLab(lesson);
    scene.setModel(model);scene.showStep(model.steps.length-1);
    return scene;
  }
  const surface = document.createElement("div");
  surface.className = "lesson-card-preview";
  surface.setAttribute("role", "img");
  surface.setAttribute("aria-label", `ภาพตัวอย่าง: ${lesson.title}`);
  if (lesson.track === "python") {
    const code = document.createElement("pre");
    code.textContent = lesson.starter;
    surface.append(code);
  } else if (networkLabSpecs[lesson.id]) {
    const model = buildNetworkLab(lesson), frame=model.steps[0];
    const heading=document.createElement('strong');heading.textContent=model.title;
    const actors=document.createElement('div');actors.className='preview-mechanism-actors';
    for(const n of model.nodes){const actor=document.createElement('span');actor.textContent=n.name;actors.append(actor);}
    const step=document.createElement('p');step.textContent='01 · '+frame.title;
    surface.append(heading,actors,step);
  } else surface.innerHTML = conceptPreview(lesson);
  container.append(surface);
  return {
    dispose() {
      surface.remove();
    },
  };
}
