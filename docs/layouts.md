# Par où commencer ?

Pas besoin d’équipe DevOps. Tu choisis un point de départ selon ton activité, et bige-ops s’occupe du reste : réseau, sauvegardes, HTTPS et déploiement sur ton compte Outscale. Changer de topologie plus tard, c’est une simulation de plus.

| | Pour qui | Ce que tu obtiens | Budget indicatif |
| --- | --- | --- | --- |
| **Une machine** | TPE, outil métier, site, première version d’un produit | Une VM pour l’app et sa base, adresse publique, sauvegardes vers l’Object Storage | à partir de ~75 €/mois |
| **L’app et ses données séparées** | Une activité qui tourne, des clients qui comptent sur toi | App derrière un load balancer, chaque base sur sa VM dans un réseau privé | ~380 €/mois |
| **Kubernetes managé** | Plusieurs services, des pics de charge, une équipe qui grandit | Cluster OKS dédié (3 masters), nœuds qui s’ajustent | ~500 €/mois |

Estimations HT calculées par bige-ops sur la grille publique Outscale (eu-west-2) : machine 2 vCPU / 4 Gio ; app Python + PostgreSQL + Redis ; cluster OKS de trois nœuds 4 vCPU / 6 Gio.

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
