# Par où commencer ?

Pas besoin d’équipe DevOps. Tu choisis un point de départ selon ton activité, et bige-ops s’occupe du reste : réseau, sauvegardes et déploiement sur ton compte Outscale. Changer de topologie plus tard, c’est une simulation de plus.

| | Pour qui | Ce que tu obtiens | Budget indicatif |
| --- | --- | --- | --- |
| **Une machine** | TPE, outil métier, site, première version d’un produit | Une VM pour l’app et sa base, adresse publique, sauvegardes vers l’Object Storage | à partir de ~75 €/mois |
| **L’app et ses données séparées** | Une activité qui tourne, des clients qui comptent sur toi | App derrière un load balancer, chaque base sur sa VM dans un réseau privé | ~380 €/mois |
| **Kubernetes managé** | Plusieurs services, des pics de charge, une équipe qui grandit | Cluster OKS dédié (3 masters), nœuds qui s’ajustent | ~500 €/mois |

Estimations HT calculées par bige-ops sur la grille publique Outscale (eu-west-2) : machine 2 vCPU / 4 Gio ; app Python + PostgreSQL + Redis ; cluster OKS de trois nœuds 4 vCPU / 6 Gio.

## Optimise tes bases à tes usages

Chaque base démarre avec des réglages pensés pour son usage ; tu ajustes ensuite en voyant le coût changer.

| Usage | Ce que bige-ops met en place (app et données séparées) | À ajuster |
| --- | --- | --- |
| Données de l’app (PostgreSQL, MySQL, MariaDB, MongoDB) | VM dédiée en réseau privé, disque io1 à 3 000 IOPS, sauvegarde OOS en un clic | IOPS (100 à 13 000), RAM, rétention |
| Cache et files (Redis) | Petite VM (2 vCPU, 2 Gio), 20 Gio gp2 | RAM |
| Recherche et vecteurs (Weaviate) | VM dédiée sur io1, index en mémoire | RAM |
| Graphes (Neo4j) | VM dédiée sur io1 | RAM, IOPS |
| Pour démarrer (une machine) | Base sur la même machine, sauvegarde OOS | Séparer la base quand elle grossit |

Repère : io1 = 0,13 €/Gio/mois + 0,01 €/IOPS/mois, soit 30 €/mois pour 3 000 IOPS.

**Quand passer à l’étape suivante** : quand une panne de la machine devient un vrai problème pour tes clients ou que ta base grossit ; vers Kubernetes quand tu as plusieurs services ou des pics de charge. Tu dupliques ta simulation, tu changes la topologie et tu compares les coûts.

**bige-ops s’occupe de** : réseau privé et ouvertures, sauvegardes vers l’Object Storage, HTTPS, secrets en coffre local, coût et risques affichés avant chaque déploiement.

**Points de départ prêts à l’emploi** : `node-lite` (une machine), `python-app`, `java-spring`, `php-app`, `go-app`, `elixir-phoenix` (~380 €/mois), `node-app`, `python-ml` (~550 €/mois).

Pour les développeurs :

```
bige-ops add layouts
bige-ops add layout node-app --name mon-app
bige-ops add layout custom --runtime python --db postgres --db redis --web spa --lbu
```

HTML : [layouts.html](https://bige.dev/layouts.html)
