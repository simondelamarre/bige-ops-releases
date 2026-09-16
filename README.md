<p align="center">
  <img src="docs/bige-ops-three-clicks.png" alt="bige-ops — design, estimate, deploy on Outscale" width="920" />
</p>

<h1 align="center">bige-ops</h1>

<p align="center">
  <strong>Free · 100% local · no SaaS control plane</strong><br/>
  Design the stack · see the € · deploy on <em>your</em> Outscale account
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
  <a href="https://bige.dev/"><strong>bige.dev</strong></a>
  · <a href="https://bige.dev/#features">features</a>
  · <a href="https://bige.dev/install.html">install</a>
  · <a href="https://github.com/simondelamarre/bige-ops-releases/issues">issues</a>
</p>

---

**Outscale first** (live). Other clouds: WIP.  
**Features** (Stable / WIP / Backlog): [bige.dev/#features](https://bige.dev/#features)

macOS Gatekeeper (not notarized): [install.html#gatekeeper](https://bige.dev/install.html#gatekeeper)

```bash
xattr -cr /Applications/bige-ops.app && codesign --force --deep --sign - /Applications/bige-ops.app
```
