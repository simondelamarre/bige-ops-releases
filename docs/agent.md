# Assistant IA (agent)

Chat intégré sur la **config** de la simulation. Modèle par défaut : **Claude Sonnet 4.5** ; aussi OpenAI, Gemini ou Mistral. Clé API : **la tienne** (Settings, en local). Pas de backend bige-ops.

**Il peut :** simulations, contexte, estimation, fichiers, patch `project.yaml`, stacks, CLI en lecture (`validate`, `generate`, `estimate`, `status`…), doc, Dockerfile + PR.

**Audit approfondi des failles (option, bige-ops advanced) :** avec ta propre clé d’IA, un agent relit les pistes que bige-ops a repérées sur ton poste (pages ou API accessibles sans être connecté, code à risque, pièges du framework), confirme les vraies failles, écarte les fausses alertes et classe chacune par type de faille, selon le catalogue de référence (CWE), avec son urgence (P0 à P3). Chaque faille peut devenir un ticket GitHub que tu ouvres toi-même. Seuls des extraits ciblés de ton code partent chez le fournisseur d’IA ; rien n’est appliqué, aucun secret n’est lu.

**MCP local :** `bige-ops mcp` (stdio) pour Cursor / Claude Code — Settings → Agents / MCP. Mêmes garde-fous.

**Traces :** `chats/traces/*.jsonl` (hors repo).

**Il ne fait jamais :** `apply`, `deploy`, `github push`, `auth login/logout`, `import selection`, `init --force`. Pas de secrets. HTTPS : ORN du certificat serveur EIM dans `project.yaml` (listener LBU ou `expose.tls` OKS).

**Bon usage :** co-pilote de configuration — relis avant `plan` / `apply`.

HTML : [agent.html](https://bige.dev/agent.html)
