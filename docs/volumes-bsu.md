# Volumes BSU & snapshots

Stockage bloc Outscale, attaché à une VM de la même Subregion :

| Type | Nom Outscale | Performance | Taille |
| --- | --- | --- | --- |
| `standard` | Magnetic | ~250 lectures / 150 écritures par seconde | 1 à 14 901 GiB |
| `gp2` | Performance (SSD) | 3 IOPS/GiB (min. 100), burst 3 000 IOPS sous 1 TiB, max 10 000 | 1 à 14 901 GiB |
| `io1` | Enterprise (SSD) | 100 à 13 000 IOPS provisionnées, max 300 IOPS/GiB | 4 à 14 901 GiB |

Plafond par VM : 36 000 IOPS, 40 volumes racine comprise. io1 se paie au GiB **et** à l’IOPS provisionnée.

Dans bige-ops : disque racine réglable (taille, type, IOPS) ; par défaut `io1` à 3 000 IOPS pour les rôles base, `gp2` sinon, compté à l’identique dans l’estimation. Volumes de données éditables (taille, type, IOPS, VM, device `/dev/xvdX`). Snapshots régionaux : composant Terraform, ligne d’inventaire.

Doc Outscale : [À propos des volumes](https://docs.outscale.com/fr/userguide/À-propos-des-volumes.html) · [Modifier un volume](https://docs.outscale.com/fr/userguide/Modifier-un-volume.html) · [À propos des snapshots](https://docs.outscale.com/fr/userguide/À-propos-des-snapshots.html)

HTML : [volumes-bsu.html](https://bige.dev/volumes-bsu.html)
