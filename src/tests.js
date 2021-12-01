const fs = require("fs")
const { promisify } = require("util")
const path = require("path")
const readline = require("readline")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
const askQuestion = (x) => new Promise((res) => rl.question(x, res))

const readFile = promisify(fs.readFile)
const relPath = path.resolve(__dirname)

const getInput = (text) => {
  const lines = text.split("\n")
  let input
  if (lines.length > 1) {
    lines.splice(-1, 1)
    input = lines
  } else {
    input = lines[0]
  }
  return input
}

async function manualCheck(expected, output) {
  console.log("")
  console.log(`expected: ${expected}`)
  console.log(`received:\n${output}`)
  const response = await askQuestion("is it correct?(y)")
  console.log("")
  return !response || response.toUpperCase() === "Y"
}

Promise.all(
  Array(25)
    .fill(null)
    .map((_, idx) => idx + 1)
    .filter((day) => fs.existsSync(`${relPath}/${day}/outputs`))
    .map((day) =>
      Promise.all([
        readFile(`${relPath}/${day}/input`, "utf-8").then(getInput),
        readFile(`${relPath}/${day}/outputs`, "utf-8").then(getInput),
      ]).then(async ([lines, outputs]) => {
        const mod = require(`./${day}/solution.ts`)
        const fns = mod.default || mod
        return Promise.all(
          fns
            .map((fn) => fn(lines))
            .map((x) => (x instanceof Promise ? x : Promise.resolve(x)))
            .map(async (p, idx) => {
              const received = await p.then((x) => x.toString())
              const expected = outputs[idx]

              if (received.indexOf("\n") > -1)
                return [day, idx, expected, received]

              if (received === expected) {
                console.log("\x1b[32m", `Day ${day} part ${idx + 1} ok`)
              } else {
                console.log("\x1b[31m", `Day ${day} part ${idx + 1} ko`)
              }
            }),
        ).then((results) => results.filter(Boolean))
      }),
    ),
).then(async (x) => {
  const manualChecks = x.filter((x) => x.length > 0).flat()
  for (let i = 0; i < manualChecks.length; i++) {
    const [day, idx, expected, received] = manualChecks[i]
    const isOk = await manualCheck(expected, received)
    if (isOk) {
      console.log("\x1b[32m", `Day ${day} part ${idx + 1} ok`)
    } else {
      console.log("\x1b[31m", `Day ${day} part ${idx + 1} ko`)
    }
  }
  rl.close()
})
