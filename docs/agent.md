# Assistant IA (agent)

Chat intégré sur la **config** de la simulation. Modèle par défaut : **Claude Sonnet 4.5** ; aussi OpenAI, Gemini ou Mistral. Clé API : **la tienne** (Settings, en local). Pas de backend bige-ops.

**Il peut :** simulations, contexte, estimation, fichiers, patch `project.yaml`, stacks, CLI en lecture (`validate`, `generate`, `estimate`, `status`…), doc, Dockerfile + PR.

**MCP local :** `bige-ops mcp` (stdio) pour Cursor / Claude Code — Settings → Agents / MCP. Mêmes garde-fous.

**Traces :** `chats/traces/*.jsonl` (hors repo).

**Il ne fait jamais :** `apply`, `deploy`, `github push`, `auth login/logout`, `import selection`, `init --force`. Pas de secrets. HTTPS : ORN du certificat serveur EIM dans `project.yaml` (listener LBU ou `expose.tls` OKS).

**Bon usage :** co-pilote de configuration — relis avant `plan` / `apply`.

HTML : [agent.html](https://bige.dev/agent.html)
