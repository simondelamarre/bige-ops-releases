# CLI · app · OKS

- **App desktop** = chemin nominal (Visual / Workspace).
- **`bige-ops` CLI** = même moteur (l’app l’appelle ; aussi scriptable).
- **OKS** : oui, via CLI sous le capot — `oks-cli` (cluster) + `kubectl` (manifests `oks/apps/`).
- Pas « terminal-first » : kickoff dans l’app, outils kube disponibles après generate/apply.

HTML : [cli.html](https://simondelamarre.github.io/bige-ops-releases/cli.html)
