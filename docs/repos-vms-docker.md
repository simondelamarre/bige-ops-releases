# Repos, VMs & Dockerfiles

- **Config-history** (`*-infra`) : blueprint simulation — **commits / push via l’app** (GitHub).
- **Repo applicatif** : code cloné au deploy — **pas de commit bige-ops** pour le moment.
- **VM** (= **VPS** au catalogue Outscale) : runtime après apply ; mono-VM / multi-VM.
- **Dockerfile** : dans le repo app **ou** override `service_config.*.git.dockerfile`.
- Si ça casse au build/deploy → en général mauvais setup Dockerfile (path / contexte) sur un repo pris en charge.
- **Review lecture / écriture sous container Docker : WIP**.

HTML : [repos-vms-docker.html](https://bige.dev/repos-vms-docker.html)
