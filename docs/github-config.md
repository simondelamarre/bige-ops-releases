# GitHub config-history

- Créer projet → **nouveau repo** GitHub privé `*-infra`
- Créer simulation → branche **`sim/<id>`**
- Promote → **`main`** (live)
- **Deploy** via l’**app** + **sync GitHub** (autres Git = **WIP**)
- Rollback cloud = snapshot local + plan/apply ; rollback Git = **manuel sur GitHub** si problème

## Branches : cool / imparfait

Cool : une sim = une branche ; `main` = vérité déployable ; historique auditable.  
Imparfait : pas GitOps one-click ; pas GitLab/etc. ; en cas de sync foireux → GitHub puis resync / plan / apply.

```mermaid
flowchart LR
  P[Projet] --> R[Repo GitHub]
  R --> S[sim/…]
  S --> M[main]
  M --> D[deploy via app]
```

HTML : [github-config.html](https://bige.dev/github-config.html)

Mode expert (fichiers, diffs, commits) : [expert-config.html](https://bige.dev/expert-config.html)

Repos app · VMs · Dockerfiles : [repos-vms-docker.html](https://bige.dev/repos-vms-docker.html)
