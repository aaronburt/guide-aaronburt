# Useful commands

## File Management



### List a directory 

ls is used to list files and directories within the current directory or a specified directory. It can show various details such as file permissions, sizes, modification times, and more

```bash 
ls -l
```
Long format listing (includes file permissions, number of links, owner, group, size, and timestamp)

```bash
ls -a
```
List all files, including hidden files (files starting with a dot . like .env)

```bash 
ls -lh
```
Long format with human-readable file sizes (e.g., KB, MB)

```bash 
ls -R
```
Recursively list subdirectories.

### Navigate directories 

cd is used to navigate between directories. It changes the current working directory to the specified path

```bash
cd /home/user/
```
Change to the /home/user/ directory

```bash
cd ..
```
Move up one directory level (to the parent directory)


```bash
cd ~
```
Change to the home directory of the current user

```bash
cd -
```
Change back to the previous directory

### Copying 

cp copies files or directories from one location to another.

```bash
cp file.txt /destination/
```
Copy file.txt to the /destination/ directory

```bash
cp -r /source/directory /destination/
```
Recursively copy a directory and its contents to a new location

```bash
cp -p file.txt /destination/
```
Preserve file attributes (e.g., modification time, permissions) while copying useful for backups

```bash
cp -i file.txt /destination/
```
Prompt before overwriting existing files

### Moving

mv is used to move files or directories from one location to another or to rename files or directories. Basically on Windows its a `cut`

```bash 
mv old_name.txt new_name.txt
``` 
Rename old_name.txt to new_name.txt.

```bash 
mv /path/to/file /new/directory/
```
Move a file to a new directory, doesn't require recursive flag (-R) like a `cp` does

### Finding

`find` is a very powerful command used to search for files and directories based on various criteria such as name, size, modification time, and more

```bash 
find / -name file.txt
```
Search for file.txt starting from the root directory (/)

```bash 
find /home/user -type f -name "*.txt"
```
Search for all .txt files in the /home/user/ directory

```bash
find /var/log -mtime -7
```
Find files in /var/log that were modified in the last 7 days

```bash
find / -size +100M
```
Find files larger than 100 MB

```bash
find /path/to/search -exec rm {} \;
```
Find files and execute a command (e.g., remove them)