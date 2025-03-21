---
title: Install Docker 
---


This tutorial will walk you through the steps to install Docker on your machine.

### Automated Installation

This will install the latest version of Docker on your system.



```bash
sudo curl -fsSL https://get.docker.com | sh
```
___

### Manual Installation (Safer option)

This option will download, verify and install the latest version of Docker on your system.

```bash
curl -fsSL https://get.docker.com -o install-docker.sh
```

Next, run the script with --dry-run to verify the steps it executes
```bash
sh install-docker.sh --dry-run
```

Finally, run the script to install Docker:

```bash
sudo sh install-docker.sh
```




