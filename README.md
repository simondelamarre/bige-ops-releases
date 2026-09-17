<p align="center">
  <img src="docs/bige-ops-three-clicks.png" alt="bige-ops — dessiner, projeter, déployer" width="920" />
</p>

<h1 align="center">LESS IS MORE</h1>

<p align="center">
  <strong>App desktop gratuite pour <a href="https://www.outscale.com/">Outscale</a> &amp; <a href="https://www.outscale.com/fr/secnumcloud/">SecNumCloud</a></strong><br/>
  Une app desktop gratuite pour déployer sans te noyer.<br/>
  <em>L’outil déploie. Le cloud héberge. Pas de plan de contrôle SaaS.</em>
</p>

<p align="center">
  <a href="https://github.com/simondelamarre/bige-ops-releases/releases/latest"><img src="https://img.shields.io/badge/⬇%20Download%20macOS-FREE-0ea5a4?style=for-the-badge&logo=apple&logoColor=white" alt="Download macOS — free" height="52" /></a>
  &nbsp;
  <a href="https://github.com/simondelamarre/bige-ops-releases/releases/latest"><img src="https://img.shields.io/badge/⬇%20Download%20Linux-FREE-1f2937?style=for-the-badge&logo=linux&logoColor=white" alt="Download Linux — free" height="52" /></a>
</p>

<p align="center">
  <code>brew tap simondelamarre/bige-ops && brew install --cask bige-ops</code>
</p>

<p align="center">
  <a href="https://bige.dev/"><strong>bige.dev</strong></a> —
  <a href="https://bige.dev/#pourquoi">pourquoi</a> ·
  <a href="https://bige.dev/#pratique">en pratique</a> ·
  <a href="https://bige.dev/#features">features</a> ·
  <a href="https://bige.dev/#ecoute">écoute</a> ·
  <a href="https://bige.dev/install.html">install</a>
</p>

---

## Pourquoi

Dessine, projette le €, déploie — sans te noyer dans Terraform à la main.

### Less is more.

Une app desktop gratuite pour déployer sans te noyer.

Tu dessines ta stack — VMs ou cluster Kubernetes — tu la projettes, puis tu la déploies sur ton compte. Les fichiers Terraform ou YAML sortent derrière : ce n’est pas ce que tu viens écrire à la main.

→ [bige.dev/#why-less](https://bige.dev/#why-less)

### Outscale & SecNumCloud.

C’est prêt. Le reste vient après.

Aujourd’hui tu peux appliquer et suivre le pricing sur Outscale, y compris SecNumCloud. D’autres clouds arriveront. On ne prétend pas les supporter tous tant que ce n’est pas vrai.

→ [bige.dev/#why-outscale](https://bige.dev/#why-outscale)

### L’outil déploie. Le cloud héberge.

Ce n’est pas un Docker sur ton poste.

bige-ops tourne sur ta machine pour piloter le déploiement. Ta stack, elle, vit sur ton cloud. Tes secrets restent chez toi — coffre local, avec sync optionnelle vers GitHub, HashiCorp Vault ou Fly si tu le veux.

→ [secrets](https://bige.dev/secrets.html) · [bige.dev/#why-deploy](https://bige.dev/#why-deploy)

### Tu peux commencer sans compte.

Tu projettes d’abord. Tu te connectes quand tu appliques.

Sans identifiants Outscale, tu explores et tu projettes. Tu te connectes seulement pour l’inventaire, le plan et l’apply — quand tu es prêt.

→ [install](https://bige.dev/install.html) · [bige.dev/#why-projection](https://bige.dev/#why-projection)

### Vulns et risques.

On regarde tes repos, pas seulement un dashboard.

Déployer reste gratuit. Scanner tes dépôts, voir les CVE et remédier, c’est la suite — et c’est là que les crédits entrent.

→ [bige.dev/#why-vulns](https://bige.dev/#why-vulns)

### Tes clés LLM.

Les tiennes. Rien n’est gardé chez nous.

Tu branches ta propre clé — Anthropic, OpenAI, Google Gemini, Mistral. Les appels partent de ton poste vers le fournisseur. bige-ops ne stocke pas et ne réutilise pas ces échanges.

→ [agent](https://bige.dev/agent.html) · [bige.dev/#why-byok](https://bige.dev/#why-byok)

### On t’écoute.

Un bug ou une idée : tu l’ouvres sur GitHub.

Le dépôt public reçoit tes issues et tes demandes de features. On les lit, on priorise, on répond — sans toucher à ton graphe ni à tes secrets.

| | |
|---|---|
| Issue | [Ouvrir une issue](https://github.com/simondelamarre/bige-ops-releases/issues/new/choose) |
| Feature | [Demander une feature](https://github.com/simondelamarre/bige-ops-releases/issues/new?template=feature_request.yml) |
| Site | [bige.dev/#why-ecoute](https://bige.dev/#why-ecoute) · [écoute](https://bige.dev/#ecoute) |

---

## En bref

| | |
|---|---|
| Prix | **Gratuit** — la facture cloud reste la tienne |
| Outil | Sur **ta machine** |
| Stack | Sur **ton cloud** |
| Régions Outscale | `eu-west-2` · `cloudgouv-eu-west-1` (**SecNumCloud**) |

Starters : Node / Python / Java / Go / Elixir / PHP × Mongo / Redis / Postgres / Weaviate × VMs et/ou **OKS**. Détail sur [bige.dev](https://bige.dev/).

---

## Nouveautés 0.5

- **Vulns & risques** — scan des repos liés, CVE, rapports MD / PDF
- **Estimate cache** — tarifs locaux quand disponibles (projection d’abord)
- **Logs OKS** — pods via kubectl depuis l’app

**Ensuite :** scan vulns élargi · crédits · autres clouds · CLI à la demande — [features](https://bige.dev/#features).

---

## Installer

| macOS / Linux | [Dernière release — FREE](https://github.com/simondelamarre/bige-ops-releases/releases/latest) |
| Homebrew | `brew tap simondelamarre/bige-ops && brew install --cask bige-ops` |

### macOS Gatekeeper (pas notarié)

Après copie dans `/Applications` — **avant** le premier double-clic :

```bash
xattr -cr /Applications/bige-ops.app && codesign --force --deep --sign - /Applications/bige-ops.app
```

Ou **Fix Gatekeeper.command** sur le DMG. Guide : [install.html#gatekeeper](https://bige.dev/install.html#gatekeeper).

Le code source reste privé ; **ce** dépôt public reçoit bugs et features.

**Outscale** · [outscale.com](https://www.outscale.com/) · **SecNumCloud** · [outscale.com/fr/secnumcloud](https://www.outscale.com/fr/secnumcloud/)

<p align="center">
  <a href="https://github.com/simondelamarre/bige-ops-releases/releases/latest"><img src="https://img.shields.io/badge/⬇%20Download%20macOS-FREE-0ea5a4?style=for-the-badge&logo=apple&logoColor=white" alt="Download macOS — free" height="52" /></a>
  &nbsp;
  <a href="https://github.com/simondelamarre/bige-ops-releases/releases/latest"><img src="https://img.shields.io/badge/⬇%20Download%20Linux-FREE-1f2937?style=for-the-badge&logo=linux&logoColor=white" alt="Download Linux — free" height="52" /></a>
</p>
