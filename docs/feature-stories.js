/* Scroll follows the text being read. One continuous scene, no scroll capture. */
for (const tour of document.querySelectorAll('[data-feature-story]')) {
  const steps = [...tour.querySelectorAll('.story-step')];
  const stage = tour.querySelector('.story-stage');
  const links = [...tour.querySelectorAll('.story-nav a')];
  const caption = stage.querySelector('figcaption');
  const counter = stage.querySelector('[data-scene-count]');
  const tracks = [...stage.querySelectorAll('[data-track]')].map(el => ({el, frames: JSON.parse(el.dataset.track), base: el.getAttribute('transform') || ''}));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let scheduled = false, active = -1;
  const clamp = n => Math.max(0, Math.min(1, n));
  const smooth = n => n*n*(3-2*n);
  function render() {
    scheduled = false;
    const readingLine = innerHeight * .53;
    const tops = steps.map(step => step.querySelector('h3').getBoundingClientRect().top);
    let current = 0;
    for (let i=1; i<steps.length; i++) if (tops[i] <= readingLine) current=i;
    // Transition as the next paragraph enters; retain a long, readable pause.
    let position = current;
    if (current < steps.length-1 && !reduced.matches) {
      const next = tops[current+1];
      position += smooth(clamp((readingLine + innerHeight*.23 - next)/(innerHeight*.23)));
    }
    const from = Math.floor(position), to = Math.min(from+1,steps.length-1), t = position-from;
    for (const {el,frames,base} of tracks) {
      const value = (key, fallback) => frames[key] ? frames[key][from] + (frames[key][to]-frames[key][from])*t : fallback;
      const x=value('x',0), y=value('y',0), scale=value('scale',1);
      el.setAttribute('transform',`translate(${x} ${y}) scale(${scale}) ${base}`);
      if(frames.opacity) el.style.opacity=String(value('opacity',1));
      if(frames.width) el.setAttribute('width',String(value('width',0)));
      if(frames.height) el.setAttribute('height',String(value('height',0)));
      if(frames.dash) el.style.strokeDashoffset=String(value('dash',0));
    }
    const nextActive = Math.round(position);
    stage.style.setProperty('--progress',`${(position+1)/steps.length*100}%`);
    if(nextActive !== active) {
      active=nextActive;
      stage.dataset.stage=String(active);
      caption.textContent=steps[active].querySelector('.step-detail').textContent;
      counter.textContent=`0${active+1} / 0${steps.length}`;
      links.forEach((link,i)=>i===active ? link.setAttribute('aria-current','step') : link.removeAttribute('aria-current'));
    }
  }
  function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(render)}}
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  addEventListener('hashchange',schedule);
  addEventListener('pageshow',schedule);
  reduced.addEventListener('change',schedule);
  document.fonts.ready.then(schedule);
  render();
}
// Links to a technical paragraph must expose it, even when its reference is folded.
function revealFeatureAnchor(){
  let id;try{id=decodeURIComponent(location.hash.slice(1))}catch{return}
  const target=document.getElementById(id);if(!target)return;
  let parent=target.parentElement,opened=false;
  while(parent){if(parent.tagName==='DETAILS'&&!parent.open){parent.open=true;opened=true}parent=parent.parentElement}
  if(opened)requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));
}
addEventListener('hashchange',revealFeatureAnchor);
revealFeatureAnchor();
