---
title: Plex
---

:::tip
Be sure to change the volume disk mount to exactly where you want you Plex library to be.
:::


### Plex without GPU acceleration

Download the docker-compose file directly into your current directory. 

```bash
curl -O https://guide.aaronburt.co.uk/source/plex/docker-compose.yml
```

This is the standard installation for Plex, this will use CPU processing.

```yaml
version: "2.1"
services:
  plex:
    image: lscr.io/linuxserver/plex:latest
    container_name: plex
    network_mode: host
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Etc/UTC
      - VERSION=docker
    volumes:
      - ./config:/config
      - /mnt/disk/plex/tv:/tv
      - /mnt/disk/plex/movies:/movies
    restart: unless-stopped
```




## Plex is enabled with GPU support via NVIDIA-SMI

This will enable support for GPU's via NVIDIA-SMI. SMI must be installed the local machine aswell to all Docker to bridge the gap, this normally requires the NVIDIA drivers to be installed aswell.

```yaml
version: "2.1"
services:
  plex:
    image: lscr.io/linuxserver/plex:latest
    container_name: plex
    network_mode: host
    deploy:
      resources:
        reservations:
          devices:
            - capabilities: [gpu]
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Etc/UTC
      - VERSION=docker
      - NVIDIA_VISIBLE_DEVICES=all
      - NVIDIA_DRIVER_CAPABILITIES=compute,video,utility
    volumes:
      - ./config:/config
      - /mnt/disk/plex/tv:/tv
      - /mnt/disk/plex/movies:/movies
    restart: unless-stopped
```