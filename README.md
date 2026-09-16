<p align="center">
  <img src="docs/bige-ops-three-clicks.png" alt="bige-ops — design, estimate, deploy on Outscale" width="920" />
</p>

<h1 align="center">LESS IS MORE</h1>

<p align="center">
  <strong>Free desktop app for <a href="https://www.outscale.com/">Outscale</a> &amp; <a href="https://www.outscale.com/fr/secnumcloud/">SecNumCloud</a></strong><br/>
  Design the stack · see the € · deploy when you’re ready<br/>
  <em>Same engine in the GUI and the CLI. Fully local.</em>
</p>

<p align="center">
  <a href="https://github.com/simondelamarre/bige-ops-releases/releases/latest"><img src="https://img.shields.io/badge/⬇%20Download%20macOS-FREE-0ea5a4?style=for-the-badge&logo=apple&logoColor=white" alt="Download macOS — free" height="52" /></a>
  &nbsp;
  <a href="https://github.com/simondelamarre/bige-ops-releases/releases/latest"><img src="https://img.shields.io/badge/⬇%20Download%20Linux-FREE-1f2937?style=for-the-badge&logo=linux&logoColor=white" alt="Download Linux — free" height="52" /></a>
</p>

<p align="center">
  <code>brew tap simondelamarre/bige-ops && brew install --cask bige-ops</code>
</p>

<p align="center">
  <a href="https://bige.dev/"><strong>bige.dev</strong></a> —
  <a href="https://bige.dev/#nouveautes">nouveautés</a> ·
  <a href="https://bige.dev/#feuille-de-route">roadmap</a> ·
  <a href="https://bige.dev/install.html">install</a> ·
  <a href="https://bige.dev/#features">features</a>
</p>

---

## What it is

Free desktop app for [Outscale](https://www.outscale.com/) & [SecNumCloud](https://www.outscale.com/fr/secnumcloud/): **layout → estimate (€) → apply / deploy** on *your* account. Same engine in the GUI and the CLI. Fully local.

Terraform / OKS specs / app YAML = **materialization**, not the product.

| | |
|---|---|
| Price | **Free** — Outscale bill stays yours |
| Runs | **Your machine** |
| Regions | `eu-west-2` · `cloudgouv-eu-west-1` (**SecNumCloud**) |

No Outscale account yet? Stay in **projection** (design + € offline). Login only for inventory, plan, apply.

Starters: Node / Python / Java / Go / Elixir / PHP × Mongo / Redis / Postgres / Weaviate × VMs and/or **OKS**. Details on [bige.dev](https://bige.dev/).

---

## What’s new in 0.5

- **Repos & risk** — scan linked repos, exposed risks, **MD / PDF** reports (internal or RSSI)
- **Instant estimate** — local cache + tariffs page
- **OKS logs** — `kubectl` pod logs from the app

**In progress / next:** fuller vuln scan · credits & account · on-demand CLI tooling — [roadmap on the site](https://bige.dev/#feuille-de-route).

---

## Install

| macOS / Linux | [Latest release — FREE](https://github.com/simondelamarre/bige-ops-releases/releases/latest) |
| Homebrew | `brew tap simondelamarre/bige-ops && brew install --cask bige-ops` |
| Issues / feedback | [Open an issue](https://github.com/simondelamarre/bige-ops-releases/issues/new/choose) — also from the desktop app → Settings → Report an issue |

### macOS Gatekeeper (not notarized)

Downloads are quarantined. Modern macOS may show **“Apple could not verify…”** and block with **no** “Open anyway”.

After copying `bige-ops.app` to `/Applications` — **before** the first double-click:

```bash
xattr -cr /Applications/bige-ops.app && codesign --force --deep --sign - /Applications/bige-ops.app
```

Or run **Fix Gatekeeper.command** from the DMG. After Trash: copy again, then re-run.  
Homebrew cask clears quarantine in postflight. Full guide: [install.html#gatekeeper](https://bige.dev/install.html#gatekeeper).

Source stays private; **this** public repo is where bugs and feature requests land on GitHub.

**Outscale** · [outscale.com](https://www.outscale.com/) · **SecNumCloud** · [outscale.com/fr/secnumcloud](https://www.outscale.com/fr/secnumcloud/)

<p align="center">
  <a href="https://github.com/simondelamarre/bige-ops-releases/releases/latest"><img src="https://img.shields.io/badge/⬇%20Download%20macOS-FREE-0ea5a4?style=for-the-badge&logo=apple&logoColor=white" alt="Download macOS — free" height="52" /></a>
  &nbsp;
  <a href="https://github.com/simondelamarre/bige-ops-releases/releases/latest"><img src="https://img.shields.io/badge/⬇%20Download%20Linux-FREE-1f2937?style=for-the-badge&logo=linux&logoColor=white" alt="Download Linux — free" height="52" /></a>
</p>
