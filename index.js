#!/usr/bin/env node
const request = require('request')
const { spawn } = require('child_process')
const args = require('args')
const fse = require('fs-extra')
const os = require('os')
const path = require('path')
const ResoMap = {
    "1K": '1920x1080',
    "2K": '2560x1440',
    "4K": "3840x2160"
}
const defaultImageStoragePath = path.join(os.homedir(), "Pictures", "simple-wallpaper")

args.option("tags", 'Tag to send eg. "nature,night"', "")
    .option("reso", 'Resolution to download eg. 1920x1080 or 1K，2K, 4K', "")
    .option("path", "Path to store image", defaultImageStoragePath)
const flags = args.parse(process.argv)


const format = ".jpeg"
const unsplashImgIDKey = "x-imgix-id"
const configPath = path.join(os.homedir(), ".swprc")


function processWithUrl(url, pathToSave) {
    request(url, {
        encoding: 'binary',
        proxy: 'http://127.0.0.1:7777'
    }, async (err, resp, body) => {
        if (err) {
            console.log(err)
            return
        }
        let imageId = resp.headers[unsplashImgIDKey]
        let fullPath = path.resolve(path.join(defaultImageStoragePath, imageId + format))
        try {
            await fse.ensureDir(pathToSave)
            await fse.writeFile(fullPath, body, 'binary')
            setWallPaper(fullPath)
            console.log('Done')
        } catch (fs_err) {
            console.log(fs_err)
        }
    })
}
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
 * @param {string} tags 
 * @param {string} resoStr 
 */
function buildUrl(tags, resoStr) {
    const baseUrl = "https://source.unsplash.com"
    let targetPath = `${baseUrl}/${(typeof tags !== "string" || tags === "") ? "random" : "featured"}`
    if (resoStr !== "") {
        let mapped = ResoMap[resoStr]
        if (mapped) {
            targetPath = `${targetPath}/${mapped}`
        } else {
            targetPath = `${targetPath}/${resoStr}`
        }
    }
    if (tags && typeof tags === "string") {
        let parsedTags = tags.split(",").map((str => str.trim())).join(",")
        targetPath = `${targetPath}/?${parsedTags}`
    }

    return targetPath
}

async function saveConfig(tags, reso, savePath) {
    let obj = { tags, reso, savePath }
    let str = JSON.stringify(obj, undefined, 4)
    await fse.writeFile(configPath, str)
}
/**
 * @returns {Promise<{tags:string,reso:string,savePath:string}>}
 */
async function loadConfig() {
    if (!await fse.pathExists(configPath)) {
        await saveConfig("", "1K", defaultImageStoragePath)
    }
    let data = (await fse.readFile(configPath)).toString()
    return JSON.parse(data)
}
; (async function () {
    let defaltConfig = await loadConfig()
    let newUrl = buildUrl(flags.tags || defaltConfig.tags, flags.reso || defaltConfig.reso)
    await saveConfig(flags.tags || defaltConfig.tags, flags.reso || defaltConfig.reso, flags.path)
    processWithUrl(newUrl, flags.path)
}())