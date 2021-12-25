import { readGrid } from "utils/readGrid"

const solution1 = (lines: string[]) => {
  let grid = readGrid(lines, (x) => x as ">" | "v" | ".")

  let movement = false
  let nSteps = 0

  do {
    movement = false
    nSteps++

    grid = grid.map((val, x, y, arr) => {
      if (val === "." && arr[y][x === 0 ? arr[y].length - 1 : x - 1] === ">")
        return ">"
      if (val === ">" && arr[y][(x + 1) % arr[y].length] === ".") {
        movement = true
        return "."
      }
      return val
    })

    grid = grid.map((val, x, y, arr) => {
      if (val === "." && arr[y === 0 ? arr.length - 1 : y - 1][x] === "v")
        return "v"
      if (val === "v" && arr[(y + 1) % arr.length][x] === ".") {
        movement = true
        return "."
      }
      return val
    })
  } while (movement)

  return nSteps
}

const solution2 = (lines: string[]) => {}

export default [solution1]
