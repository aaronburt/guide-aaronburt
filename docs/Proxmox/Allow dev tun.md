---
title: Allow /dev/tun on LXC
---

If you've encountered the "ERROR unix opening TUN device file: operation not permitted" while trying to install Gluetun, Tailscale, or any other VPN agent on an LXC (Linux Container), you are not the only one. This error occurs because, by default, an LXC lacks permission to access the `TUN` device required for establishing VPN connections. To resolve this, you'll need to grant the LXC access to these devices. Here's how:

:::tip
You LXC does not need to be privileged for this to work as you are giving bespoke access 
:::


1. Access the Proxmox Shell via SSH or the WebUI.
2. Locate the configuration file for the specific LXC, typically found in `/etc/pve/lxc/`. The file is named after the ID of the machine; for instance, the configuration file for machine 100 would be named 100.conf.
3. Add the following two lines to the configuration file:


```bash
lxc.cgroup2.devices.allow: c 10:200 rwm 
lxc.mount.entry: /dev/net/tun dev/net/tun none bind,create=file
```

The first line grants the LXC the ability to read, write, and create a new connection node. The second line binds the actual Proxmox tun device to the corresponding LXC device, resolving the permission issue. Once you've successfully edited the file reboot the LXC and upon reloading the container will have access to the TUN device thus resolving the problem and allowing you to start the VPN connection up. 
