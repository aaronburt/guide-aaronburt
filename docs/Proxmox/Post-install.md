---
title: Post Install
sidebar_position: 2
---


After completing the standard installation, execute the Post-install script from [here](https://community-scripts.github.io/ProxmoxVE/).

The script removes subscription-required repositories, replaces them with free alternatives, and updates all repositories, ensuring the latest versions. It also makes minor CSS tweaks to eliminate Proxmox 'reminders' for a subscription. 

:::warning
Run this script in the **Proxmox shell via the WebUI**, as it can extract variables from the UI to aid in installation.
:::


```
bash -c "$(curl -fsSL https://raw.githubusercontent.com/community-scripts/ProxmoxVE/main/tools/pve/post-pve-install.sh)"
```

#### Optional

Next, apply the 'Discord Dark theme' install script to give the WebUI a clean, Discord-inspired dark theme. Again, install this via the shell:

```
bash <(curl -s https://raw.githubusercontent.com/Weilbyte/PVEDiscordDark/master/PVEDiscordDark.sh ) install
```

It's advisable to ensure a strong password, preferably at least 20 characters, to prevent remote attacks.
