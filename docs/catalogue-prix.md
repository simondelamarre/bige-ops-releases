# Catalogue de prix & estimation

Estimation locale, à partir du catalogue public Outscale : embarqué, **ou** synchronisé par l’API [`ReadPublicCatalog`](https://docs.outscale.com/api#readpubliccatalog) (sans authentification) :

```bash
bige-ops pricing catalog-sync
bige-ops pricing catalog-status
```

Aussi : Sync sur la page Tarifs de l’app.

Le vCPU se paie à l’heure selon génération × performance, la RAM au GiB ; ramené au mois sur 730 heures.

Compté : VMs (et GPU déclarés), disque racine à son type réel (`io1` + IOPS compris), volumes, LBU, NAT, IP publiques non associées, OKS (control plane + nœuds), OOS si une taille est renseignée. À côté : trafic sortant (0 € HT au catalogue public en `eu-west-2`, `cloudgouv-eu-west-1`, `us-east-2`, `us-west-1`), VPN, DirectLink, licences.

HTML : [catalogue-prix.html](https://bige.dev/catalogue-prix.html)
