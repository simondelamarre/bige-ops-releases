# Ce que bige-ops sait

Simple comme un PaaS, flexible comme un IaaS : bige-ops est une app desktop gratuite qui simule ta stack, la teste en local, puis la déploie sur **ton** compte Outscale. Elle embarque le catalogue public Outscale, les topologies de référence et tout ce qu’il faut pour générer puis déployer.

- **Topologies** : mono-VM, multi-VM, OKS, avec volumes BSU, Object Storage et LBU. Config et Visual synchronisés par un seul Apply atomique.
- **Estimation** : coût mensuel hors taxes estimé sur le catalogue public Outscale, synchronisable via l’API.
- **Tests en local** : Docker Compose ou Kubernetes local (kind), depuis un brouillon, sans compte cloud.
- **Materialization** : Terraform et manifests Kubernetes générés, plan relu avant apply, puis deploy sur ton compte.
- **Données** : Storage Explorer (S3, R2, OOS) avec migration reprenable ; panneau Données par base : dump, restauration, migration.
- **Analyses** : contrôles avant déploiement, risques sur les données, routes exposées et failles (CWE, CVE avec ta clé OpenCVE) classées par exposition.

**Chez Outscale** : ta facture et tes offres commerciales (l’estimation repose sur la grille publique), et les nouveautés de l’offre, intégrées au fil des versions.

Une suggestion : [ouvre une issue](https://github.com/simondelamarre/bige-ops-releases/issues/new/choose).

HTML : [savoir.html](https://bige.dev/savoir.html)
