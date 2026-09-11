# Repos, VMs & Dockerfiles

- **Config-history** (`*-infra`) : blueprint stack — **commits / push via l’app** (GitHub).
- **Repo applicatif** : code cloné au deploy — **pas de commit bige-ops** pour le moment.
- **VMs** : runtime Docker Compose après apply/deploy.
- **Dockerfile** : dans le repo app **ou** override `service_config.*.git.dockerfile`.
- Si ça casse au build/deploy → en général mauvais setup Dockerfile (path / contexte) sur un repo pris en charge.
- **Review lecture / écriture sous container Docker : WIP** (pas encore de revue interactive complète du FS container).

HTML : [repos-vms-docker.html](https://simondelamarre.github.io/bige-ops-releases/repos-vms-docker.html)
