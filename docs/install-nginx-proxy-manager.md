--- 
title: Install Nginx Proxy Manager
---

:::danger
Regardless of your installation choice, you MUST follow the Post-install setup to change the default username and password. You risk exposing your entire network to a threat actor if this is not changed.
:::


Nginx Proxy Manager is a WebUI added on top of the normal Nginx experience, it allows for far more easier control and simpler management of the routing and streams compared to doing in the config files.

It runs in Docker or via LXC with Proxmox scripts. 
I've not noticed a performance difference depending on the install but technically the docker instance would require two layers of virtualisation; LXC -> Docker -> Nginx, the Proxmox script variant also doesn't require each port to be opened if you stray from just HTTP/HTTPS routing. Dockers primary advantage is that you pick up the entire install and move it to a completely difference machine even non Proxmox and it works. (A standard Docker advantage). Also updating is very simple with a simple `docker compose pull`

:::tip
Double check the commands from their official sources, syntax and commands can change from update to update. 
:::

### Install via Docker 

Install Docker to the that machine with this one-liner
```sh
curl https://get.docker.com | sh
```

Next create a folder and place the docker-compose.yml inside. Be sure to double check this YML to ensure that its correct according to [here](https://nginxproxymanager.com/guide/#quick-setup)

```yml
version: '3.8'
services:
  app:
    container_name: 'NginxProxyManager'
    image: 'jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    ports:
      - '80:80'
      - '81:81'
      - '443:443'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
```

The making sure you are in the same directory as the docker-compose.yml you should be able to run. 
``` bash
docker compose up -d
```

It should at this point start pulling from the repo and create the container, I included the -d so it launches to the background but removing the -d the docker logs should be printed to the main window but exiting out of this will stop the application.

If you run 
```bash
docker ps
```

You should see a NginxProxyManager that is (Started), Goto [Post install](#post-install-setup)

---

## Proxmox

### Install via Proxmox Scripts 

Installing via [Scripts](https://tteck.github.io/Proxmox/) is very simple, just run the below command (Double check is still correct) from the Proxmox WebUI Shell. 

:::tip
Make sure to install Docker compose when prompted.
:::

```bash
bash -c "$(wget -qLO - https://github.com/tteck/Proxmox/raw/main/ct/nginxproxymanager.sh)"
```

---

## Post-install setup 

The Admin panel should now be available at the ip_address_of_machine:81 and port 80 should return a congratulations page. 

By default the application will ship with a default username and default password, this is majorly insecure to leave as default options even if your port 81 isn't open. 
```
Email:    admin@example.com
Password: changeme
```
Login using the credentials and change the email and the password to something far more secure. 