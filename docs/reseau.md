# Réseau · ouvrir ou non

Exposer un pod, une VM, ou une face d’un layout multi-VM : règles **projet** + règles **Outscale** (Net, subnets, security groups, LBU).

**Principe :** minimum d’exposition — LBU HTTP/HTTPS public si besoin ; data et admin privés. SSH et ports d’admin réservés à des CIDR connus.

- Face publique : VM app derrière le LBU
- VM data : subnet privé, security groups limités au CIDR du Net
- Pods OKS : Service selon le besoin ; API Kubernetes limitée à `OKS_ADMIN_CIDR`
- Firewall bypass Outscale : deux VMs du même subnet se parlent sans security group ; séparer app (public) et data (privé) remet les security groups dans le chemin
- Net : CIDR RFC 1918 de `/16` à `/28`, non modifiable après création
- Assistant IA : ta clé API, en local, pour garder la config lisible

Doc Outscale : [Nets](https://docs.outscale.com/fr/userguide/À-propos-des-Nets.html) · [Security groups](https://docs.outscale.com/fr/userguide/À-propos-des-security-groups.html) · [Règles](https://docs.outscale.com/fr/userguide/Ajouter-des-règles-à-un-security-group.html) · [Security groups dans LBU](https://docs.outscale.com/fr/userguide/À-propos-des-security-groups-dans-LBU.html)

HTML : [reseau.html](https://bige.dev/reseau.html)
