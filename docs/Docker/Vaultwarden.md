# Vaultwarden

These containers manage a secure password storage system using Vaultwarden. The "vaultwarden" container functions as the main server for password storage and access, while the "vaultwarden-backup" container ensures regular backups of this data, maintaining its security and integrity.


### ADMIN_TOKEN

Admin token is the password for the /admin panel of Vaultwarden. This is an extremely sensitive area there setting a very strong password is very reccommended. This isn't strictly required so if you don't need the admin panel you could always remove that line and not have the /admin panel enabled at all. 

If you want it enabled and have decided upon a secure password write the command below but replace the `"secretPasswordForAdminToken"` with your password.

```bash
echo -n "secretPasswordForAdminToken" | argon2 "$(openssl rand -base64 32)" -e -id -k 65540 -t 3 -p 4
```
This will echo out the argon2 hash of the password, place the hash in the `ADMIN_TOKEN` variable but where you see a $ sign you need to add an extra one otherwise Docker will think its a environment variable and it will break.


Download the docker-compose file directly into your current directory. 

```bash
curl -O https://guide.aaronburt.co.uk/source/vaultwarden/docker-compose.yml
```

```yaml
version: '3'

services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    user: 1000:1000
    restart: always
    volumes:
      - ./vw-data/:/data/
    ports:
      - 8080:80
    environment: 
      - SMTP_HOST= #smtp server THE GMAIL SMTP WORKS IF YOU USE AN 'APP PASSWORD'
      - SMTP_FROM= #email 
      - SMTP_PORT= #smtp port
      - SMTP_SECURITY= #force_ssl or starttls or off
      - SMTP_USERNAME= # email 
      - SMTP_PASSWORD= # email password
      - SIGNUPS_ALLOWED=false
      - SHOW_PASSWORD_HINT=true
      - ADMIN_TOKEN= #ARGON2 use $$ to string escape 

  vaultwarden-backup:
    image: bruceforce/vaultwarden-backup
    container_name: vaultwarden-backup
    restart: always
    volumes:
      - ./backup/:/backup/ # You can specifiy this to be anywhere on the machine or even a remote samba share
    volumes_from:
      - vaultwarden
    environment:
      - CRON_TIME=0 0 * * *
      - BACKUP_DIR=/backup
      - BACKUP_ON_START=true
      - TIMESTAMP=true
      - DELETE_AFTER=2
      - UID=1000
      - GID=1000
```
