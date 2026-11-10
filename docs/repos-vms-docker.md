# Repos, VMs & Dockerfiles

- **Config-history** (`*-infra`) : la simulation — **commits / push via l’app** (GitHub).
- **Repo applicatif** : code cloné au deploy — bige-ops n’y commite pas.
- **VM** Outscale (ce que beaucoup appellent un VPS) : exécution après apply ; mono-VM / multi-VM.
- **Dockerfile** : dans le repo app **ou** chemin imposé par `service_config.*.git.dockerfile`.
- Si le build ou le deploy échoue → vérifier d’abord le setup Dockerfile (path, contexte) du repo app.

HTML : [repos-vms-docker.html](https://bige.dev/repos-vms-docker.html)

## bige-ops ouvre une pull request, il ne pousse pas sur ta branche

Branche `bige-ops/…`, jamais ta branche de base. Fichiers limités à `Dockerfile`, `.dockerignore`, `.bige-ops/` et `.github/workflows/bige-ops-*.yml`. Les workflows construisent et scannent chaque PR, puis publient après le merge des images épinglées par commit dans ton GHCR privé. Tu relis, tu merges : `bige-ops app open-pr --stack <stack> --title "…"`.
