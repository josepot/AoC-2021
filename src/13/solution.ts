import printPositionsMap from "../utils/printPositionsMap"
enum FoldType {
  x,
  y,
}
interface Fold {
  type: FoldType
  value: number
}

const solution1 = (lines: string[]) => {
  const dots = new Set<string>()
  let foundFold = false
  const folds: Fold[] = []

  lines.forEach((line) => {
    if (!line) return (foundFold = true)

    if (!foundFold) {
      dots.add(line)
    } else {
      const text = line.slice(11)
      const type = text.startsWith("x=") ? FoldType.x : FoldType.y
      const value = Number(text.slice(2))
      folds.push({ type, value })
    }
  })

  const foldX = (xLine: number) => {
    ;[...dots].forEach((rawDot) => {
      const [x, y] = rawDot.split(",").map(Number)
      if (x > xLine) {
        dots.delete(rawDot)
        const newX = xLine - (x - xLine)
        dots.add(`${newX},${y}`)
      }
    })
  }

  const foldY = (yLine: number) => {
    ;[...dots].forEach((rawDot) => {
      const [x, y] = rawDot.split(",").map(Number)
      if (y > yLine) {
        dots.delete(rawDot)
        const newY = yLine - (y - yLine)
        dots.add(`${x},${newY}`)
      }
    })
  }

  folds.forEach((fold) => {
    const firstFold = fold
    const foldFn = firstFold.type === FoldType.x ? foldX : foldY
    foldFn(firstFold.value)
  })

  const positionsMap = new Map<string, string>()
  dots.forEach((dot) => {
    positionsMap.set(dot, dot)
  })

  return printPositionsMap(positionsMap, (x) => (dots.has(x) ? "#" : "."))
}

const solution2 = (lines: string[]) => {}

export default [solution1]
