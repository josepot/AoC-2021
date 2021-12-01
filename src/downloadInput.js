const fs = require("fs")
const path = require("path")
const https = require("https")
const getSession = require("./getSession")

const relPath = path.resolve(__dirname)
const [, , day_, year_] = process.argv
const now = new Date()

const year = year_ || now.getFullYear()
const day = day_ || now.getDate()

const getFile = (session) =>
  new Promise((resolve, reject) =>
    https
      .get(
        {
          hostname: "adventofcode.com",
          path: `/${year}/day/${day}/input`,
          method: "GET",
          headers: {
            Cookie: `session=${session}`,
          },
        },
        resolve,
      )
      .on("error", reject),
  )

const writeFile = (stream) =>
  new Promise((resolve, reject) => {
    const file = fs.createWriteStream(`${relPath}/${day}/input`)
    stream.pipe(file)
    file.on("finish", file.close.bind(file, resolve))
    file.on("error", reject)
  })

getSession()
  .then(getFile)
  .then(writeFile)
  .catch((e) => {
    console.log("Error downloading the file")
    console.log(e)
  })
