# GitHub config-history

- Créer projet → **nouveau repo** GitHub privé `*-infra`
- Créer simulation → branche **`sim/<id>`**
- Promote → **`main`** (live)
- Deploy → toujours la vérité **live / main**
- Rollback → snapshot local puis plan/apply (pas undo magique cloud)

```mermaid
flowchart LR
  P[Projet] --> R[Repo]
  R --> S[sim/…]
  S --> M[main]
  M --> D[deploy]
```

HTML : [github-config.html](https://simondelamarre.github.io/bige-ops-releases/github-config.html)

Mode expert (fichiers, diffs, commits) : [expert-config.html](https://simondelamarre.github.io/bige-ops-releases/expert-config.html)
