<p align="center">
  <img src="docs/bige-ops-three-clicks.png" alt="bige-ops — dessiner, projeter, déployer" width="920" />
</p>

<h1 align="center">LESS IS MORE</h1>

<p align="center">
  <strong>App desktop gratuite — déployer sans te noyer</strong><br/>
  L’outil déploie. Le cloud héberge. Pas de plan de contrôle SaaS.<br/>
  <em>Outscale live · Scaleway, OVH, AWS, Azure, GCP, Fly… bientôt</em>
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
  <a href="https://bige.dev/#clouds">clouds</a> ·
  <a href="https://bige.dev/#features">features</a> ·
  <a href="https://bige.dev/#ecoute">écoute</a> ·
  <a href="https://bige.dev/install.html">install</a>
</p>

---

## Pourquoi

Dessine, projette le €, déploie — sans te noyer dans Terraform à la main.

### Less is more.

Une app desktop gratuite pour déployer sans te noyer.

Tu dessines ta stack — VMs ou Kubernetes — tu projettes le €, puis tu déploies sur ton compte. Terraform / YAML sortent derrière.

→ [bige.dev/#why-less](https://bige.dev/#why-less)

### L’outil déploie. Le cloud héberge.

Pas un Docker sur ton poste. bige-ops tourne sur ta machine ; la stack vit sur ton cloud. Secrets en local.

→ [secrets](https://bige.dev/secrets.html)

### Clouds

**Aujourd’hui :** Outscale (régions + SecNumCloud) — pricing, apply, OKS.

**En cours :** Scaleway, OVHcloud, AWS, Azure, GCP, Fly.io — listés dans l’app, pas encore materialization / pricing complets.

→ [bige.dev/#clouds](https://bige.dev/#clouds)

### Tu peux commencer sans compte.

Projection offline. Login seulement pour inventaire / plan / apply.

→ [install](https://bige.dev/install.html)

### Vulns · clés LLM · issues

Scan repos / CVE (suite crédits) · tes clés LLM (BYOK) · [ouvrir une issue](https://github.com/simondelamarre/bige-ops-releases/issues/new/choose) — détail sur [bige.dev](https://bige.dev/).

---

## En bref

| | |
|---|---|
| Prix | **Gratuit** — la facture cloud reste la tienne |
| Outil | Sur **ta machine** |
| Stack | Sur **ton cloud** |
| Live | **Outscale** (+ SecNumCloud) |
| Bientôt | Scaleway · OVH · AWS · Azure · GCP · Fly |

---

## Nouveautés 0.6

**Vulns & OpenCVE** — scan repos, risques exposés, CVE via [OpenCVE](https://www.opencve.io/), rapports MD/PDF. Open source, pas un produit sécurité SaaS.

**Agent (WIP)** — copilote config (vos clés) · MCP local Cursor/Claude · traces JSONL. Jamais apply / secrets. Encore WIP.

**App & CLI**
- Terminal PTY · Live VMs/pods · inventaire (status, destroy vérifié, forget)
- OKS scale H/V + HPA · HTTPS via ORN EIM
- Tarifs : sync catalogue OAPI · formulaires VM par cloud · Fly (WIP)
- Fixes divers : Visual (drag, nodes, confirm), Hub clouds, estimate persist, sim delete/init

Issues : [bige-ops-releases](https://github.com/simondelamarre/bige-ops-releases/issues).

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

Issues / feedback : [ouvrir une issue](https://github.com/simondelamarre/bige-ops-releases/issues/new/choose).

<p align="center">
  <a href="https://github.com/simondelamarre/bige-ops-releases/releases/latest"><img src="https://img.shields.io/badge/⬇%20Download%20macOS-FREE-0ea5a4?style=for-the-badge&logo=apple&logoColor=white" alt="Download macOS — free" height="52" /></a>
  &nbsp;
  <a href="https://github.com/simondelamarre/bige-ops-releases/releases/latest"><img src="https://img.shields.io/badge/⬇%20Download%20Linux-FREE-1f2937?style=for-the-badge&logo=linux&logoColor=white" alt="Download Linux — free" height="52" /></a>
</p>
