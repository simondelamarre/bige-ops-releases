# Glossaire

Le vocabulaire du cloud et de bige-ops, défini une fois.

- **Tina** : Le nom des types de VM sur mesure, au format tinavW.cXrYpZ : génération de CPU, vCPU, RAM en GiB et niveau de performance (p1 le plus haut). Exemple : tinav6.c4r16p1.
- **VM** : Une machine virtuelle, taillée à la demande par son type Tina, démarrée depuis une OMI, avec un disque racine BSU. L’API historique FCU l’appelle « instance ».
- **VPS** : Virtual Private Server : le terme générique pour un serveur virtuel loué. Ici, c’est une VM, et sa taille se compose librement (vCPU, RAM, performance) au lieu d’être choisie dans une grille fixe.
- **OMI** : Machine Image : l’image qui sert de modèle à une VM (système et configuration). Les OMI officielles sont maintenues par le cloud ; un identifiant d’OMI est propre à une Région.
- **BSU** : Les volumes bloc, attachés à une VM de la même Subregion : standard (Magnetic), gp2 (Performance, SSD) ou io1 (Enterprise, SSD à IOPS provisionnées), avec snapshots.
- **OOS** : Object Storage compatible S3 : buckets régionaux pour fichiers applicatifs, sauvegardes et exports d’OMI ou de snapshots.
- **Net** : Le réseau privé virtuel d’un compte dans une Région, découpé en Subnets, avec route tables, security groups, internet service et NAT service.
- **LBU** : Load Balancer Unit, le load balancer : HTTP/HTTPS ou TCP/SSL, health checks, et terminaison TLS avec un certificat serveur stocké dans EIM.
- **EIM** : Elastic Identity Management : utilisateurs, politiques d’accès et certificats serveur du compte. Un certificat y est référencé par son ORN.
- **OKS** : Kubernetes as a Service : control plane managé, nodepools de VMs Tina, Services de type LoadBalancer adossés au LBU.
- **SecNumCloud** : Le référentiel de sécurité de l’ANSSI. Le cloud est qualifié SecNumCloud 3.2 ; la région correspondante est cloudgouv-eu-west-1.
- **Mono-VM** : La topologie single-vm de bige-ops : une seule VM {nom}-all porte les apps et leurs bases, avec une IP publique. Le point de départ le plus simple.
- **Multi-VM** : La topologie multi-vm : une VM app publique, souvent derrière un LBU, et une VM privée par base de données, dans le même Net. Une base peut partager la VM privée d’une autre base (`colocate_with`).
- **Simulation** : Une variante de ta stack dans bige-ops : brouillon (draft) ou live, avec son coût estimé.
- **Estimation** : Le coût mensuel € HT d’une simulation, calculé sur ton poste à partir du catalogue public, synchronisable par l’API ReadPublicCatalog.
- **Appliquer la configuration** : Réconcilier le Visual et `project.yaml`, valider la stack, régénérer uniquement les fichiers dérivés puis relire le résultat canonique. Cette transaction locale est atomique : en cas d’erreur, la dernière configuration valide est restaurée. Elle ne crée aucune ressource cloud.
- **Plan** : Prévisualiser les créations, modifications, suppressions, risques et coûts cloud avant toute action réelle.
- **Apply cloud** : Créer ou mettre à jour l’infrastructure après revue du plan : Net, subnets, routage, VMs, volumes, LBU, OOS ou OKS selon la stack.
- **Deploy** : Déployer l’application sur l’infrastructure préparée : Docker Compose sur VM ou manifests sur OKS. Le bouton reste indisponible tant qu’une modification Visual ou Config n’a pas été appliquée localement.
- **Promote** : Faire d’une simulation draft la simulation live du compte. L’ancienne live est archivée, après un snapshot de configuration.
- **Mode expert** : L’édition directe des fichiers de la simulation (project.yaml, Terraform, manifests OKS) dans le Workspace de l’app.
- **Branche active** : La branche Git sélectionnée pour un service. Le code, les routes et les vulnérabilités affichés doivent provenir de cette branche uniquement.
- **Route exposée** : Une route web ou API détectée dans le code et reliée à son dépôt, son service et son exposition réseau réelle (publique, interne ou source uniquement).
- **CWE** : Une famille d’erreurs de conception ou de code, par exemple injection SQL, XSS ou contrôle d’accès absent.
- **CVE** : Une vulnérabilité connue dans une version précise d’une dépendance. bige-ops la confronte à la version réellement utilisée, à l’exposition de la stack et à l’existence d’un correctif afin de prioriser les actions actuelles plutôt qu’un historique brut.

HTML : [glossaire.html](https://bige.dev/glossaire.html)
