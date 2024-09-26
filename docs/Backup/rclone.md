---
title: RClone Backup with Cronjob
---


Let me introduce you to a fast and easy method for backing up your data to the cloud. 

:::warning
Instructions are based on Linux bash shell, therefore it may vary if you use powershell or sh
:::

## Installation

First we need to install rclone on the machine of choice. This will download the install.sh script and execute it as a superuser. The install.sh will download the binary and mount it to the path variables.
```bash
sudo -v ; curl https://rclone.org/install.sh | sudo bash
```

## Setup Remote

1. Begin by running the command `rclone config`.
2. Next, create a new remote configuration.
3. Assign a suitable name to the new remote.
4. Input the Google Drive remote ID when prompted.
5. If asked for a client ID and client secret, simply press enter to skip.
6. Define the scope option as 1 for full access.
7. Avoid making any changes to the advanced configuration settings.
8. If you're accessing via SSH and asked for web-browser authentication, select 'n' and proceed to authorize.
9. Once authorised you should now be able to list you Google Drive contents with `rclone ls GoogleDriveRemoteName:`

## Copy files from source to remote

```bash
rclone copy ./backup GoogleDriveRemoteName: -v
```

## Cronjob

Run ```crontab -e``` and then edit with the editor of your choice and insert the following on a new line.

```bash
0 0 * * * /usr/bin/rclone copy ./backup GoogleDriveRemoteName: -v >> /var/log/backup.txt 2>&1
```

This will invoke the rclone copy command to run once per day at 00:00 and log the output to backup.txt 
