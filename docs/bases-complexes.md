# Bases complexes

MongoDB 8, Postgres pour le RAG, Cassandra, Elasticsearch : simples à démarrer sur Outscale, avec des images publiques officielles, ton compte et tes clés.

| Base | Prêt aujourd’hui | Prochaine étape |
|------|-------------|------------------|
| MongoDB 8 | catalogue, réplicas de pods, backup OOS | preset replica set multi-nœuds |
| Postgres | volume, OKS, OOS | extensions RAG (pgvector) en un prompt |
| Cassandra | custom + sizing | preset distribué dédié |
| Elasticsearch | custom OKS guidé par l’agent | presets nœuds gourmands |
| Autres | pattern custom | patterns catalogués |

Réplicas de pods ≠ replica set MongoDB (un primaire, des secondaires).

HTML : [bases-complexes.html](https://bige.dev/bases-complexes.html)
