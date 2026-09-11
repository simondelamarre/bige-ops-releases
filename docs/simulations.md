# Projets, simulations & promote

Workspace (dossier local) → compte (`accounts/<id>/` = un tenant Outscale, credentials + inventory + `shared.yaml`) → simulations (`accounts/<id>/simulations/<name>/`).

**Live** = `existing/` ou la simulation promue, orientée prod. **Draft** = variante parallèle, ne remplace rien tant qu’on ne fait pas `promote`.

| Commande | Effet |
| --- | --- |
| `simulation promote` | marque live, archive la précédente, snapshot avant par défaut (`--no-snapshot`), `--push-main` pousse sur `main` |
| `simulation snapshot` / `snapshots` / `rollback --snapshot <id>` | filet local sur la **config** (`--dry-run` dispo) |
| `diff config` | diff YAML courant vs snapshot |
| `account list\|add\|show\|shared-add\|shared-list`, `workspace migrate` | gestion comptes / workspace |

Convention Git : live → `main` ; draft ou archivée → `sim/<slug>`.

**Warn :** rollback de la config ≠ rollback du cloud. Côté infra, il faut re-`plan` / re-`apply` (parfois destroy), avec risque de perte de données. Le rollback Git sur GitHub reste manuel.

Voir aussi : [github-config.html](https://bige.dev/github-config.html) · [expert-config.html](https://bige.dev/expert-config.html) · [inventory.html](https://bige.dev/inventory.html)

HTML : [simulations.html](https://bige.dev/simulations.html)
