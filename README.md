<p align="center">
  <img src="docs/screens/hero.png" alt="bige-ops : une stack Kubernetes simulée, ses services et son coût mensuel estimé, avec la commande d’installation" width="920" />
</p>

<h1 align="center">bige-ops</h1>

<p align="center">
  <strong>Ta stack, son prix, avant de déployer.</strong><br/>
  Gratuit. Local. Installé en une commande.
</p>

<p align="center">
  <code>brew install --cask simondelamarre/bige-ops/bige-ops</code>
</p>

<p align="center">
  <!-- macOS DMG download hidden until the app is notarized: install with Homebrew.
  <a href="https://github.com/simondelamarre/bige-ops-releases/releases/latest"><img src="https://img.shields.io/badge/⬇%20Download%20macOS-FREE-0ea5a4?style=for-the-badge&logo=apple&logoColor=white" alt="Download macOS — free" height="52" /></a> -->
  <a href="https://github.com/simondelamarre/bige-ops-releases/releases/latest"><img src="https://img.shields.io/badge/⬇%20Download%20Linux-FREE-1f2937?style=for-the-badge&logo=linux&logoColor=white" alt="Download Linux — free" height="52" /></a>
</p>

<p align="center">
  <a href="https://bige.dev/"><strong>bige.dev</strong></a> ·
  <a href="https://bige.dev/layouts.html">par où commencer</a> ·
  <a href="https://bige.dev/documentation.html">documentation</a> ·
  <a href="https://github.com/simondelamarre/bige-ops-releases/issues/new/choose">une idée ?</a>
</p>

---

## En 3 étapes

1. **Installe.** `brew install --cask simondelamarre/bige-ops/bige-ops` sur macOS, AppImage ou .deb sur Linux.
2. **Simule.** Connecte-toi avec GitHub, pars d’une topologie prête : une machine, app et données séparées, ou Kubernetes.
3. **Décide.** Coût, risques, vulnérabilités. Tu déploies sur ton compte quand tu veux.

## Ce que tu y gagnes

- **Le prix avant la facture.** VMs, Kubernetes, bases, stockage : chaque ligne chiffrée sur la grille publique.
- **La simplicité d’une plateforme, sur ton cloud.** Tu relies ton dépôt, bige-ops déploie. Pas besoin de DevOps.
- **Des bases réglées pour leur usage.** Disque, IOPS, sauvegardes : les bons défauts, ajustables en voyant le coût.
- **Tes failles, par ordre d’urgence.** Il y en aura toujours : bige-ops les affiche et met en tête celles que ta stack expose. Pages ouvertes sans connexion, mots de passe en clair, failles connues de tes bibliothèques. Sur ton poste, sans clé ni IA.
- **L’audit profond en option.** bige-ops advanced lit ton code plus en profondeur avec ta propre clé d’IA, classe chaque faille par type (catalogue CWE) et propose une issue GitHub par problème.
- **La main sur tout.** Outil local, secrets chez toi, infra sur ton compte.

<p align="center">
  <img src="docs/screens/visual-oks.png" alt="Le Visual : une stack Kubernetes avec ses services, ses bases et son coût" width="820" /><br/>
  <em>Le Visual : ta stack, ses services, son coût.</em>
</p>

<p align="center">
  <img src="docs/screens/vulns-sqli.png" alt="Injection SQL réelle détectée dans routes/login.ts d’OWASP Juice Shop, exposée à Internet" width="820" /><br/>
  <em>Une faille réelle dans <a href="https://owasp.org/projects/juice-shop">OWASP Juice Shop</a> : une requête à la base construite avec ce que tape l’utilisateur (injection SQL), exposée à Internet. Vérifiable par tous.</em>
</p>

<p align="center">
  <img src="docs/screens/vulns-deps.png" alt="CVE-2022-25887 sur sanitize-html 1.4.2, avec son lien OpenCVE" width="820" /><br/>
  <em>Une faille connue (CVE-2022-25887) dans la bibliothèque sanitize-html, avec son lien <a href="https://www.opencve.io/">OpenCVE</a>.</em>
</p>

## Comment bige-ops trouve tes failles

1. Il lit le code de tes dépôts, sur ton poste.
2. Il repère les pages et les API que ton app expose, et vérifie qu’elles demandent une connexion.
3. Il cherche les erreurs classiques : mots de passe écrits en clair, requêtes à la base construites avec ce que tape l’utilisateur, API ouverte à n’importe quel site.
4. Il compare tes bibliothèques à la base publique des failles connues ([OSV](https://osv.dev/)) et, avec ta clé [OpenCVE](https://www.opencve.io/), ta stack au registre mondial des failles (CVE).
5. Il classe tout par urgence : ce qui est exposé à Internet d’abord.

**Pourquoi le refaire toi-même ?** C’est chez toi, et c’est gratuit.

## Bientôt : ta conso réelle face à ta simulation

<p align="center">
  <img src="docs/screens/conso.png" alt="Aperçu : coût réel quotidien comparé au budget simulé, avec l’écart expliqué par un nœud ajouté par l’autoscaling" width="820" /><br/>
  <em>Aperçu, données de démonstration. Source réelle : l’API de consommation du cloud.</em>
</p>

## Le cloud

Construit pour [Outscale](https://bige.dev/pourquoi-outscale.html) : cloud souverain français, régions classiques et SecNumCloud.

## Installer

| | |
|---|---|
| **macOS** (Apple Silicon) | `brew install --cask simondelamarre/bige-ops/bige-ops` |
| **Linux** (x86_64) | AppImage ou .deb : [dernière release](https://github.com/simondelamarre/bige-ops-releases/releases/latest) |

Guide complet : [bige.dev/install.html](https://bige.dev/install.html) · Une question : [ouvre une issue](https://github.com/simondelamarre/bige-ops-releases/issues/new/choose).

<!-- Other clouds hidden for now (see ENABLED_PROVIDER_IDS in desktop/src/lib/providers.ts).
Previous copy, to restore with them:
<em>Outscale live · Scaleway, OVH, AWS, Azure, GCP, Fly… bientôt</em>
**En cours :** Scaleway, OVHcloud, AWS, Azure, GCP, Fly.io — listés dans l’app, pas encore materialization / pricing complets.
| Bientôt | Scaleway · OVH · AWS · Azure · GCP · Fly |
- Tarifs : sync catalogue OAPI · formulaires VM par cloud · Fly (WIP)
-->

---

### Installe maintenant. La suite, c’est toi qui choisis.

Ta stack est décrite une fois, dans un format ouvert, versionné dans ton Git. Quand d’autres clouds français arriveront dans bige-ops ([OVHcloud](https://www.ovhcloud.com/fr/), [Scaleway](https://www.scaleway.com/fr/)), tu compareras la même stack, prix à l’appui, et tu migreras si ça vaut le coup. Sans tout réécrire.
