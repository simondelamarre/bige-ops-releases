# OKS & pods

OUTSCALE Kubernetes as a Service : control plane managé par Outscale, nodepools + Deployments. Réplicas = pods. Disponible en `eu-west-2` et `cloudgouv-eu-west-1`, activation sur demande au support Outscale. Kubernetes 1.32 à 1.36 ; bige-ops part sur **1.34** et `cp.mono.master` (test, sans HA) — pour la production, un control plane `cp.3.masters.small|medium|large`.

**App d’abord.** CLI = même moteur. Sous le capot : `oks-cli` + `kubectl`.

**Scale :** `replicas`, HPA CPU, `memory_mb`, nodepools nombre/type — Visual + `generate`.

**HTTPS :** Service LoadBalancer + `expose.tls.server_certificate_id` (ORN EIM) ; OKS crée le LBU qui termine le TLS.

**Data :** les bases en pods utilisent `emptyDir` ; le filet, c’est le backup vers OOS.

Doc Outscale : [À propos d’OKS](https://docs.outscale.com/fr/userguide/À-propos-d-OKS.html) · [Créer des load balancers dans OKS](https://docs.outscale.com/fr/userguide/Créer-des-load-balancers-dans-OKS.html)

HTML : [oks.html](https://bige.dev/oks.html)
