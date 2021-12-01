const path = require("path")
const fs = require("fs")
const { promisify } = require("util")
const relPath = path.resolve(__dirname)
const readFile = promisify(fs.readFile)

module.exports = () =>
  readFile(`${relPath}/../.session`, "utf-8")
    .then((x) => x.replace("\n", ""))
    .catch(() => "")
