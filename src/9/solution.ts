import { readGrid } from "utils/readGrid"

const solution1 = (lines: string[]) => {
  const grid = readGrid(lines, Number)

  let result = 0
  grid.map((val, x, y) => {
    result += grid.getCrossNeighbours(x, y).every((n) => n > val) ? val + 1 : 0
    return result
  })
  return result
}

const fakeGrid = readGrid(["1"], Number)

type Grid = typeof fakeGrid

const getId = (x: number, y: number) => `${x}-${y}`

const findBasins = (
  grid: Grid,
  foundBasins: Set<string>,
  latestBasins: { x: number; y: number }[],
): Set<string> => {
  if (latestBasins.length === 0) return foundBasins

  const nextOnes = latestBasins
    .map(({ x, y }) => {
      const potentialBasins = grid
        .getCrossNeighboursPos(x, y)
        .filter(([xx, yy]) => !foundBasins.has(getId(xx, yy)))

      const nextLastBasins = potentialBasins.filter(([x, y]) => {
        const val = grid.getCell(x, y)
        return (
          val !== 9 &&
          grid
            .getCrossNeighboursPos(x, y)
            .filter(([xx, yy]) => !foundBasins.has(getId(xx, yy)))
            .map(([xx, yy]) => grid.getCell(xx, yy))
            .every((n) => n >= val)
        )
      })

      return nextLastBasins.map(([xx, yy]) => ({ x: xx, y: yy }))
    })
    .flat()

  nextOnes.forEach(({ x, y }) => {
    foundBasins.add(getId(x, y))
  })

  return findBasins(grid, foundBasins, nextOnes)
}

const solution2 = (lines: string[]) => {
  const grid = readGrid(lines, Number)

  const lowPoints: { x: number; y: number }[] = []
  grid.map((val, x, y) => {
    if (grid.getCrossNeighbours(x, y).every((n) => n > val)) {
      lowPoints.push({ x, y })
    }
    return val
  })

  return lowPoints
    .map(({ x, y }) => findBasins(grid, new Set([getId(x, y)]), [{ x, y }]))
    .map((x) => x.size)
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((a, b) => a * b)
}

export default [solution1, solution2]
