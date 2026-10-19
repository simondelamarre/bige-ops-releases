# Inventaire & import (reverse)

`inventory fetch` lit le compte et stocke un snapshot. `inventory show` = résumé + coût. UI : badges status.

`import selection --id i-xxxx` → YAML + `generate`. `import plan` = terraform import suggéré.

## Destroy & forget

```bash
bige-ops inventory destroy --id … --cascade --plan
bige-ops inventory destroy --id … --cascade --yes
bige-ops inventory forget --terminated
```

Destroy vérifie via re-fetch. Forget = local seulement.

| État | Ressources |
| --- | --- |
| Importé en composant | VMs, volumes, nets/subnets, SG, keypairs |
| Observé seulement | route tables, NAT, internet service, IP publiques, Net peering, VPN, buckets OOS listés, LBU importés, OKS listé |
| Local seulement | `nic`, `dhcp_options` |
| Catalogue de prix | DirectLink |

**Danger :** `inventory clean --yes` = destructif (comptes de test). Il refuse de détruire les buckets OOS.

HTML : [inventory.html](https://bige.dev/inventory.html)
