type Pair = [Pair | number, Pair | number]

const addLeft = (left: Pair | number, value: number): Pair | number => {
  if (typeof left === "number") return left + value
  return [addLeft(left[0], value), left[1]]
}

const addRight = (right: Pair | number, value: number): Pair | number => {
  if (typeof right === "number") return right + value
  return [right[0], addRight(right[1], value)]
}

const explode = (
  pair: Pair | number,
  level = 1,
): { left?: number; right?: number; pair: Pair | number } => {
  if (typeof pair === "number") return { pair }

  if (level === 5)
    return {
      left: pair[0] as number,
      right: pair[1] as number,
      pair: 0,
    }

  const leftExplosion = explode(pair[0], level + 1)

  if (leftExplosion.pair !== pair[0])
    return {
      left: leftExplosion.left,
      pair: leftExplosion.right
        ? [leftExplosion.pair, addLeft(pair[1], leftExplosion.right)]
        : [leftExplosion.pair, pair[1]],
    }

  const rightExplosion = explode(pair[1], level + 1)

  return rightExplosion.pair === pair[1]
    ? { pair }
    : {
        right: rightExplosion.right,
        pair: rightExplosion.left
          ? [addRight(pair[0], rightExplosion.left), rightExplosion.pair]
          : [pair[0], rightExplosion.pair],
      }
}

function split(input: Pair | number): Pair | number {
  if (typeof input === "number") {
    const half = input / 2
    return input > 9 ? [Math.floor(half), Math.ceil(half)] : input
  }

  const leftSplit = split(input[0])
  if (leftSplit !== input[0]) return [leftSplit, input[1]]

  const rightSplit = split(input[1])
  return rightSplit === input[1] ? input : [input[0], rightSplit]
}

function reduced(input: Pair): Pair {
  let current = input
  let next = current

  do {
    current = next
    next = explode(current).pair as Pair
  } while (next !== current)

  next = split(current) as Pair
  return next === current ? current : reduced(next)
}

const parseLine = (line: string): Pair => JSON.parse(line)

const addPair = (a: Pair, b: Pair): Pair => [a, b]

const magnitude = (input: Pair | number): number =>
  typeof input === "number"
    ? input
    : magnitude(input[0]) * 3 + magnitude(input[1]) * 2

const solution1 = (lines: string[]) =>
  magnitude(lines.map(parseLine).reduce((a, b) => reduced(addPair(a, b))))

const solution2 = (lines: string[]) => {
  const parsed = lines.map(parseLine)
  let result = -Infinity

  for (let i = 0; i < lines.length - 1; i++) {
    for (let z = i + 1; z < lines.length; z++) {
      const t = magnitude(reduced(addPair(parsed[i], parsed[z])))
      result = Math.max(t, result)
    }
  }

  return result
}

export default [solution1, solution2]
