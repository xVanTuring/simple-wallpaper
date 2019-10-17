#!/usr/bin/env node
const request = require('request')
const { spawn } = require('child_process')
const fse = require('fs-extra')
const os = require('os')
const path = require('path')
const Reso = {
    "1080": '1920x1080',
    "2K": '2560x1440',
    "4K": "3840x2160"
}
// let randomUrlWithSize = `https://source.unsplash.com/random/${Reso["1080"]}`
let featuredUrlWithSize = `https://source.unsplash.com/featured/${Reso["1080"]}`
let imageStoragePath = path.join(os.homedir(), "Pictures", "simple-wallpaper")
const format = ".jpeg"
const unsplashImgIDKey = "x-imgix-id"
request(appendTags(featuredUrlWithSize, ['female','dark']), {
    encoding: 'binary',
    proxy: 'http://127.0.0.1:7777'
}, async (err, resp, body) => {
    if (err) {
        console.log(err)
        return
    }
    let imageId = resp.headers[unsplashImgIDKey]
    let fullPath = path.resolve(path.join(imageStoragePath, imageId + format))
    try {
        await fse.ensureDir(imageStoragePath)
        await fse.writeFile(fullPath, body, 'binary')
        setWallPaper(fullPath)
        console.log('Done')
    } catch (fs_err) {
        console.log(fs_err)
    }
})
function setWallPaper(imgPath) {
    spawn('gsettings', [
        'set',
        'org.gnome.desktop.background',
        'picture-uri',
        'file://' + imgPath
    ])
}
/**
 * 
 * @param {string} url 
 * @param {string[]} tags 
 */
function appendTags(url, tags) {
    return `${url}/?${tags.join(',')}`
}