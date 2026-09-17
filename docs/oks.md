# OKS & pods

Kubernetes managé Outscale : nodepools + Deployments. Réplicas = pods.

**App d’abord.** CLI = même moteur. Sous le capot : `oks-cli` + `kubectl`.

**Scale :** `replicas`, HPA CPU, `memory_mb`, nodepools count/type — Visual + `generate`.

**HTTPS :** LoadBalancer + `expose.tls.server_certificate_id` (ORN EIM). Pas cert-manager / Ingress inventés.

**Warn :** estimate ≠ contrat. Dry run + codes API.

HTML : [oks.html](https://bige.dev/oks.html)
