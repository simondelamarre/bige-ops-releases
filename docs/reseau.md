# Réseau · ouvrir ou non

Exposer un pod, une VM, ou une face d’un layout multi-VM : règles **projet** + règles **Outscale** (Net, Security Groups, LBU).

**Principe :** minimum d’exposition — LBU / HTTP public si besoin ; data & admin privés. Pas de `0.0.0.0/0` sur SSH / admin.

- Face publique : souvent VM app + LBU
- VM data : privée, SG VPC
- Pods OKS : Service/Ingress ; admin CIDR restreint
- Agent LLM : clés API **perso** locales pour comprendre / maintenir et éviter cascades de keys & setups

Doc Outscale : [Nets](https://docs.outscale.com/en/userguide/About-Nets.html) · [Security Groups](https://docs.outscale.com/en/userguide/About-Security-Groups.html) · [SG rules](https://docs.outscale.com/en/userguide/Adding-Rules-to-a-Security-Group.html) · [SG + LBU](https://docs.outscale.com/en/userguide/About-Security-Groups-in-LBU.html)

HTML : [reseau.html](https://simondelamarre.github.io/bige-ops-releases/reseau.html)
