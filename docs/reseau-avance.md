# Réseau avancé

Net créé (`/16`) ou adopté ; subnets `/24` public + privé (auto) ; security groups dérivés des rôles (règles entrantes, sortie ouverte) ; route tables et internet service (auto) ; NAT service désactivé par défaut (`enable_nat`) ; IP publiques créées pour les VM publiques et le NAT ; NIC et options DHCP sur le canvas seulement ; peering et VPN observés ; DirectLink au catalogue de prix.

Côté Outscale : un NAT service sert tous les subnets privés du Net derrière une IP publique ; dans un Net, l’association IP publique ↔ VM est persistante.

Doc Outscale : [Nets](https://docs.outscale.com/fr/userguide/À-propos-des-Nets.html) · [NAT services](https://docs.outscale.com/fr/userguide/À-propos-des-NAT-services.html) · [IP publiques](https://docs.outscale.com/fr/userguide/À-propos-des-IP-publiques.html) · [NIC](https://docs.outscale.com/fr/userguide/À-propos-des-NIC.html)

HTML : [reseau-avance.html](https://bige.dev/reseau-avance.html)
