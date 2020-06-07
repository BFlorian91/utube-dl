const fs = require('fs')
const youtubedl = require('youtube-dl')
const colors = require('colors')

const url = process.argv.slice(2, 3)

const usage = () => {
  console.log('usage: node dl.js {type of download(video or playlist)} {youtubeUrl}')
}

const videoDownload = url => {
  // 'use strict'
  const video = youtubedl(url)

  video.on('error', err => {
    console.log('error 2:', err)
  })

  let size = 0
  let name = ''
  video.on('info', info => {
    size = info.size
    name = info._filename
    video.pipe(fs.createWriteStream(info._filename))
  })

  let pos = 0
  video.on('data', chunk => {
    pos += chunk.length

    if (size) {
      const percent = (pos / size * 100).toFixed(2)
      process.stdout.cursorTo(0)
      // process.stdout.clearLine(1)
      process.stdout.write('Download'.rainbow + `: ${name} at ${percent}%`.green)
    }
  })

  video.on('next', videoDownload)
  process.stdout.write('\n')
}

const urlIsValid = (url) => {
  if (url.slice(0, 24) === 'https://www.youtube.com/' ||
    url.slice(0, 16) === 'www.youtube.com/' ||
    url.slice(0, 12) === 'youtube.com/') {
    return true
  }
  return false
}

urlIsValid(url[0]) ? videoDownload(url[0]) : usage()
