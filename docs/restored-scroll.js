// Scroll moves the same resources through the project lifecycle. No scroll trapping.
const journey = document.querySelector('.journey');
const stages = [...journey.querySelectorAll('.journey-step')];
const nav = [...journey.querySelectorAll('.journey-nav a')];
const canvas = journey.querySelector('.concept-canvas');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const captions = ['Tes services sont répartis entre plateformes.', 'Le dépôt et la branche restent ton point de départ.', 'La même stack, décrite dans ton Git.', 'Une entrée publique. Des données privées.', 'Du risque à l’action.', 'Tes données rejoignent ton compte cloud.', 'Construire une fois, déployer le code choisi.', 'Tester. Relire. Déployer.', 'Le contrôle continue après le déploiement.'];
const labels = ['DÉPART', 'GITHUB', 'VISUAL', 'RÉSEAU', 'AUDIT', 'DONNÉES', 'BUILD', 'DEPLOY', 'OPÉRATIONS'];
const poses = [
  [[50,12],[23,85],[77,85],[50,85]],
  [[22,14],[22,38],[22,61],[22,83]],
  [[24,13],[24,36],[24,60],[24,84]],
  [[50,10],[50,51],[77,51],[20,79]],
  [[22,12],[22,37],[22,61],[22,84]],
  [[22,12],[22,37],[22,61],[22,84]],
  [[22,12],[22,37],[22,61],[22,84]],
  [[50,10],[23,33],[50,33],[77,33]],
  [[22,12],[22,37],[22,61],[22,84]]
];
const nodes = ['repo','app','db','storage'].map(name => canvas.querySelector('.'+name+'-node'));
let scheduled = false;
let last = -1;
const clamp = n => Math.max(0,Math.min(1,n));
function render() {
  scheduled = false;
  const mobile = innerWidth < 800;
  const line = innerHeight * (mobile ? .7 : .52);
  let index = 0;
  stages.forEach((el,i) => { if((mobile ? el.querySelector('h3') : el).getBoundingClientRect().top <= line) index=i; });
  const rect = (mobile ? stages[index].querySelector('h3') : stages[index]).getBoundingClientRect();
  let t = reduced.matches ? 1 : clamp((line-rect.top)/(rect.height*.26));
  t=t*t*(3-2*t);
  nodes.forEach((node,n) => {
    const from=poses[Math.max(0,index-1)][n], to=poses[index][n];
    node.style.left=(from[0]+(to[0]-from[0])*t)+'%';
    node.style.top=(from[1]+(to[1]-from[1])*t)+'%';
  });
  const migrationRect = stages[5].getBoundingClientRect();
  const transfer = index===5 ? (reduced.matches ? 1 : clamp((line-migrationRect.top)/(migrationRect.height*.8))) : 0;
  journey.style.setProperty('--transfer', transfer);
  journey.style.setProperty('--db-transfer', clamp((transfer-.15)/.35));
  journey.style.setProperty('--object-transfer', clamp((transfer-.5)/.35));
  canvas.querySelectorAll('.migration-checkpoints span').forEach((el,i)=>el.classList.toggle('is-current',index===5 && Math.min(3,Math.floor(transfer*4))===i));
  if(last!==index){
    last=index; journey.dataset.stage=index;
    nodes.forEach(node=>node.setAttribute('aria-hidden',String(index===5))); 
    [['.origins-panel',0],['.github-panel',1],['.terraform-panel',2],['.network-zone',3],['.public-node',3],['.audit-panel',4],['.migration-panel',5],['.build-panel',6],['.live-panel',7],['.operations-panel',8]].forEach(([selector,step]) => canvas.querySelector(selector).setAttribute('aria-hidden',String(index!==step)));
    nav.forEach((a,i)=>i===index?a.setAttribute('aria-current','step'):a.removeAttribute('aria-current'));
    canvas.querySelector('.scene-caption span').textContent=`0${index+1} / ${labels[index]}`;
    canvas.querySelector('.scene-caption b').textContent=captions[index];
    canvas.querySelector('.app-label').textContent=index===0?'APPLICATION · PAAS':'COMPUTE · PRIVÉ';
    canvas.querySelector('.db-label').textContent=index===0?'DONNÉES · BAAS':'BASE · PRIVÉE';
  }
}
function requestRender(){if(!scheduled){scheduled=true;requestAnimationFrame(render);}}
addEventListener('scroll',requestRender,{passive:true});
addEventListener('resize',requestRender,{passive:true});
reduced.addEventListener('change',requestRender);
journey.classList.add('motion-ready');
render();
