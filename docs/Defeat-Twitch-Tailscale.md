---
title: Defeat Twitch Ads with Tailscale 
---

Twitch is infamous in the last few years for the increasing number of video advertisements being shown towards non-paying users. 
Today I will show you how to fully defeat these adverts in a few short steps. 

## How does this work?
Twitch, and to some extent Amazon, for various political or financial reasons, do not run ad markets in certain countries. This means that if you are from these countries, you do not see a single advertisement. We are going to use either a VPN or a VPS located within one of these countries to trick Twitch into thinking we're from there, and as a result, they will not show us any advertisements.

My example will use a VPN and a Docker stack of Tailscale and Gluetun to provide the differing location, and Tailscale's newly introduced "App connectors" to ensure we only use the VPN when we are on Twitch and only for Twitch.


## Prerequisites
You will need: 
- VPN that has locations in Ad-free countries (Experimentation may be required)
- Server for Docker (Doesn’t need to be very powerful, even a free VPS would do)
- Tailscale


## Creating the Docker-compose stack

I'm going to assume that you have some basic knowledge of Docker compose. Firstly, you need to use this basic YAML file. It's possible this YAML file could be improved, and I am open to suggestions.


You need to make two small changes to this YAML file for it to work correctly. First, generate an auth key from the Tailscale Admin panel. It's helpful to set it to be reusable and add it to the TS_AUTHKEY variable in the Tailscale container config below. Second, provide valid Gluetun credentials for a VPN that is supported. Most major vendors of VPNs are supported out of the box with minimal configuration.




```
version: "3"
services:
  gluetun:
    image: qmcgaw/gluetun
    container_name: gluetun
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
    devices:
      - /dev/net/tun:/dev/net/tun
    ports:
      - 8888:8888/tcp # HTTP proxy
      - 8388:8388/tcp # Shadowsocks
      - 8388:8388/udp # Shadowsocks
      - 51641:41641/udp # Tailscale Port Different from a possible host one
    volumes:
      - ./gluetun:/gluetun
    environment:
      - VPN_SERVICE_PROVIDER=CHANGE ME 
      - VPN_TYPE=openvpn
      - OPENVPN_USER=CHANGE ME 
      - SERVER_REGIONS=CHANGE ME 
      - OPENVPN_PASSWORD=CHANGE ME 
      - TZ=europe/london
    restart: unless-stopped

  tailscale:
    image: tailscale/tailscale:latest
    container_name: tailscale
    environment:
      - TS_AUTHKEY=tskey-auth-CHANGE_ME_CNTRL-CHANGE_ME 
      - TS_EXTRA_ARGS=--hostname=twitch-connector --reset --advertise-exit-node --advertise-connector --advertise-tags=tag:connector
      - TS_STATE_DIR=/var/lib/tailscale
      - TS_USERSPACE=false
    volumes:
      - /dev/net/tun:/dev/net/tun
      - ./tailscale:/var/lib/tailscale
    cap_add:
      - NET_ADMIN
    network_mode: "service:gluetun"
    depends_on:
      gluetun:
        condition: service_healthy
    restart: unless-stopped
```

This will bind a Tailscale client to the Gluetun container in which all outbound communication as a Connector will be handled by the VPN.



# Update the ACL

Within your [ACL](https://tailscale.com/kb/1281/app-connectors#add-an-app-connector), configure the app connectors so they can automatically approve any route they resolve for the tailnet by adding these entries.
```
"autoApprovers": {
  "routes": {
    "0.0.0.0/0": ["tag:connector"],
    "::/0": ["tag:connector"],
  },
},

```
Finally, in the ACL, enable clients to access the internet via the app connectors.

```
"acls": [
  {
    "action": "accept",
    "src": ["autogroup:member"],
    "dst": ["autogroup:internet:*"],
  },
],
```


## App connecting it up 
Now, Tailscale's special sauce is called App Connectors, in which a domain or an 'Application' can be overwritten to use a certain connector address instead of your own. This is basically a mini exit node for certain applications.

We achieve this by going to the Tailscale admin panel and navigating to the 'Apps' section. Create a new App, give it a name, and select a custom target. Use these domains for the Custom target.


``` 
*.ttvnw.net *.twitch.tv twitch.tv 
```
If you want to be able to check if it’s working later on down the line, then add these two domains as well.
``` 
*.iplocation.io iplocation.io 
```

Select the ACL and use the 'connector' ACL and save. Perfect! You have successfully set up a VPN to bypass Twitch AdBlock for everyone who happens to use your Tailnet as well.
