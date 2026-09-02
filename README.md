# Public download page for bige-ops desktop binaries.
#
# This file is a TEMPLATE to paste into the public repo
#   https://github.com/simondelamarre/bige-ops-releases
# (create that repo empty + public, then commit this as README.md)

# bige-ops — downloads

Desktop app for **Outscale** stack simulations (macOS + Linux).

Source code lives in a private repository. **This repo only hosts release binaries.**

## Download

See **[Releases](https://github.com/simondelamarre/bige-ops-releases/releases/latest)** for the latest version.

| Platform | Artifact |
|----------|----------|
| macOS (Apple Silicon) | `bige-ops-*-macos-aarch64.dmg` |
| Linux | `bige-ops-*-linux-x86_64.AppImage` |
| Linux (deb) | `bige-ops-*-linux-x86_64.deb` |

Machine-readable index: [`latest.json`](https://github.com/simondelamarre/bige-ops-releases/releases/latest/download/latest.json) on each release.

### macOS notes

Builds are not notarized yet. First open: right-click the app → **Open**, or allow it in **System Settings → Privacy & Security**.

### Linux

```bash
chmod +x bige-ops-*-linux-x86_64.AppImage
./bige-ops-*-linux-x86_64.AppImage
```

## Homebrew (macOS)

```bash
brew tap simondelamarre/bige-ops
brew install --cask bige-ops
```

(Requires the public tap `homebrew-bige-ops` to be published.)

## CLI only

```bash
pipx install bige-ops   # when published on PyPI
```
