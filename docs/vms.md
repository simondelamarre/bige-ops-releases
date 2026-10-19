# VMs Outscale

- **VM** = le terme Outscale (l’API historique FCU dit « instance »). Une VM Outscale se [compose sur mesure](https://fr.outscale.com/machines-virtuelles-sur-mesure/), là où un **VPS** se choisit en général dans une grille fixe.
- **Type Tina** `tinavW.cXrYpZ` : génération (v2 à v7 ; v5 Skylake, v6 Ice Lake, v7 Sapphire Rapids), 1 à 78 vCPU, 1 à 1039 GiB de RAM, performance `p1` (la plus haute) à `p3`, `p2` par défaut. Référence : [Types de VM](https://docs.outscale.com/fr/userguide/Types-de-VM.html).
- **Mono-VM** (code `single-vm`) : une VM `*-all` — apps + souvent data.
- **Multi-VM** (code `multi-vm`) : rôles séparés (app / data) dans le même Net.
- Puis : generate → **apply** (infra) → **deploy** (apps).

Doc Outscale : [À propos des VM](https://docs.outscale.com/fr/userguide/À-propos-des-VM.html)

HTML : [vms.html](https://bige.dev/vms.html)
