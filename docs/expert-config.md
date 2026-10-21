# Mode expert · fichiers, diffs & commits

Visual / Flow pour composer. **Mode expert** = édition directe de la configuration de simulation. Les deux vues partagent le même modèle canonique et le même bouton **Appliquer**.

HTML : [expert-config.html](https://bige.dev/expert-config.html)

## Aujourd’hui

Workspace : arbre fichiers + éditeur. Tant qu’une édition reste en brouillon, aucun fichier dérivé, push Git ou déploiement n’est déclenché. **Appliquer** exécute une seule transaction locale : réconciliation de `project.yaml`, validation, génération ciblée et relecture du Visual. Une erreur restaure la dernière configuration valide.

Le Visual suit la même règle : les champs et déplacements restent fluides et locaux ; un unique **Appliquer** écrit la configuration canonique. Un avertissement empêche de quitter silencieusement une vue modifiée.

Cette action locale est distincte de **Plan**, **Apply cloud** et **Deploy**. Elle ne crée aucune ressource cloud.

## Cible UI

Diff fichiers unifié, commit intentionnel (message + branche `sim/…` | `main`), lien Flow ↔ fichiers, garde-fous secrets / destroy et détection claire des changements externes concurrents.

Voir aussi [GitHub config-history](https://bige.dev/github-config.html).
