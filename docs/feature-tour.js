const tour=document.querySelector('.feature-tour');
if(tour){
 const steps=[...tour.querySelectorAll('.feature-step')],links=[...tour.querySelectorAll('nav a')],scene=tour.querySelector('.feature-motion'),nodes=[...scene.querySelectorAll('.motion-entity')],copy=JSON.parse(tour.dataset.motionCopy),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const poses=[[[25,39],[50,39],[75,39]],[[23,29],[50,48],[77,29]],[[23,39],[50,39],[77,39]]];
 let active=-1,pending=false;
 function render(){
  pending=false;const mobile=innerWidth<800,line=innerHeight*(mobile?.72:.52);let index=0;
  steps.forEach((step,i)=>{if((mobile?step.querySelector('h3'):step).getBoundingClientRect().top<=line)index=i});
  const rect=steps[index].getBoundingClientRect();let t=reduced.matches?1:Math.max(0,Math.min(1,(line-rect.top)/(rect.height*.3)));t=t*t*(3-2*t);
  const points=[];
  nodes.forEach((node,i)=>{const from=poses[Math.max(0,index-1)][i],to=poses[index][i];const x=from[0]+(to[0]-from[0])*t,y=from[1]+(to[1]-from[1])*t;node.style.left=x+'%';node.style.top=y+'%';points.push([x*6,y*4.4])});
  scene.querySelector('.motion-link').setAttribute('d',`M${points[0][0]} ${points[0][1]} L${points[1][0]} ${points[1][1]} L${points[2][0]} ${points[2][1]}`);
  scene.style.setProperty('--progress',((index+t)/steps.length*100)+'%');
  if(active===index)return;active=index;scene.dataset.step=index;scene.setAttribute('aria-label',copy.titles[index]+'. '+copy.notes[index]);
  nodes.forEach((node,i)=>node.querySelector('strong').textContent=copy.entities[index][i]);
  links.forEach((a,i)=>i===index?a.setAttribute('aria-current','step'):a.removeAttribute('aria-current'));
  scene.querySelector('.motion-zone span').textContent=copy.zones[index];scene.querySelector('.motion-result small').textContent=copy.titles[index];scene.querySelector('.motion-result strong').textContent=copy.notes[index];scene.querySelector('.motion-caption').textContent=copy.notes[index];
 }
 function schedule(){if(!pending){pending=true;requestAnimationFrame(render)}}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});reduced.addEventListener('change',schedule);render();
}
