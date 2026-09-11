# Mode expert · fichiers, diffs & commits

Visual / Flow pour composer. **Mode expert** = édition directe des fichiers de simulation (`project.yaml`, Terraform, OKS…). Puis **diffs** et **commits** sur le config-history — feuille de route des interfaces.

HTML : [expert-config.html](https://bige.dev/expert-config.html)

## Aujourd’hui

Workspace : arbre fichiers + éditeur, Save local, validate / generate / plan. Push config-history via Hub / Workspace. Revue apply = plan TF + risques.

## Cible UI

Diff fichiers unifié, commit intentionnel (message + branche `sim/…` | `main`), lien Flow ↔ fichiers, garde-fous secrets / destroy.

Voir aussi [GitHub config-history](https://bige.dev/github-config.html).
