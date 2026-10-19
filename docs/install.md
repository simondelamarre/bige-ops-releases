# Installer & mettre à jour

bige-ops est une application desktop locale et gratuite, pour macOS (Apple Silicon) et Linux (x86_64). La CLI est incluse.

## macOS : Homebrew

```
brew tap simondelamarre/bige-ops
brew install --cask bige-ops
```

Le cask prépare l’app pour le premier lancement : elle s’ouvre directement. Mise à jour : `brew upgrade --cask bige-ops`.

## Linux : AppImage ou .deb

Depuis la [dernière release](https://github.com/simondelamarre/bige-ops-releases/releases/latest) :

```
chmod +x bige-ops-*-linux-x86_64.AppImage && ./bige-ops-*-linux-x86_64.AppImage
sudo apt install ./bige-ops-*-linux-x86_64.deb
```

**Mises à jour :** l’app vérifie s’il existe une version plus récente via `latest.json` et te le signale.

**CLI embarquée :** le binaire `bige-ops` est packagé dans l’app ; Settings signale une CLI introuvable ou désalignée.

**Dépendances :** écran de diagnostic pour Terraform (plan/apply), oks-cli + kubectl (OKS), Docker/SSH (deploy applicatif).

Premier lancement : choisis un workspace local, puis crée un compte Outscale, ou reste en simulation sans identifiants.

Une question ou une idée : [issues](https://github.com/simondelamarre/bige-ops-releases/issues).

HTML : [install.html](https://bige.dev/install.html)
