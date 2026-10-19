# Python sur Outscale

Django pour les produits complets, FastAPI pour les API et l’IA, Flask pour aller vite : Python couvre le web comme la data. bige-ops le pose sur Outscale, des VMs aux GPU, chiffre la stack et lit tes routes et tes dépendances PyPI.

**En bref.** Runtime python dans bige-ops : port 8000, 512 MiB par défaut, Gunicorn, Uvicorn ou serveur intégré selon ton Dockerfile. Scan : routes Django, FastAPI et Flask, réglages risqués, dépendances PyPI épinglées via OSV.

## Frameworks et bibliothèques

- **Django** : Le framework « batteries incluses » : ORM, admin, auth, migrations. bige-ops lit path(), re_path() et l’ancien url() ; login_required, IsAuthenticated et permission_classes marquent une vue protégée. DEBUG = True est relevé ; les filtres |safe et mark_safe sont préparés pour l’audit approfondi. ([doc](https://docs.djangoproject.com/) · [OpenCVE](https://app.opencve.io/cve/?vendor=djangoproject&product=django))
- **FastAPI** : Les API typées et asynchrones, sur Starlette et Pydantic, servies par Uvicorn. bige-ops lit @app.get(), @router.post() et @app.api_route(). ([doc](https://fastapi.tiangolo.com/) · [OpenCVE](https://app.opencve.io/cve/?vendor=tiangolo&product=fastapi) · [OpenCVE](https://app.opencve.io/cve/?vendor=encode&product=starlette) · [OpenCVE](https://app.opencve.io/cve/?vendor=pydantic&product=pydantic))
- **Flask** : Le micro-framework sur Werkzeug et Jinja. @app.route() et les raccourcis @app.get() sont lus ; les appels eval sont relevés, le mode debug est préparé pour l’audit approfondi. ([doc](https://flask.palletsprojects.com/) · [OpenCVE](https://app.opencve.io/cve/?vendor=palletsprojects&product=flask) · [OpenCVE](https://app.opencve.io/cve/?vendor=palletsprojects&product=werkzeug) · [OpenCVE](https://app.opencve.io/cve/?vendor=palletsprojects&product=jinja))
- **Celery, Gunicorn, Uvicorn, SQLAlchemy** : Celery pour les tâches de fond (avec Redis comme broker), Gunicorn et Uvicorn comme serveurs, SQLAlchemy comme ORM hors Django. ([doc](https://docs.celeryq.dev/) · [OpenCVE](https://app.opencve.io/cve/?vendor=celeryproject&product=celery) · [OpenCVE](https://app.opencve.io/cve/?vendor=gunicorn&product=gunicorn) · [OpenCVE](https://app.opencve.io/cve/?vendor=encode&product=uvicorn) · [OpenCVE](https://app.opencve.io/cve/?vendor=sqlalchemy&product=sqlalchemy))

## Sur Outscale avec bige-ops

Le runtime python expose l’API sur le port 8000 (512 MiB). Le worker (Celery, RQ, Dramatiq) tourne sur la même VM app en multi-VM, ou dans son propre Deployment sur OKS. Pour l’inférence, une VM GPU Outscale se déclare à côté et se chiffre avec le reste.

- `single-vm` : une VM publique, apps + bases en Docker Compose (prototype, démo).
- `multi-vm` : VM app derrière un LBU, une VM privée par base, NAT pour la sortie (production lisible).
- `oks` : cluster OKS, un Deployment par service, Service LoadBalancer → LBU (scale, microservices, HPA).

```
bige-ops add layout python-app --name api
# ou sur mesure :
bige-ops add layout custom --runtime python --web none --worker \
  --db postgres --db redis --topology multi-vm --lbu
```

## Scan bige-ops

Mode direct : routes Django/FastAPI/Flask avec signaux d’auth ; secrets, shell=True/eval, SQL en f-string, verify=False, DEBUG=True, open redirect, path traversal ; PyPI épinglé (`==`) → OSV. Clé OpenCVE : image `python` → [Python sur OpenCVE](https://app.opencve.io/cve/?vendor=python&product=python).

## Bases de données

- **PostgreSQL** : ORM Django, SQLAlchemy, psycopg. [OpenCVE](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) — [Django + Celery + PostgreSQL + Redis](https://bige.dev/stack-django-celery-postgresql-redis.html)
- **PostgreSQL + pgvector** : embeddings et RAG dans la même base. [OpenCVE](https://app.opencve.io/cve/?vendor=pgvector&product=pgvector) — [IA : FastAPI + pgvector + GPU](https://bige.dev/stack-ai-fastapi-pgvector-gpu.html)
- **Redis** : broker Celery, cache, sessions. [OpenCVE](https://app.opencve.io/cve/?vendor=redis&product=redis) — [Django + Celery + PostgreSQL + Redis](https://bige.dev/stack-django-celery-postgresql-redis.html)
- **MongoDB** : PyMongo, Motor. [OpenCVE](https://app.opencve.io/cve/?vendor=mongodb&product=mongodb)

Jamais de base exposée à Internet : subnet privé + security group au CIDR du Net (multi-VM), Service interne (OKS).

## Versions à épingler

Python publie son calendrier : 3.14 et 3.15 reçoivent les corrections, 3.11 à 3.13 les correctifs de sécurité, et 3.10 est en fin de vie depuis octobre 2026. Django 5.2 est la LTS en cours (6.1 la version courante). Épingle l’image (FROM python:3.14-slim) et tes paquets. Sources : versions de Python · CVE : Python sur OpenCVE · Django sur OpenCVE.

## OpenCVE, le référentiel CVE de bige-ops

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : CVE publiées (NVD, MITRE, KEV de la CISA…) enrichies CVSS / EPSS et rangées par fournisseur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

## Stacks chiffrées

- [Django + Celery + PostgreSQL + Redis](https://bige.dev/stack-django-celery-postgresql-redis.html) (423,06 € HT/mois)
- [IA : FastAPI + pgvector + GPU](https://bige.dev/stack-ai-fastapi-pgvector-gpu.html) (2 654,65 € HT/mois)

Docs : [Python](https://docs.python.org/3/) · [Django](https://docs.djangoproject.com/) · [FastAPI](https://fastapi.tiangolo.com/) · [Flask](https://flask.palletsprojects.com/) · [Celery](https://docs.celeryq.dev/) · [Déployer Django](https://docs.djangoproject.com/en/stable/howto/deployment/)

HTML : [lang-python.html](https://bige.dev/lang-python.html)
