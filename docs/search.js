(() => {
  const header = document.querySelector('.global-header');
  if (!header) return;

  const searchIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"></circle><path d="m16 16 5 5"></path></svg>';
  let trigger = header.querySelector('[data-search-open]');
  if (!trigger) {
    trigger = document.createElement('button');
    trigger.type = 'button'; trigger.className = 'search-open'; trigger.dataset.searchOpen = '';
    trigger.setAttribute('aria-label', 'Rechercher sur bige.dev'); trigger.setAttribute('aria-haspopup', 'dialog'); trigger.setAttribute('aria-keyshortcuts', 'Meta+F Control+F'); trigger.title = 'Rechercher (⌘F / Ctrl F)';
    trigger.innerHTML = searchIcon;
  }
  const nav = header.querySelector('nav[aria-label="Navigation principale"]');
  if (nav) {
    if (!nav.id) nav.id = 'site-primary-nav';
    if (!nav.querySelector('a[href*="blog"]')) {
      const link = document.createElement('a'); link.href = location.pathname.startsWith('/blog/') ? '../blog/' : 'blog/'; link.textContent = 'Blog'; nav.append(link);
    }
  }

  const download = header.querySelector('.global-download');
  let actions = header.querySelector('.global-actions');
  if (!actions) {
    actions = document.createElement('div');
    actions.className = 'global-actions';
    header.append(actions);
  }
  if (download && download.parentElement !== actions) actions.append(download);
  if (trigger.parentElement !== actions) actions.append(trigger);

  if (nav) {
    let menuToggle = actions.querySelector('.global-menu-toggle');
    if (!menuToggle) {
      menuToggle = document.createElement('button');
      menuToggle.type = 'button';
      menuToggle.className = 'global-menu-toggle';
      menuToggle.setAttribute('aria-controls', nav.id);
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
      menuToggle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"></path></svg>';
      actions.append(menuToggle);
    }

    const setMenuOpen = (open) => {
      header.classList.toggle('mobile-nav-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    };
    menuToggle.addEventListener('click', () => setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) setMenuOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && header.classList.contains('mobile-nav-open')) setMenuOpen(false);
    });
    header.classList.add('mobile-nav-ready');
  }

  const dialog = document.createElement('dialog');
  dialog.className = 'search-dialog'; dialog.setAttribute('aria-labelledby', 'search-title'); dialog.setAttribute('aria-describedby', 'search-help');
  dialog.innerHTML = `<div class="search-panel"><header><div><p class="search-kicker">BIGE-OPS · RECHERCHE LOCALE</p><h2 id="search-title">Que cherchez-vous ?</h2></div><button class="search-close" type="button" data-search-close aria-label="Fermer la recherche">×</button></header><label class="search-field">${searchIcon}<input type="search" id="site-search-input" placeholder="Ex. migrer des fichiers S3" autocomplete="off" aria-controls="site-search-results"><kbd>ESC</kbd></label><p id="search-help" class="search-help">Rechercher par sujet ou poser une question. Le calcul se fait dans votre navigateur.</p><p id="search-status" class="search-status" role="status" aria-live="polite">Ouvrir la recherche pour charger les contenus.</p><ul id="site-search-results" class="search-results"></ul><footer><span>⌘F / Ctrl F pour ouvrir</span><a href="${location.pathname.startsWith('/blog/') ? '../blog/' : 'blog/'}">Lire le blog ↗</a></footer></div>`;
  document.body.append(dialog);

  const input = dialog.querySelector('#site-search-input');
  const results = dialog.querySelector('#site-search-results');
  const status = dialog.querySelector('#search-status');
  let indexPromise; let modelPromise; let documents = []; let previousFocus = null; let queryId = 0;

  const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const ignoredTerms = new Set(['avec', 'dans', 'depuis', 'des', 'du', 'une', 'les', 'pour', 'sur', 'par', 'comment', 'quoi', 'quel', 'quelle', 'est', 'sont', 'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'the', 'and', 'for', 'from', 'how', 'what']);
  const terms = (value) => normalize(value).split(/[^a-z0-9]+/).filter((word) => word.length > 1 && !ignoredTerms.has(word));
  const technicalTerms = new Set(['api', 'aws', 'cpu', 'cve', 'cwe', 'dns', 'gpu', 'ia', 'llm', 'npm', 'ovh', 'php', 'ram', 'r2', 's3', 'sql', 'ssh', 'tls', 'vm']);
  const matchesIdentifiers = (doc, query) => {
    const identifiers = terms(query).filter((word) => /\d/.test(word) || technicalTerms.has(word));
    if (!identifiers.length) return true;
    const available = new Set(terms(`${doc.title} ${doc.description || ''} ${(doc.snippets || []).join(' ')}`));
    return identifiers.every((word) => available.has(word));
  };
  const snippetMatch = (doc, query) => {
    const queryTerms = terms(query);
    const choices = (doc.snippets || []).map((text) => {
      const words = new Set(terms(text));
      return { text, score: queryTerms.filter((term) => words.has(term)).length / Math.max(1, queryTerms.length) };
    }).sort((a, b) => b.score - a.score);
    const source = choices[0]?.score > 0 ? choices[0].text : (doc.description || '');
    const normalized = normalize(source);
    const phrase = normalize(query);
    let position = phrase.length > 2 ? normalized.indexOf(phrase) : -1;
    if (position < 0) position = queryTerms.map((term) => normalized.indexOf(term)).filter((index) => index >= 0).sort((a, b) => a - b)[0] ?? -1;
    if (position < 0 || source.length <= 280) return source.slice(0, 280);
    const start = Math.max(0, position - 70);
    return `${start ? '…' : ''}${source.slice(start, start + 280)}${start + 280 < source.length ? '…' : ''}`;
  };
  function lexicalScore(doc, query) {
    const queryTerms = terms(query);
    if (!queryTerms.length) return 0;
    const title = normalize(`${doc.title} ${doc.url || ''}`);
    const pageTitleTerms = new Set(terms(doc.pageTitle || ''));
    const description = normalize(doc.description || '');
    const titleTerms = new Set(terms(title));
    const descriptionTerms = new Set(terms(description));
    const metadataCoverage = queryTerms.filter((term) => titleTerms.has(term) || descriptionTerms.has(term)).length / queryTerms.length;
    const pageCoverage = queryTerms.filter((term) => pageTitleTerms.has(term)).length / queryTerms.length;
    const chunkCoverage = Math.max(0, ...(doc.snippets || []).map((snippet) => {
      const snippetTerms = new Set(terms(snippet));
      return queryTerms.filter((term) => snippetTerms.has(term)).length / queryTerms.length;
    }));
    const titleCoverage = queryTerms.filter((term) => titleTerms.has(term)).length / queryTerms.length;
    const phrase = normalize(query).replace(/[^a-z0-9]+/g, ' ').trim();
    const searchablePhrase = normalize(`${title} ${description}`).replace(/[^a-z0-9]+/g, ' ');
    const exactPhrase = phrase.length > 2 && (` ${searchablePhrase} `).includes(` ${phrase} `);
    return metadataCoverage * 0.55 + chunkCoverage * 0.45 + pageCoverage * 0.12 + titleCoverage * 0.4 + (exactPhrase ? 0.72 : 0);
  }
  const cosine = (a, b) => {
    let sum = 0; const n = Math.min(a.length, b.length);
    for (let i = 0; i < n; i++) sum += a[i] * b[i];
    return sum;
  };
  function show(items) {
    results.replaceChildren();
    for (const item of items.slice(0, 8)) {
      const li = document.createElement('li'); const a = document.createElement('a');
      const heading = document.createElement('strong'); heading.textContent = item.title;
      const detail = document.createElement('span');
      const context = item.pageTitle && item.pageTitle !== item.title ? `${item.pageTitle} · ` : '';
      detail.textContent = `${context}${snippetMatch(item, input.value) || item.description || ''}`;
      const url = document.createElement('small'); url.textContent = item.url;
      a.href = item.url; a.append(heading, detail, url); li.append(a); results.append(li);
    }
    if (!items.length) { status.textContent = 'Aucun résultat. Essayez avec un autre mot ou une autre formulation.'; return; }
    const visible = Math.min(items.length, 8);
    status.textContent = items.length > visible ? `Les ${visible} résultats les plus proches.` : `${visible} résultat${visible > 1 ? 's' : ''} pertinent${visible > 1 ? 's' : ''}.`;
  }
  function lexicalSearch(query) {
    if (!terms(query).length) { results.replaceChildren(); status.textContent = 'Saisir un sujet ou une question.'; return []; }
    const ranked = documents.map((doc) => ({ ...doc, score: lexicalScore(doc, query) }))
      .filter((doc) => doc.score > 0 && matchesIdentifiers(doc, query)).sort((a, b) => b.score - a.score);
    show(ranked); return ranked;
  }
  async function loadIndex() {
    if (!indexPromise) indexPromise = fetch('/search-index.json').then((response) => {
      if (!response.ok) throw new Error('Index de recherche indisponible'); return response.json();
    }).then((data) => { documents = data.documents || []; return data; });
    return indexPromise;
  }
  async function loadModel() {
    if (!modelPromise) modelPromise = import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.2').then(({ pipeline }) => pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2'));
    return modelPromise;
  }
  async function semanticSearch(query, currentId) {
    try {
      if (!modelPromise) status.textContent = 'Préparation du moteur sémantique · premier chargement…';
      const [data, extractor] = await Promise.all([loadIndex(), loadModel()]);
      if (currentId !== queryId || !query.trim()) return;
      const output = await extractor(query, { pooling: 'mean', normalize: true });
      if (currentId !== queryId) return;
      const vector = output.data;
      const ranked = data.documents.map((doc) => {
        const semantic = Math.max(...doc.embeddings.map((embedding) => cosine(vector, embedding))) / 127;
        return { ...doc, score: semantic + lexicalScore(doc, query) };
      })
        .filter((doc) => doc.score > 0.24 && matchesIdentifiers(doc, query)).sort((a, b) => b.score - a.score);
      show(ranked);
    } catch (error) {
      if (documents.length) status.textContent = results.childElementCount ? 'Recherche textuelle affichée · moteur sémantique indisponible.' : 'Aucun résultat textuel · moteur sémantique indisponible.';
      else status.textContent = 'Recherche indisponible. Vérifiez la connexion et réessayez.';
    }
  }
  async function open() {
    previousFocus = document.activeElement;
    if (!dialog.open) dialog.showModal();
    input.focus();
    if (!documents.length) {
      status.textContent = 'Chargement des pages et articles…';
      try { await loadIndex(); status.textContent = 'Index prêt. Saisir un sujet ou une question.'; }
      catch { status.textContent = 'Impossible de charger l’index. Vérifiez la connexion et réessayez.'; }
    }
  }
  trigger.addEventListener('click', open);
  dialog.querySelector('[data-search-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => previousFocus?.focus());
  input.addEventListener('input', () => {
    const id = ++queryId; const query = input.value;
    if (!query.trim()) { results.replaceChildren(); status.textContent = 'Saisir un sujet ou une question.'; return; }
    if (documents.length) lexicalSearch(query);
    status.textContent = 'Recherche dans les pages…';
    window.clearTimeout(input._searchTimer);
    input._searchTimer = window.setTimeout(() => semanticSearch(query, id), 250);
  });
  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'f') { event.preventDefault(); open(); }
  });
})();
