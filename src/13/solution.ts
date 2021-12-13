import printPositionsMap from "../utils/printPositionsMap"
enum FoldType {
  x,
  y,
}
interface Fold {
  type: FoldType
  value: number
}

const parseInput = (lines: string[]): { dots: Set<string>; folds: Fold[] } => {
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

  return { dots, folds }
}

const fold = (fold: Fold, dots: Set<string>) => {
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

  const foldFn = fold.type === FoldType.x ? foldX : foldY
  foldFn(fold.value)
}

const solution1 = (lines: string[]) => {
  const { dots, folds } = parseInput(lines)
  fold(folds[0], dots)

  return dots.size
}

const solution2 = (lines: string[]) => {
  const { dots, folds } = parseInput(lines)

  folds.forEach((f) => {
    fold(f, dots)
  })

  return printPositionsMap(new Map([...dots].map((dot) => [dot, dot])), (dot) =>
    dots.has(dot) ? "#" : ".",
  )
}

export default [solution1, solution2]
