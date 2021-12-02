const fs = require("fs")
const path = require("path")

const relPath = path.resolve(__dirname)
const [, , day_] = process.argv
const now = new Date()

const day = day_ || now.getDate()

const dayFolder = `${relPath}/${day}`
if (!fs.existsSync(dayFolder)) {
  fs.mkdirSync(dayFolder, { recursive: true })
}

const template = `const solution1 = (lines: string[]) => {

}

const solution2 = (lines: string[]) => {

}

export default [solution1]
`

fs.writeFile(dayFolder + "/solution.ts", template, () => {})
