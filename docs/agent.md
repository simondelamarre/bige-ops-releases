# Assistant IA (agent)

Chat intégré sur la **config** de la simulation. Modèle : **Claude Sonnet 4.5**. Clé API : **la vôtre** (Settings, local). Pas de backend bige-ops.

**Il peut :** sims, contexte, estimate, fichiers, patch `project.yaml`, stacks, CLI lecture (`validate`, `generate`, `estimate`, `status`…), doc, Dockerfile + PR.

**MCP local :** `bige-ops mcp` (stdio) pour Cursor / Claude Code — Settings → Agents / MCP. Même garde-fous.

**Traces :** `chats/traces/*.jsonl` (hors repo).

**Il ne fait jamais :** `apply`, `deploy`, `github push`, `auth login/logout`, `import selection`, `init --force`. Pas de secrets. Pas de recettes Ingress / cert-manager — HTTPS via ORN EIM dans `project.yaml`.

**Warn :** co-pilote, pas opérateur cloud. Relisez avant `plan` / `apply`.

HTML : [agent.html](https://bige.dev/agent.html)
