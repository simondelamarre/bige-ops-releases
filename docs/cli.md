# CLI · app · OKS

- **App desktop** = chemin nominal (Visual / Workspace / Terminal PTY).
- **`bige-ops` CLI** = même moteur (l’app l’appelle ; aussi scriptable).
- **OKS** : `oks-cli` + `kubectl` sous le capot.
- Pas « terminal-first » : kickoff dans l’app ; outils kube après generate/apply.

## Commandes 0.6

```bash
bige-ops live status [--sample] [--oks]
bige-ops inventory destroy --id … --cascade [--plan|--yes]
bige-ops inventory forget --terminated
bige-ops pricing catalog-sync
bige-ops mcp
```

Doc détaillée : dans l’app (Docs) — `cli/overview`, `cli/live`, `cli/inventory`.

HTML : [cli.html](https://bige.dev/cli.html)
