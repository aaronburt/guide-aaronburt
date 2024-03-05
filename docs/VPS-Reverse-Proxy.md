---
title: VPS Reverse Proxy with Tailscale
---

## Introduction

Your goal is to share local services like a [Homepage](https://gethomepage.dev) but you don't want to use Cloudflare Tunnels or expose your personal network IP address to the internet. You might be also be unable to do so as your network is inside a [CGNAT](https://en.wikipedia.org/wiki/Carrier-grade_NAT)

## Why not Cloudflare Tunnels?

![IMAGE](https://storj.aaronburt.co.uk/BEAST/1708243673/cf_bg.png)
***Example of how Cloudflare Tunnel works***

Cloudflare Tunnels is a convenient deployment service but has some noteworthy drawbacks.
Firstly, Cloudflare enforces bandwidth limits in its Terms of Service, stating that users must not exceed allocated bandwidth to avoid causing an undue burden on the services and connected networks. However, the specific bandwidth limit is arbitrary and at the discretion of Cloudflare.

Secondly, as Cloudflare acts as your SSL provider, it technically has the capability to read all your transmissions. This includes sensitive information like passwords and cookies transmitted from your browser to your local service. This raises concerns about the privacy and security of your data.

Lastly, Cloudflare reserves the right to terminate your tunnel or discontinue Tunnels as a product at any time and for any reason. This reliance on their goodwill for service and updates poses a potential risk to the continuity of your deployment.

### What is the alternative?

Numerous alternatives are available, but the prevalent choice for deployment involves using a Virtual Private Server (VPS). This setup hosts a reverse proxy server that connects to your local network via a VPN. Although there are various configurations for VPS, VPN, and reverse proxy, this tutorial will specifically cover the use of Tailscale and Nginx Proxy Manager.

Addressing the first three problems with Cloudflare Tunnels:

1. Bandwidth Limitations: By using a VPS with a reverse proxy and VPN, you have more control over bandwidth allocation. Cloudflare's arbitrary bandwidth limits are circumvented, allowing for a more tailored and flexible approach.

2. Data Privacy: Utilizing a VPS and VPN architecture ensures that your transmissions remain within your controlled network. Unlike Cloudflare, which, due to its SSL provider role, could technically read all transmissions, this approach enhances data privacy and security.

3. Service Reliability: Unlike Cloudflare's potential for abrupt termination, managing your deployment on a VPS provides greater autonomy. You are not solely reliant on Cloudflare's goodwill, reducing the risk of unexpected service interruptions or discontinuations.

## Requirements

### Trustworthy Debian/Ubuntu VPS with Root Access
Choose a reliable Debian/Ubuntu VPS with root access. Here are some options, but the list is not exhaustive:
* Oracle Cloud Free Tier
* Google Cloud Always Free
* Linode Paid $5 Tier
* Scaleway Paid $3 Tier

After choosing, ensure your VPS is up to date with the latest version using the following commands:

```bash
apt-get update && apt-get upgrade -y
```

### A Tailscale account 

You'll need a [Tailscale](https://tailscale.com/) account.

:::tip
While this tutorial doesn't delve into it, if you have concerns about Tailscale's coordination server having control over your devices, an alternative option is to install Headscale. Headscale serves as an unofficial coordination server, providing users with more control and autonomy over the coordination aspect of their network setup. This choice allows you to address potential privacy or control-related apprehensions associated with relying on Tailscale's coordination server.
:::


### Local machine that will host

Make sure you have a local machine ready to host the application in question. Now you're all set to dive into the guide!


## Installing Docker

Installing Docker on Debian-based machines is straightforward. Simply run the following one-liner provided by Docker:

```bash
curl https://get.docker.com | sh
```

This command will install Docker, Docker-cli, and Docker Compose, essential components for running Nginx Proxy Manager.

Check Docker is running with `docker run hello-world`, this will pull, run and output to the user a docker script that just says hello to verify docker is working as intended. The result should look like this on the ssh terminal: 

![IMAGE](https://storj.aaronburt.co.uk/BEAST/1707888861/WindowsTerminal_yHf6zFE1hX.png)




:::tip[Optional but recommended]
For enhanced security, I highly recommend establishing a 'Rootless' user and including this user in the 'Docker' group. This allows the user to execute Docker commands without granting containers excessive permissions.
:::

```bash
sudo useradd -m nginx
sudo usermod -aG docker nginx
```


## Setup Tailscale

Setting up Tailscale is a simple two line execution, run:

```bash
curl -fsSL https://tailscale.com/install.sh | sh
```
This command will add the repos, and install the tailscale application including the required wireguard client. You now need to run the following command to start the Tailscale client.

```bash
tailscale up
```

Once you have succesfully authenticated the machine you can access the list of the machines from the [Tailscales](https://login.tailscale.com) Admin panel. You need need to install the corresponding Tailscale client on the home server to allow both machines to connect to each other via an encrypted Wireguard tunnel.

To verfiy the machines are both added either consult the Admin panel or run `tailscale status` from either machine. Following on from that just run a quick test by pinging the other machine for example: 

```bash 
tailscale ping vps-server-machine-name-can-be-seen-from-admin-panel
```
If you have connected to each other then that great!

:::tip
If you see that the ping was succeessful but it mentions a (via Derp); thats ok, That means its being relayed while Tailscale tries to work out a direct connection, the information is still encrypted. Clients normally should find a direct route to each other within a few hours at most, if its still failing after that then you might need to consult a support forum.
:::

## Setup Nginx Proxy Manager


* Begin by establishing a directory named "Nginx." in either root or the rootless users folder
* Within this directory, generate a file named "docker-compose.yml" and input the provided contents (e.g., using nano: `nano docker-compose.yml`).

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

Next boot up the container with 

```bash
docker compose up -d
```

Upon successful execution, the output should indicate 'created' followed by an ID. Verify the running container status using `docker ps`.

### Signing into NPM

It's very important to login to the admin panel of the NPM as you need to change the username and password from their insecure defaults. 

```yaml
Email:    admin@example.com
Password: changeme
```

After updating the account credentials, you're good to go with the User Interface to initiate address proxying. Tailscale addresses, like your local machine's, can be reached using either the Tailscale IP address (e.g., 100.121.107.58) or the Tailnet DNS name if you've enabled 'Magic DNS' on the admin panel (e.g., local-machine.random-word.ts.net). Dealing with SSL certs creation, management, and DNS service setup involves too much variation for me to cover, so I'll leave that in your capable hands.


## Tailscale ACL Policies 

[Access Control Lists](https://login.tailscale.com/admin/acls/file) are very easier to make mistakes with, You are attempting to narrowly allow as much access to machines as deemed necessary without breaking things, it can sometimes be an extremely fine line. 

By default, Tailscale associates each machine with your email address, visible in the admin panel, indicating ownership. To make ACL policies effective, we must disconnect your email from the machine.

This is achieved by introducing a 'tag' that removes your direct ownership, rendering the machine without network permissions unless explicitly specified.

Let's start by creating a group to collectively own the 'tag':

```json
"groups": {
    "group:admin": ["example@gmail.com"],
},
```

Next, define the existence of the tag for application to the machine:

```json
"tagOwners": {
    "tag:external":  ["group:admin"],
},
```

Finally, specify where the tags are allowed to connect, including the option to designate other tags as destinations:

```json
"acls": [
	{
		"action": "accept",
		"src":    ["tag:external"],
		"dst":    ["100.000.000.102:53", "local:*"],
	},
]
```

In this example, the tag 'external' has access to view port 53 on the 102 address and any port on machines tagged as 'local'. To apply these tags, navigate to the Tailscale admin panel, click the three dots next to 'Last Seen' for each machine, and select 'Edit ACL Tags...'.

Be cautious, as selecting any ACL will require a full reauthentication of the machine if removal is attempted later on.


## Congratulations

You've successfully managed to setup powerful and secure alternative to Cloudflare Tunnels. If you want to increase your security further you should investigate Fail2ban, SSH Key Authentication and auto-upgrades.