---
title: RClone Backup with Cronjob
---

Here’s a quick and straightforward method for backing up your data to the cloud.  
:::warning
Instructions are based on a Linux bash shell, so they may vary if you use PowerShell or a different shell.
:::

## Installation
To install rclone on your machine, run:
```bash
sudo -v ; curl https://rclone.org/install.sh | sudo bash
```
This command downloads the install.sh script, runs it with elevated privileges, and automatically updates your system path with rclone.

## Setup Remote
1. Run `rclone config`.
2. Create a new remote configuration.
3. Assign a name for your remote. (For example, use “MY_GOOGLE_DRIVE_REMOTE”.)
4. When prompted, provide the Google Drive remote ID.
5. Skip client ID and client secret by pressing Enter.
6. Set the scope to “1” for full access.
7. Leave advanced configuration settings unchanged unless you have specific requirements.
8. If using SSH, select “n” for web-browser authentication and follow the prompt to authorize rclone.
9. Once authorized, you can verify your Google Drive files by running:
   ```bash
   rclone ls MY_GOOGLE_DRIVE_REMOTE:
   ```

## Copy Files from Source to Remote
```bash
rclone copy ./backup MY_GOOGLE_DRIVE_REMOTE: -v
```
This command copies all files from the local “backup” directory to your remote storage.

## Cronjob
Open your crontab by running:
```bash
crontab -e
```
Add the following new line to schedule the backup to run daily at midnight:
```bash
0 0 * * * /usr/bin/rclone copy ./backup MY_GOOGLE_DRIVE_REMOTE: -v >> /var/log/backup.txt 2>&1
```
This line executes the rclone copy command at 00:00 each day and writes the backup log to “backup.txt”.