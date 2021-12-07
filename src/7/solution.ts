import { identity } from "rxjs"

const solution = (line: string, diffFn: (x: number) => number = identity) => {
  const positions = line.split(",").map(Number)

  const min = Math.min(...positions)
  const max = Math.max(...positions)
  const deltas = Array(max - min).fill(0)

  for (let i = min; i < max; i++) {
    for (let p = 0; p < positions.length; p++) {
      const diff = Math.abs(positions[p] - i)
      deltas[i - min] += diffFn(diff)
    }
  }

  return Math.min(...deltas)
}

const solution1 = solution
const solution2 = (line: string) =>
  solution(line, (diff) => (diff * (diff + 1)) / 2)

export default [solution1, solution2]
