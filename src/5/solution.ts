import printPositionsMap from "utils/printPositionsMap"
interface Point {
  x: number
  y: number
}
const processLine = (line: string): { from: Point; to: Point } => {
  const [fromRaw, toRaw] = line.split(" -> ")
  const [xFrom, yFrom] = fromRaw.split(",").map(Number)
  const [xTo, yTo] = toRaw.split(",").map(Number)
  return {
    from: { x: xFrom, y: yFrom },
    to: { x: xTo, y: yTo },
  }
}

const solution1 = (rawLines: string[]) => {
  const lines = rawLines
    .map(processLine)
    .filter(({ from, to }) => from.x === to.x || from.y === to.y)
  const points = new Map<string, number>()

  lines.forEach((line) => {
    if (line.from.x === line.to.x) {
      const x = line.from.x
      const [start, end]: [number, number] =
        line.to.y > line.from.y
          ? [line.from.y, line.to.y]
          : [line.to.y, line.from.y]
      for (let y = start; y < end + 1; y++) {
        const id = `${x},${y}`
        points.set(id, (points.get(id) ?? 0) + 1)
      }
    } else {
      const y = line.from.y
      const [start, end]: [number, number] =
        line.to.x > line.from.x
          ? [line.from.x, line.to.x]
          : [line.to.x, line.from.x]
      for (let x = start; x < end + 1; x++) {
        const id = `${x},${y}`
        points.set(id, (points.get(id) ?? 0) + 1)
      }
    }
  })

  return [...points.values()].filter((value) => value > 1).length
}

const solution2 = (rawLines: string[]) => {
  const lines = rawLines.map(processLine)
  const points = new Map<string, number>()

  lines.forEach((line) => {
    if (line.from.x === line.to.x) {
      const x = line.from.x
      const [start, end]: [number, number] =
        line.to.y > line.from.y
          ? [line.from.y, line.to.y]
          : [line.to.y, line.from.y]
      for (let y = start; y < end + 1; y++) {
        const id = `${x},${y}`
        points.set(id, (points.get(id) ?? 0) + 1)
      }
    } else if (line.from.y === line.to.y) {
      const y = line.from.y
      const [start, end]: [number, number] =
        line.to.x > line.from.x
          ? [line.from.x, line.to.x]
          : [line.to.x, line.from.x]
      for (let x = start; x < end + 1; x++) {
        const id = `${x},${y}`
        points.set(id, (points.get(id) ?? 0) + 1)
      }
    } else {
      const xMultiplier = line.from.x > line.to.x ? -1 : 1
      const yMultiplier = line.from.y > line.to.y ? -1 : 1

      const delta = Math.abs(line.to.x - line.from.x)

      for (let i = 0; i < delta + 1; i++) {
        const x = line.from.x + i * xMultiplier
        const y = line.from.y + i * yMultiplier
        const id = `${x},${y}`
        points.set(id, (points.get(id) ?? 0) + 1)
      }
    }
  })

  return [...points.values()].filter((value) => value > 1).length
}

export default [solution1, solution2]
