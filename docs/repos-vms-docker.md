# Repos, VMs & Dockerfiles

- **Config-history** (`*-infra`) : la simulation — **commits / push via l’app** (GitHub).
- **Repo applicatif** : code cloné au deploy — bige-ops n’y commite pas.
- **VM** Outscale (ce que beaucoup appellent un VPS) : exécution après apply ; mono-VM / multi-VM.
- **Dockerfile** : dans le repo app **ou** chemin imposé par `service_config.*.git.dockerfile`.
- Si le build ou le deploy échoue → vérifier d’abord le setup Dockerfile (path, contexte) du repo app.

HTML : [repos-vms-docker.html](https://bige.dev/repos-vms-docker.html)
