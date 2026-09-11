# Secrets, coffre & credentials

**Pas de vault SaaS bige-ops**, aucun backend à nous. Tout est local ; après deploy, les secrets d’exécution vivent côté Outscale / vos VMs.

Où vit quoi :

| Fichier | Contenu |
| --- | --- |
| `accounts/<id>/credentials.local.json` | credentials Outscale du compte (recommandé) |
| `bige-ops/credentials.local.json` | credentials propres à une simulation |
| `credentials.default.json` | credentials partagés (legacy workspace) |
| `bige-ops/vault.local.json` | secrets applicatifs — le « Coffre » |
| `bige-ops/.env` | généré depuis le coffre pour le deploy |
| `bige-ops/terraform/terraform.tfvars` | clés API + `image_id` |
| `bige-ops/**/*.pem` | clés SSH du module keypair |
| `bige-ops/kubeconfigs/` | kubeconfigs OKS |
| `bige-ops/.state/` | hosts.json, statut de deploy, snapshots |
| `~/.config/bige-ops/settings.json` | token GitHub, clé API Anthropic, chemin du workspace |

**Jamais pushé sur le config-history :** credentials, `vault.local.json`, `.env`, `terraform.tfvars`, `*.pem`, `tfstate`, inventaire, `.app-src/`, `.state/`. Le reste de `bige-ops/` est versionné.

`build.secrets` = secrets de build des images Docker, injectés au deploy depuis le coffre.

**Warn :** vos secrets = votre responsabilité. Chiffrez le disque, verrouillez la session. Si vous avez déjà un vault d’entreprise, utilisez-le en dehors de bige-ops.

```mermaid
flowchart LR
  V[Coffre local] --> E[.env]
  E --> D[Deploy VM]
  V -.exclu.-> G[config-history]
```

HTML : [secrets.html](https://bige.dev/secrets.html)
