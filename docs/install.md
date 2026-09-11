# Installer & mettre à jour

App desktop locale et gratuite, version **0.3.0**. Distribution via GitHub Releases : [simondelamarre/bige-ops-releases](https://github.com/simondelamarre/bige-ops-releases).

**Plateformes :** macOS (DMG ou cask) et Linux. **Windows : non supporté** aujourd’hui.

```
brew tap simondelamarre/bige-ops
brew install --cask bige-ops
```

**Mises à jour :** l’app *vérifie* s’il existe une version plus récente via `latest.json`, mais **ne s’installe pas toute seule**. Vous remplacez le DMG, ou `brew upgrade --cask bige-ops`.

**CLI embarquée :** le binaire `bige-ops` est packagé dans l’app ; Settings signale une CLI introuvable ou désalignée.

**Dépendances :** écran de diagnostic pour CLI embarquée, Terraform (plan/apply), oks-cli + kubectl (OKS), Docker/SSH (deploy applicatif).

Premier lancement : choisir un workspace local, puis créer un compte Outscale — ou rester en mode projection sans credentials.

Beta démo : bugs et manques → [issues](https://github.com/simondelamarre/bige-ops-releases/issues).

HTML : [install.html](https://bige.dev/install.html)
