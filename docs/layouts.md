# Layouts & topologies

Trois topologies : `single-vm` (une VM `{name}-all`, EIP publique, un seul blast radius), `multi-vm` (VM app publique + une VM privée par base), `oks` (cluster + manifests, pas de VM app).

Huit layouts nommés : `node-app`, `python-app`, `java-spring`, `elixir-phoenix`, `php-app`, `go-app`, `node-lite` (le seul en single-vm, sans LBU), `python-ml`.

Bâtisseur de stack : `custom` / `build`, exige `--runtime`. Défauts : postgres + redis, multi-vm, LBU activé.

```
bige-ops add layouts
bige-ops add layout node-app --name mon-app
bige-ops add layout custom --runtime python --db postgres --db redis --web spa --lbu
```

**Limites :** les workers partagent la VM app ; en multi-vm les URLs de bases n’arrivent qu’après l’apply (coffre → `.env`) ; le premier deploy doit être complet avant un `--service` ciblé.

Voir aussi : [vms.html](https://bige.dev/vms.html) · [oks.html](https://bige.dev/oks.html) · [simulations.html](https://bige.dev/simulations.html)

HTML : [layouts.html](https://bige.dev/layouts.html)
