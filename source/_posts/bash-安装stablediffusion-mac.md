---
title: bash-安装stablediffusion
date: 2024-01-17 11:04:47
tags:
  - stablediffusion
  - bash
categories:
  - bash
---

```bash
cd
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install cmake protobuf rust python@3.10 git wget
cd ~/Documents
mkdir stabledf
cd stabledf
git config --blobal http.postBuffer 524288000
git clone https://github.Com/AUTOMATIC1111/stable-diffusion-webui
```