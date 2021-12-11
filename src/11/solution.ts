import { readGrid } from "utils/readGrid"

const getId = (x: number, y: number) => `${x},${y}`
const solution1 = (lines: string[]) => {
  let grid = readGrid(lines, Number)

  let total = 0
  for (let i = 0; i < 100; i++) {
    const flashes = new Set<string>()
    let latestFlashes: Array<{ x: number; y: number }> = []

    latestFlashes = []
    grid = grid.map((val, x, y) => {
      const id = getId(x, y)
      if (flashes.has(id)) return val
      if (val === 9) {
        flashes.add(id)
        latestFlashes.push({ x, y })
        return 0
      }
      return val + 1
    })

    while (latestFlashes.length > 0) {
      const nextLatestFlashes: Array<{ x: number; y: number }> = []

      latestFlashes.forEach(({ x, y }) => {
        grid.getAllNeighboursPos(x, y).forEach(([xx, yy]) => {
          const id = getId(xx, yy)
          if (flashes.has(id)) return
          const val = grid.getCell(xx, yy)
          if (val === 9) {
            flashes.add(id)
            nextLatestFlashes.push({ x: xx, y: yy })
            grid.data[yy][xx] = 0
            return
          }
          grid.data[yy][xx] = val + 1
        })
      })
      latestFlashes = nextLatestFlashes
    }
    total += flashes.size
    flashes.clear()
  }
  return total
}

const solution2 = (lines: string[]) => {
  let grid = readGrid(lines, Number)

  let flashes = new Set<string>()
  let result = 0
  while (flashes.size !== 100) {
    flashes.clear()
    let latestFlashes: Array<{ x: number; y: number }> = []

    latestFlashes = []
    grid = grid.map((val, x, y) => {
      const id = getId(x, y)
      if (flashes.has(id)) return val
      if (val === 9) {
        flashes.add(id)
        latestFlashes.push({ x, y })
        return 0
      }
      return val + 1
    })

    while (latestFlashes.length > 0) {
      const nextLatestFlashes: Array<{ x: number; y: number }> = []

      latestFlashes.forEach(({ x, y }) => {
        grid.getAllNeighboursPos(x, y).forEach(([xx, yy]) => {
          const id = getId(xx, yy)
          if (flashes.has(id)) return
          const val = grid.getCell(xx, yy)
          if (val === 9) {
            flashes.add(id)
            nextLatestFlashes.push({ x: xx, y: yy })
            grid.data[yy][xx] = 0
            return
          }
          grid.data[yy][xx] = val + 1
        })
      })
      latestFlashes = nextLatestFlashes
    }
    result++
  }
  return result
}

export default [solution1, solution2]
