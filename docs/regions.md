# Régions, zones & SecNumCloud

Cinq Régions publiques : `eu-west-2` (France, défaut, OKS), `cloudgouv-eu-west-1` (France, SecNumCloud 3.2, OKS), `us-east-2`, `us-west-1`, `ap-northeast-1`. Chaque Région a sa grille de prix. La correspondance Subregion ↔ datacenter est tirée au hasard pour chaque compte.

bige-ops place un projet dans une seule Subregion (la première par défaut) ; Outscale en offre deux ou trois par Région pour répartir.

Un compte Outscale est créé pour une Région : travailler en SecNumCloud demande un compte `cloudgouv-eu-west-1`. OKS s’active sur demande au support.

Doc Outscale : [Régions et Sous-régions](https://docs.outscale.com/fr/userguide/À-propos-des-Régions-et-Sous-régions.html) · [Votre compte OUTSCALE](https://docs.outscale.com/fr/userguide/À-propos-de-votre-compte-OUTSCALE.html) · [SecNumCloud](https://fr.outscale.com/secnumcloud/)

HTML : [regions.html](https://bige.dev/regions.html)
