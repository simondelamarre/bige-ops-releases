/* The same three resources remain in the composition throughout the journey. */
(() => {
  const sequence = document.querySelector('.sequence');
  if (!sequence) return;
  const steps = [...sequence.querySelectorAll('.sequence-step')];
  const canvas = sequence.querySelector('.sequence-canvas');
  const names = ['app', 'data', 'files'];
  const objects = names.map(name => sequence.querySelector(`[data-object="${name}"]`));
  if (steps.length !== 6 || !canvas || objects.some(object => !object)) return;
  const eligibility = matchMedia('(min-width:1050px) and (min-height:700px) and (prefers-reduced-motion:no-preference)');
  const clamp = value => Math.max(0, Math.min(1, value));
  const ease = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
  // Transition as the heading enters; hold the result while its explanation is read.
  const change = progress => ease((progress - .1) / .6);
  const poses = [
    [[50,30],[50,49],[50,68]],
    [[36,30],[36,49],[36,68]],
    [[36,30],[36,49],[36,68]],
    [[74,30],[36,49],[36,68]],
    [[74,30],[74,49],[74,68]],
    [[74,30],[74,49],[74,68]]
  ];
  const status = sequence.querySelector('.sequence-status');
  const explanations = [
    ['01 / AUJOURD’HUI', 'Trois besoins, plusieurs fournisseurs.'],
    ['02 / SIMULER', 'Choisir les ressources, estimer le mois.'],
    ['03 / ORGANISER LES ACCÈS', 'Une entrée publique. Des données privées.'],
    ['04 / DÉPLOYER', 'bige-ops installe l’application sur ta cible.'],
    ['05 / MIGRER', 'bige-ops transfère les données, puis les fichiers.'],
    ['06 / EXPLOITER', 'Déployer, sauvegarder, redémarrer depuis l’app.']
  ];
  let frame = 0;
  let lastStep = -1;
  function render() {
    frame = 0;
    sequence.classList.toggle('is-enhanced', eligibility.matches);
    if (!eligibility.matches) return;
    const line = innerHeight * .85;
    const rects = steps.map(step => step.querySelector("h2").getBoundingClientRect());
    let current = 0;
    rects.forEach((rect, index) => { if (rect.top <= line) current = index; });
    const rect = rects[current];
    const progress = clamp((line - rect.top) / Math.max(1, innerHeight * .55));
    const t = change(progress);
    const previous = Math.max(0, current - 1);
    const phase = current === 0 ? 0 : previous + t;
    sequence.dataset.phase = String(current);
    if (lastStep !== current && status) {
      status.querySelector('span').textContent = explanations[current][0];
      status.querySelector('strong').textContent = explanations[current][1];
      lastStep = current;
    }
    const set = (name, value) => sequence.style.setProperty(`--seq-${name}`, String(value));
    set('gather', clamp(phase));
    set('source-opacity', 1 - clamp(phase));
    set('target-opacity', clamp(phase));
    set('network', clamp(phase - 1));
    set('estimate', clamp(phase) * (1 - clamp(phase - 1)));
    set('live', clamp(phase - 2));
    set('operation', clamp(phase - 2));
    const operation = sequence.querySelector('.sequence-operation');
    const operationMessages = current === 3
      ? ['bige-ops déploie', t < .95 ? 'Construction → installation' : 'Application installée']
      : current === 4
      ? ['bige-ops transfère', progress < .4 ? 'Copie de la base' : progress < .7 ? 'Copie des fichiers' : 'Transfert terminé · exemple']
      : ['Depuis bige-ops', 'Déployer · sauvegarder · redémarrer'];
    if (operation.dataset.message !== operationMessages.join("|")) {
    operation.dataset.message = operationMessages.join("|");
    operation.replaceChildren();
    const label = document.createElement('strong');
    const detail = document.createElement('span');
    label.textContent = operationMessages[0];
    detail.textContent = operationMessages[1];
    operation.append(label, detail);
    }
    set('source-retained', clamp(phase - 3));
    const transfer = current < 4 ? 0 : current > 4 ? 1 : change(progress);
    set('transfer', transfer);
    set('transfer-opacity', current === 4 ? 1 : current === 5 ? 1 - t : 0);
    objects.forEach((object, index) => {
      let motion = t;
      // First the database, then the object storage. Never swap these objects.
      if (current === 4 && index === 1) motion = ease((progress - .1) / .3);
      if (current === 4 && index === 2) motion = ease((progress - .4) / .3);
      const start = poses[previous][index];
      const end = poses[current][index];
      object.style.left = `${start[0] + (end[0] - start[0]) * motion}%`;
      object.style.top = `${start[1] + (end[1] - start[1]) * motion}%`;
    });
  }
  function requestRender() { if (!frame) frame = requestAnimationFrame(render); }
  addEventListener('scroll', requestRender, { passive: true });
  addEventListener('resize', requestRender, { passive: true });
  eligibility.addEventListener('change', requestRender);
  render();
})();
