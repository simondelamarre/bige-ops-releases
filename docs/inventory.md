# Inventaire & import (reverse)

`inventory fetch` lit le compte (nets, subnets, VMs, volumes, snapshots, OOS, security groups, keypairs, IPs publiques, route tables, NAT, internet service, LBU, peering, VPN, OKS) et stocke un snapshot local. `inventory show` affiche le résumé + estimation de coût.

`import selection --id i-xxxx` écrit du YAML depuis l’inventaire puis lance `generate`. `import plan` imprime les commandes `terraform import` suggérées.

| État | Ressources |
| --- | --- |
| Importé en composant | VMs, volumes, nets/subnets, security groups (IDs adoptés), keypairs |
| Observé seulement | route tables, NAT, internet service, IPs publiques, peering, VPN, OOS en reverse, LBU (sketch, pas de listeners), OKS (listé, pas réécrit en YAML) |
| Local seulement | `nic`, `dhcp_options` — pas de Terraform généré |
| Pas modélisé | DirectLink |

Philosophie : on lit / comprend / affiche — pas « on réécrit mieux ».

**Danger :** `inventory clean --yes` est destructif — il importe tout, vide le projet et lance un `terraform destroy` sur le compte. Comptes de test uniquement. Les buckets OOS restent indestructibles via bige-ops.

Voir aussi : [reseau.html](https://bige.dev/reseau.html) · [oos.html](https://bige.dev/oos.html) · [perimetre.html](https://bige.dev/perimetre.html)

HTML : [inventory.html](https://bige.dev/inventory.html)
