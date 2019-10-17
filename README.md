# Simple Wallpaper

simple wallpaper for gnome DE based on unsplash

## I & U

``` bash
npm install -g xVanTuring/simple-wallpaper#master
simple-wapper -h
```
Output:
```
  Usage: index.js [options] [command]
  
  Commands:
    help     Display help
    version  Display version
  
  Options:
    -h, --help          Output usage information
    -p, --path [value]  Path to store image (defaults to "/home/xvan/Pictures/simple-wallpaper")
    -r, --reso          Resolution to download eg. 1920x1080 or 1K，2K, 4K (defaults to "")
    -t, --tags          Tag to send eg. "nature,night" (defaults to "")
    -v, --version       Output the version number
  
```
eg
``` bash
simple-wallpaper -t "female,night" -r 2K
```
## E
Configuration file store at `$HOME/.swprc`
By default images store at `$HOME/Picture/simple-wallpaper`