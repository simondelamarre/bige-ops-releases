# Node.js sur Outscale

Express, Fastify, NestJS, Next.js : l’écosystème Node.js fait tourner une bonne part des API et des fronts modernes. Sur Outscale, bige-ops le pose en mono-VM, en multi-VM derrière un LBU ou sur OKS, chiffre la stack au catalogue public et lit tes dépôts pour trouver routes ouvertes et dépendances vulnérables.

**En bref.** Runtime nodejs dans bige-ops : API sur le port 3001, front sur le 3000, 512 MiB par service par défaut. Scan le plus complet de bige-ops : routes de huit frameworks back, failles front (React, Vue, Svelte) et dépendances npm rapprochées d’OSV.

## Frameworks et bibliothèques

- **Express** : Le socle minimaliste de l’écosystème : middlewares, app.get(), router.route(). bige-ops lit les routes déclarées sur app et router, y compris typées en TypeScript ; les réponses qui renvoient la requête telle quelle sont préparées pour l’audit approfondi. ([doc](https://expressjs.com/) · [OpenCVE](https://app.opencve.io/cve/?vendor=openjsf&product=express))
- **Fastify** : Le framework orienté performance et schémas JSON. Routes courtes (fastify.get), .route({ url, method }) et préfixes de plugins (register(plugin, { prefix })) sont détectés ; preHandler et onRequest comptent comme signaux d’authentification. ([doc](https://fastify.dev/docs/latest/) · [OpenCVE](https://app.opencve.io/cve/?vendor=fastify&product=fastify))
- **Hono** : Léger, standard Web, multi-runtime. app.get(), app.on(['GET','POST'], path) et basePath() sont lus. ([doc](https://hono.dev/docs/) · [OpenCVE](https://app.opencve.io/cve/?vendor=hono&product=hono))
- **Koa** : Le successeur minimaliste d’Express, tout en middlewares async ; ses routeurs (router.get()) sont détectés. ([doc](https://koajs.com/) · [OpenCVE](https://app.opencve.io/cve/?vendor=koajs&product=koa))
- **LoopBack** : Framework d’API orienté OpenAPI. Les décorateurs LoopBack 4 (@get, @post, @operation) deviennent des routes. ([doc](https://loopback.io/doc/en/lb4/) · [OpenCVE](https://app.opencve.io/cve/?vendor=ibm&product=loopback))
- **NestJS** : L’architecture modulaire et typée des équipes produit. @Controller() donne le préfixe, @Get() / @Post() les routes ; @UseGuards() marque une route protégée, @Public une route ouverte, et un contrôleur sans guard visible ressort pour l’audit. ([doc](https://docs.nestjs.com/) · [OpenCVE](https://app.opencve.io/cve/?vendor=nestjs&product=nest))
- **Next.js** : Le framework React full-stack. Les route handlers (app/**/route.ts) et les routes pages/api sont lus depuis l’arborescence ; une route API Next.js est marquée « à vérifier » côté session. ([doc](https://nextjs.org/docs) · [OpenCVE](https://app.opencve.io/cve/?vendor=vercel&product=next.js))
- **tRPC** : Des API typées de bout en bout sans schéma séparé. Les routeurs tRPC sont lus ; protectedProcedure et publicProcedure disent qui est protégé. ([doc](https://trpc.io/docs) · [OpenCVE](https://app.opencve.io/cve/?vendor=trpc&product=trpc))
- **React, Vue, Svelte** : Côté front, bige-ops cherche les injections HTML : dangerouslySetInnerHTML (React, Next.js), v-html (Vue), {@html} (Svelte) et les affectations innerHTML. Docs : Vue, Svelte. ([doc](https://react.dev/) · [OpenCVE](https://app.opencve.io/cve/?vendor=facebook&product=react) · [OpenCVE](https://app.opencve.io/cve/?vendor=vuejs&product=vue) · [OpenCVE](https://app.opencve.io/cve/?vendor=svelte&product=svelte))

## Sur Outscale avec bige-ops

Dans bige-ops, le runtime nodejs donne une API sur le port 3001 et un front sur le 3000 (512 MiB chacun), construits depuis le Dockerfile de ton dépôt. Le front peut être une SPA servie par Node (--web spa), le même runtime que l’API (--web same, typique de Next.js) ou absent.

- `single-vm` : une VM publique, apps + bases en Docker Compose (prototype, démo).
- `multi-vm` : VM app derrière un LBU, une VM privée par base, NAT pour la sortie (production lisible).
- `oks` : cluster OKS, un Deployment par service, Service LoadBalancer → LBU (scale, microservices, HPA).

```
bige-ops add layout custom --runtime nodejs --web same --worker \
  --db postgres --db redis --topology multi-vm --lbu
bige-ops estimate --json
```

## Scan bige-ops

Mode direct (sans clé) : tree-sitter JS/TS/TSX ; routes Express, Fastify, Hono, Koa, LoopBack, NestJS, Next.js, tRPC avec signaux d’auth (route publique ou sensible sans signal = CWE-639) ; secrets, eval/child_process, SQL concaténé, CORS *, TLS désactivé, XSS DOM, open redirect, path traversal ; dépendances npm → OSV. Clé OpenCVE : image `node` → [Node.js sur OpenCVE](https://app.opencve.io/cve/?vendor=nodejs&product=node.js).

## Bases de données

- **PostgreSQL** : Prisma, TypeORM, Drizzle ; Prisma est le plus courant avec NestJS. [OpenCVE](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) — [Next.js + NestJS + PostgreSQL + Redis + OOS](https://bige.dev/stack-nextjs-nestjs-postgresql-redis.html)
- **MongoDB** : le duo historique avec Mongoose. [OpenCVE](https://app.opencve.io/cve/?vendor=mongodb&product=mongodb) — [Express + MongoDB + Redis + BullMQ sur OKS](https://bige.dev/stack-express-mongodb-redis-oks.html)
- **Redis** : cache, sessions et files BullMQ. [OpenCVE](https://app.opencve.io/cve/?vendor=redis&product=redis) — [Express + MongoDB + Redis + BullMQ sur OKS](https://bige.dev/stack-express-mongodb-redis-oks.html)
- **MySQL / MariaDB** : Prisma, Sequelize, Knex. [OpenCVE](https://app.opencve.io/cve/?vendor=oracle&product=mysql)

Jamais de base exposée à Internet : subnet privé + security group au CIDR du Net (multi-VM), Service interne (OKS).

## Versions à épingler

En production, Node.js recommande une version LTS : aujourd’hui Node.js 24 (LTS active) ou 22 (LTS de maintenance) ; Node.js 26 est en phase Current et Node.js 20 n’est plus maintenu. Épingle la majeure dans ton Dockerfile (FROM node:24-alpine) plutôt que node:latest. Calendrier : versions de Node.js · CVE du runtime : Node.js sur OpenCVE.

## OpenCVE, le référentiel CVE de bige-ops

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : CVE publiées (NVD, MITRE, KEV de la CISA…) enrichies CVSS / EPSS et rangées par fournisseur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

## Stacks chiffrées

- [Next.js + NestJS + PostgreSQL + Redis + OOS](https://bige.dev/stack-nextjs-nestjs-postgresql-redis.html) (428,06 € HT/mois)
- [Express + MongoDB + Redis + BullMQ sur OKS](https://bige.dev/stack-express-mongodb-redis-oks.html) (457,65 € HT/mois)

Docs : [Node.js API](https://nodejs.org/docs/latest/api/) · [Express](https://expressjs.com/) · [Fastify](https://fastify.dev/docs/latest/) · [NestJS](https://docs.nestjs.com/) · [Next.js](https://nextjs.org/docs) · [tRPC](https://trpc.io/docs) · [BullMQ](https://docs.bullmq.io/) · [OSV](https://osv.dev/)

HTML : [lang-nodejs.html](https://bige.dev/lang-nodejs.html)
