# Phoenix + PostgreSQL sur Outscale

Phoenix et LiveView tiennent énormément de connexions temps réel sur peu de machines, et Oban fait de PostgreSQL ta file de jobs. bige-ops pose ta release sur Outscale derrière un LBU, PostgreSQL en subnet privé, et chiffre l’ensemble.

**En bref.** Topologie multi-vm : VM app tinav6.c4r8p2 (release Phoenix, port 4000) derrière un LBU, PostgreSQL 17 privé, backups OOS, NAT. Estimation bige-ops : **368,30 € HT/mois**.

## Pourquoi cette stack tourne bien sur Outscale

- **Des bases rapides et stables** : Les volumes io1 garantissent jusqu’à 13 000 IOPS par volume : tes requêtes gardent des temps de réponse réguliers, même sous charge. [Volumes](https://docs.outscale.com/en/userguide/About-Volumes.html)
- **Un réseau privé et des sauvegardes sûres** : Tes bases restent dans le réseau privé de ton projet, jamais exposées à Internet. Les sauvegardes partent vers l’Object Storage, compatible S3 et répliqué entre plusieurs zones.
- **Prêt pour les clients exigeants** : Régions qualifiées SecNumCloud 3.2 pour le secteur public, certification HDS pour la santé. [Pourquoi Outscale](pourquoi-outscale.html) · [SecNumCloud 3.2](https://www.3ds.com/newsroom/press-releases/outscale-first-cloud-qualified-secnumcloud-32)

## Architecture

VM app tinav6.c4r8p2 (release Phoenix :4000 + Oban) derrière LBU ; PostgreSQL 17 privé ; OOS backups ; NAT.

## Coût mensuel estimé

Calculé avec bige-ops estimate --json sur le catalogue public Outscale synchronisé le 17 septembre 2026, Région eu-west-2, en € HT par mois (730 heures). Estimation indicative, sur la grille publique ; le trafic sortant est à 0 € HT au catalogue public de cette Région.

| Ligne bige-ops | Ce que c’est | € HT / mois |
| --- | --- | --- |
| LBU app-web | entrée publique (HTTP + WebSocket) | 21,90 € |
| OOS phoenix-app-backups — 50 GiB | sauvegardes PostgreSQL | 1,25 € |
| VM app-app — tinav6.c4r8p2 | release Phoenix + Oban | 135,80 € |
| VM app-postgres — tinav6.c4r8p2 | PostgreSQL 17, disque io1 | 169,20 € |
| NAT gateway | sortie du subnet privé | 36,50 € |
| EIP VM app-app (attachée — 1ʳᵉ offerte / Net) | IP de la VM app (1ʳᵉ offerte) | 0,00 € |
| EIP NAT (attachée supplémentaire) | IP publique du NAT | 3,65 € |
| **Total estimé** | | **368,30 €** |



```
bige-ops init -n stack-phoenix-postgresql
bige-ops add layout custom --name app --runtime elixir --web none --no-worker --db postgres --topology multi-vm --lbu
bige-ops validate
bige-ops estimate --json
```

```yaml
name: stack-phoenix-postgresql
region: eu-west-2
enable_nat: true
components:
- type: stack
  name: app
  topology: multi-vm
  services: [api, postgres]
  images: {postgres: 'postgres:17'}
  sizing: {app_vm: tinav6.c4r8p2, postgres_vm: tinav6.c4r8p2}
  service_config:
    postgres:
      backup: {enabled: true, oos_bucket: phoenix-app-backups}
- type: load_balancer
  name: app-web
  scheme: internet-facing
  backend_vms: [app-app]
- {type: oos_bucket, name: phoenix-app-backups, bucket: phoenix-app-backups, size: 50, purpose: backups}
```

## Données

| Base | Image épinglée | Backup | Failles connues |
| --- | --- | --- | --- |
| PostgreSQL | `postgres:17` | pg_dump → gzip → bucket OOS | [OpenCVE](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) |

**PostgreSQL.** PostgreSQL 18 (supporté jusqu’en novembre 2030), 17 (novembre 2029), 16 (défaut bige-ops, novembre 2028) et 15 (novembre 2027) sont maintenus ; 14 sort du support le 12 novembre 2026. La simulation épingle postgres:17. Source : politique de versions PostgreSQL. Durcissement : un rôle applicatif dédié (jamais le superutilisateur), des règles pg_hba.conf limitées au CIDR du Net en scram-sha-256, et des mises à jour mineures régulières (la majeure reste celle que tu épingles).

Backup activé (`backup.enabled` + bucket OOS protégé) ; `backup.sh` préparé.

## Exposition

- Seule entrée publique : le LBU internet-facing, listener HTTPS 443 + certificat EIM
- VM app en subnet public, ports applicatifs ouverts au seul CIDR du Net (via le LBU)
- Bases en subnet privé, sans IP publique, security group au CIDR du Net ; administration par tunnel SSH
- Security group de la VM app : SSH, 80 et 443 ouverts ; resserre SSH sur tes CIDR connus, app sur un port applicatif (3000, 8000, 8080…)
- NAT : sortie du subnet privé, aucune entrée

## Vulnérabilités

Des failles, il y en aura toujours : l’important est de voir d’abord celles qui sont exposées. Avec ta clé OpenCVE, bige-ops compare les composants de ta stack, images de tes Dockerfile et docker-compose comprises, au registre mondial des vulnérabilités (CVE), puis classe tout par urgence, l’exposé à Internet d’abord. Pourquoi le refaire toi-même ? C’est chez toi, sur ton poste, et c’est gratuit.

Avec ta clé OpenCVE, chaque composant reconnu (image, paquet installé) est rapproché de sa fiche éditeur/produit (une requête par produit). Classement : gravité notée sur 10 (CVSS), au moins haute si la faille est déjà exploitée (liste KEV de la CISA) ; puis exposition dans la simulation (Internet ou derrière le LBU : gravité pleine ; subnet privé : un cran de moins, sauf faille déjà exploitée) ; départage : déjà exploitée, puis note, puis probabilité d’exploitation (EPSS). Rapprochement au niveau du produit, pas de la version : à recouper avec ta version épinglée ; `latest` signalé comme version non épinglée.

| Composant | Fiche OpenCVE | Dans bige-ops |
| --- | --- | --- |
| PostgreSQL | [PostgreSQL](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) | reconnu automatiquement depuis l’image postgres:17 · exposition : privée |
| Elixir, Erlang/OTP, Phoenix | [Elixir](https://app.opencve.io/cve/?vendor=elixir-lang&product=elixir) · [Erlang/OTP](https://app.opencve.io/cve/?vendor=erlang&product=otp) · [Phoenix](https://app.opencve.io/cve/?vendor=phoenixframework&product=phoenix) | fiche de référence (pas encore reconnu automatiquement) |

L’analyse du code Elixir arrive ; ta stack est déjà couverte : PostgreSQL et les images de tes Dockerfile et docker-compose comparés aux failles connues avec OpenCVE, exposition et coût. Détail : Elixir et Phoenix sur Outscale.

## Avant le deploy

- `validate` (services custom, HTTPS sans ORN EIM refusé, rappel NAT pour les VMs privées)
- `preflight` : clés Outscale, OMI, stack, IP des hôtes, Dockerfile, secrets build/runtime, jeton GitHub, alerte backup OOS ; une erreur bloque le deploy
- `plan` : Terraform, risques de perte de données ; buckets OOS protégés
- Vulnérabilités : failles connues des composants (OpenCVE) classées selon leur exposition, `latest` signalé, dépôts relus sur ton poste, sans clé ni IA

## OpenCVE, la source des failles connues

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : les failles publiées dans le registre mondial des vulnérabilités (CVE) et ses sources (NVD, MITRE, liste KEV des failles déjà exploitées tenue par la CISA…), avec leur note de gravité sur 10 (CVSS) et leur probabilité d’être exploitées (EPSS), rangées par éditeur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

Docs : [Phoenix](https://hexdocs.pm/phoenix/overview.html) · [Déployer Phoenix](https://hexdocs.pm/phoenix/deployment.html) · [mix release](https://hexdocs.pm/mix/Mix.Tasks.Release.html) · [PostgreSQL](https://www.postgresql.org/docs/)

HTML : [stack-phoenix-postgresql.html](https://bige.dev/stack-phoenix-postgresql.html)
