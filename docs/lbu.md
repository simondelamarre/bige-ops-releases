# LBU · l’entrée publique

Load Balancer Unit : bige-ops crée le LBU (`internet-facing` ou `internal`), **un ou plusieurs listeners** (HTTP/TCP, ou HTTPS/SSL avec l’ORN d’un certificat serveur EIM), les VMs backend et un health check complet (protocole, port, chemin, intervalle, timeout, seuils). Un LBU importé est **observé**, pas piloté.

Côté Outscale : répartition round-robin ; frontal HTTP/HTTPS → backend HTTP, TCP/SSL → TCP ; TLS terminé sur le LBU ; un listener ne se modifie pas (on l’ajoute ou on le retire) ; un health check par LBU ; dans un Net, aucun security group n’est associé par défaut au LBU.

Doc Outscale : [À propos des load balancers](https://docs.outscale.com/fr/userguide/À-propos-des-load-balancers.html) · [Certificats serveurs dans EIM](https://docs.outscale.com/fr/userguide/À-propos-des-certificats-serveurs-dans-EIM.html) · [Security groups dans LBU](https://docs.outscale.com/fr/userguide/À-propos-des-security-groups-dans-LBU.html)

HTML : [lbu.html](https://bige.dev/lbu.html)
