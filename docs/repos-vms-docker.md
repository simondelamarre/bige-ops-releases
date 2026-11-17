# Repos, VMs & Dockerfiles

- **Config-history** (`*-infra`) : la simulation — **commits / push via l’app** (GitHub).
- **Repo applicatif** : code cloné au deploy — bige-ops n’y commite pas.
- **VM** Outscale (ce que beaucoup appellent un VPS) : exécution après apply ; mono-VM / multi-VM.
- **Dockerfile** : dans le repo app **ou** chemin imposé par `service_config.*.git.dockerfile`.
- Si le build ou le deploy échoue → vérifier d’abord le setup Dockerfile (path, contexte) du repo app.

HTML : [repos-vms-docker.html](https://bige.dev/repos-vms-docker.html)

## bige-ops ouvre une pull request, il ne pousse pas sur ta branche

Branche `bige-ops/…`, jamais ta branche de base. Fichiers limités à `Dockerfile`, `.dockerignore`, `.bige-ops/` et `.github/workflows/bige-ops-*.yml`. Les workflows construisent et scannent chaque PR, puis publient après le merge des images épinglées par commit dans ton GHCR privé. Tu relis, tu merges : `bige-ops app open-pr --stack <stack> --title "…"`.

## Préparer une fois, déployer au quotidien

**Préparer le code**, **Préparer CI + GHCR** et **Ouvrir la PR GitHub** installent le Dockerfile et les workflows dans le dépôt applicatif. Une fois la PR fusionnée, le déploiement quotidien se fait depuis Inventaire ou Visual : branche, service, puis build sur la VM ou dans GitHub Actions + GHCR.

Seules les clés déclarées dans `build.secrets` sont envoyées à GitHub Actions et montées par BuildKit. Les secrets runtime — MongoDB, Redis, API — restent dans le coffre bige-ops et ne sont pas nécessaires au build.

Le rollback affiche avant confirmation l’image saine précédente, sa date, sa référence et son commit. L’historique local conserve la version courante et la précédente ; le nettoyage distant de GHCR reste désactivé tant que les références des autres workspaces ne peuvent pas être protégées.

Le scale d’une VM est une opération IaaS : génération et performance CPU, vCPU, RAM, GPU, taille/type du volume et IOPS sont réglés séparément, puis relus dans le plan Terraform. Une réduction de disque ou un plan qui recrée ou détruit une ressource est bloqué.
