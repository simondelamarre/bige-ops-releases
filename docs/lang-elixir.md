# Elixir et Phoenix sur Outscale

Phoenix et LiveView donnent du temps réel sans JavaScript à écrire, sur la machine virtuelle Erlang qui tient des millions de connexions. bige-ops pose ta release Phoenix sur Outscale avec PostgreSQL en subnet privé et la chiffre au catalogue public.

**En bref.** Runtime elixir dans bige-ops : port 4000, 512 MiB, MIX_ENV=prod, image construite avec mix release. Layout prêt à l’emploi : elixir-phoenix.

## Frameworks et bibliothèques

- **Phoenix et LiveView** : Le framework web d’Elixir : routeur, contrôleurs, channels, et LiveView pour des interfaces temps réel rendues côté serveur. ([doc](https://hexdocs.pm/phoenix/overview.html) · [OpenCVE](https://app.opencve.io/cve/?vendor=phoenixframework&product=phoenix))
- **Ecto** : La couche données : schémas, changesets, requêtes composables, migrations ; PostgreSQL en premier lieu. ([doc](https://hexdocs.pm/ecto/Ecto.html) · [OpenCVE](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql))
- **Oban** : Les jobs de fond persistés dans PostgreSQL : pas de broker en plus, la base fait la file. ([doc](https://hexdocs.pm/oban/Oban.html))
- **Erlang/OTP et mix release** : mix release produit une release autonome (runtime Erlang inclus), idéale dans une image Docker légère. Voir aussi Phoenix et les releases. ([doc](https://hexdocs.pm/mix/Mix.Tasks.Release.html) · [OpenCVE](https://app.opencve.io/cve/?vendor=elixir-lang&product=elixir) · [OpenCVE](https://app.opencve.io/cve/?vendor=erlang&product=otp))

## Sur Outscale avec bige-ops

Le runtime elixir de bige-ops expose Phoenix sur le port 4000 avec 512 MiB et MIX_ENV=prod. Ton Dockerfile construit la release (mix release) ; le LBU termine le TLS et parle HTTP à Phoenix.

- `single-vm` : une VM publique, apps + bases en Docker Compose (prototype, démo).
- `multi-vm` : VM app derrière un LBU, une VM privée par base, NAT pour la sortie (production lisible).
- `oks` : cluster OKS, un Deployment par service, Service LoadBalancer → LBU (scale, microservices, HPA).

```
bige-ops add layout elixir-phoenix --name live
# ou sur mesure :
bige-ops add layout custom --runtime elixir --web none --no-worker \
  --db postgres --topology multi-vm --lbu
```

## Ce que bige-ops vérifie pour Elixir

Des failles, il y en aura toujours : l’important est de voir d’abord celles qui sont exposées. L’analyse du code Elixir arrive ; ta stack est déjà couverte : avec ta clé OpenCVE, ses composants et ses images (y compris celles de tes Dockerfile et docker-compose) sont comparés aux failles connues publiées dans le registre mondial des vulnérabilités (CVE) ; l’exposition dans la simulation et le coût sur Outscale sont calculés à côté. Références : [Elixir sur OpenCVE](https://app.opencve.io/cve/?vendor=elixir-lang&product=elixir) · [Erlang/OTP sur OpenCVE](https://app.opencve.io/cve/?vendor=erlang&product=otp) · [Phoenix sur OpenCVE](https://app.opencve.io/cve/?vendor=phoenixframework&product=phoenix).

Tout est classé par urgence : ce qui est exposé à Internet d’abord. Pourquoi le refaire toi-même ? C’est chez toi, sur ton poste, et c’est gratuit. Méthode complète : [ce que bige-ops vérifie](https://bige.dev/stacks.html#verifications).

## Bases de données

- **PostgreSQL** : Ecto, Oban (files de jobs). [OpenCVE](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) — [Phoenix + PostgreSQL](https://bige.dev/stack-phoenix-postgresql.html)
- **Redis** : PubSub ou cache selon tes besoins. [OpenCVE](https://app.opencve.io/cve/?vendor=redis&product=redis)

Jamais de base exposée à Internet : subnet privé + security group au CIDR du Net (multi-VM), Service interne (OKS).

## Versions à épingler

Épingle Elixir et Erlang/OTP dans l’image de build (les images officielles elixir et hexpm/elixir les combinent) et la version de Phoenix dans mix.lock. Docs : Elixir · Erlang/OTP · Failles connues : Elixir sur OpenCVE · Erlang/OTP sur OpenCVE.

## OpenCVE, la source des failles connues

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : les failles publiées dans le registre mondial des vulnérabilités (CVE) et ses sources (NVD, MITRE, liste KEV des failles déjà exploitées tenue par la CISA…), avec leur note de gravité sur 10 (CVSS) et leur probabilité d’être exploitées (EPSS), rangées par éditeur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

## Stacks chiffrées

- [Phoenix + PostgreSQL](https://bige.dev/stack-phoenix-postgresql.html) (368,30 € HT/mois)

Docs : [Elixir](https://elixir-lang.org/docs.html) · [Phoenix](https://hexdocs.pm/phoenix/overview.html) · [Déployer Phoenix](https://hexdocs.pm/phoenix/deployment.html) · [Ecto](https://hexdocs.pm/ecto/Ecto.html) · [Oban](https://hexdocs.pm/oban/Oban.html)

HTML : [lang-elixir.html](https://bige.dev/lang-elixir.html)
