// Each visual follows the paragraph that explains it. Native scrolling stays free.
const journey = document.querySelector('.journey');
const beats = [...journey.querySelectorAll('.story-beat')];
const nav = [...journey.querySelectorAll('.journey-nav a')];
const canvas = journey.querySelector('.concept-canvas');
const stage = journey.querySelector('.concept-stage');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const captions = {
  0: 'Ton produit, tes données, tes services. Le point de départ.',
  2: 'Compare avant de choisir. Ajuste avant de déployer.',
  4: 'Exposition, vulnérabilités, corrections : prépare la bascule.',
  5: 'Les données et les fichiers rejoignent la cible choisie.',
  7: 'Ton compte cloud. Une architecture que tu peux relire.',
  8: 'La préparation devient une pratique au quotidien.'
};
const poses = {
  0: [[24,15],[24,37],[24,59],[24,81]],
  2: [[24,15],[24,37],[24,59],[24,81]],
  4: [[22,15],[22,37],[22,59],[22,81]],
  5: [[22,15],[22,37],[22,59],[22,81]],
  7: [[50,10],[23,29],[50,29],[77,29]],
  8: [[22,15],[22,37],[22,59],[22,81]]
};
const nodes = ['repo','app','db','storage'].map(name => canvas.querySelector('.'+name+'-node'));
const panels = [['.origins-panel',0],['.github-panel',1],['.terraform-panel',2],['.network-zone',3],['.public-node',3],['.audit-panel',4],['.migration-panel',5],['.build-panel',6],['.live-panel',7],['.operations-panel',8]].map(([selector,scene])=>[canvas.querySelector(selector),scene]);
const checkpoints = [...canvas.querySelectorAll('.migration-checkpoints span')];
const clamp = n => Math.max(0,Math.min(1,n));
let scheduled = false;
let last = -1;
function render() {
  scheduled = false;
  const mobile = innerWidth < 800;
  // On small screens the reading line sits below the sticky visual, not behind it.
  const line = mobile ? Math.min(innerHeight*.86,stage.offsetHeight+24+(innerHeight-stage.offsetHeight-24)*.35) : innerHeight*.53;
  const rectangles = beats.map(el=>el.getBoundingClientRect());
  let current = 0;
  rectangles.forEach((rect,i)=>{if(rect.top<=line)current=i;});
  const beat = beats[current];
  const scene = Number(beat.dataset.scene);
  const act = Number(beat.dataset.act);
  const rect = rectangles[current];
  const progress = clamp((line-rect.top)/Math.max(1,rect.height*.72));
  const transition = reduced.matches ? 1 : clamp(progress/.2);
  const t = transition*transition*(3-2*transition);
  // Logos converge into the resources they represent, after the opening has held.
  const gather = scene===0 && !reduced.matches ? clamp((line+innerHeight*.24-rectangles[1].top)/(innerHeight*.24)) : 0;
  journey.style.setProperty('--galaxy-gather',gather);
  const previous = Number(beats[Math.max(0,current-1)].dataset.scene);
  nodes.forEach((node,n)=>{
    const from=poses[previous][n],to=poses[scene][n];
    node.style.left=(from[0]+(to[0]-from[0])*t)+'%';
    node.style.top=(from[1]+(to[1]-from[1])*t)+'%';
  });
  journey.style.setProperty('--solution-ink',clamp((current+t)/4));
  const transfer=scene===5?(reduced.matches?1:clamp((progress-.12)/.7)):0;
  journey.style.setProperty('--transfer',transfer);
  journey.style.setProperty('--db-transfer',clamp((transfer-.08)/.45));
  journey.style.setProperty('--object-transfer',clamp((transfer-.4)/.45));
  checkpoints.forEach((el,i)=>el.classList.toggle('is-current',scene===5&&Math.min(3,Math.floor(transfer*4))===i));
  if(last!==scene){
    last=scene;journey.dataset.stage=scene;
    nodes.forEach(node=>node.setAttribute('aria-hidden',String(scene===0||scene===5||scene===7||scene===8)));
    panels.forEach(([panel,panelScene])=>panel.setAttribute('aria-hidden',String(scene!==panelScene)));
    nav.forEach((a,i)=>i===act?a.setAttribute('aria-current','step'):a.removeAttribute('aria-current'));
    canvas.querySelector('.scene-caption span').textContent=`0${act+1} / ${['TON PRODUIT','TA PRÉPARATION','TON INFRASTRUCTURE'][act]}`;
    canvas.querySelector('.scene-caption b').textContent=captions[scene];
    beats.forEach(el=>el.classList.toggle('is-reading',el===beat));
  }
}
function requestRender(){if(!scheduled){scheduled=true;requestAnimationFrame(render);}}
addEventListener('scroll',requestRender,{passive:true});
addEventListener('resize',requestRender,{passive:true});
reduced.addEventListener('change',requestRender);
journey.classList.add('motion-ready');
render();
