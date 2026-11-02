# Bases complexes

MongoDB 8, Postgres pour le RAG, Cassandra, Elasticsearch : simples à démarrer sur Outscale, avec des images publiques officielles, ton compte et tes clés.

| Base | Prêt aujourd’hui | Prochaine étape |
|------|-------------|------------------|
| MongoDB 8 | catalogue, replica set de 1, 3 ou 5 membres, backup OOS | arbitre et réglages avancés : ton exploitation |
| Postgres | volume, OKS, OOS, dump / restauration / migration | extensions RAG (pgvector) en un prompt |
| Cassandra | custom + sizing | preset distribué dédié |
| Elasticsearch | custom OKS guidé par l’agent | presets nœuds gourmands |
| Autres | pattern custom | patterns catalogués |

Replica set MongoDB : un membre par VM en multi-VM, StatefulSet sur OKS, initialisé au deploy (un primaire, des secondaires).

HTML : [bases-complexes.html](https://bige.dev/bases-complexes.html)
