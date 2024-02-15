---
title: Install Tailscale
---

## Using Proxmox Scripts

:::info
This Proxmox script is required to be ran on the WebUI Shell.
:::

To utilize Proxmox scripts' Tailscale installation for an LXC:

```bash
bash -c "$(wget -qLO - https://github.com/tteck/Proxmox/raw/main/misc/add-tailscale-lxc.sh)"
```

After the script completes, reboot the LXC, then on the LXC run

```bash
tailscale up
```

## Manual Installation on Proxmox LXC's

LXC's have a specific requirement before running Tailscale: access to the Tunnel device `/dev/tun`, which unprivileged containers lack by default.

Identify the device ID (found next to the device name on the WebUI) and edit the LXC configuration file (e.g., `/etc/pve/lxc/110.conf`) inside the shell.

Add these two lines

```text
lxc.cgroup2.devices.allow: c 10:200 rwm 
lxc.mount.entry: /dev/net/tun dev/net/tun none bind,create=file
```

:::tip
LXC's by default come with the updates provisions from the image used, its reccommend to ensure they are updated for security.
:::


Next enter the LXC, Reboot and download Tailscale:

```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

then execute:

```bash
tailscale up
```

It should work seamlessly with Magic DNS support.

## Installing on the Proxmox Shell

:::danger[WARNING]
Make sure you read and understand the commands you execute on the Shell.
:::

First download Tailscale:

```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

Installing on the shell requires a modified version of the `up` command. This prevents Tailscale from overwriting your DNS, which would render LXC's and VM's using `HOST DNS Settings` unable to resolve the `100.100.100.100` dns and failing all DNS resolving.

The common workaround at this point is ONLY on the shell to run.
```bash
tailscale up --accept-dns=false
```

This enables Tailscale for connections while rejecting the use of its internal DNS. Keep in mind that magic DNS naming won