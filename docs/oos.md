# OOS & backups

**OOS** = Object Storage Outscale (S3-compatible). Bucket + lien backup DB + scripts générés pour **bien démarrer** — PRA / rétention = vous.

```mermaid
flowchart LR
  DB[(DB)] -->|backup.enabled| B[backup.sh]
  B --> OOS[(OOS bucket)]
  VOL[Volume / snapshot] -.-> DB
```

Déclarer `oos_bucket`, `generate` → Terraform endpoint régional, apply sur votre compte. Secrets AK/SK hors `project.yaml`.

HTML : [oos.html](https://simondelamarre.github.io/bige-ops-releases/oos.html)


## Ne pas détruire un OOS non vide

bige-ops **ne détruit pas** un bucket qui a des objects — prevent ; purge manuelle via interfaces Outscale.
