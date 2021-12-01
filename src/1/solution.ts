const countIncreasing = (measurements: number[]) =>
  measurements.reduce((acc, current, idx, all) => {
    const prev = all[idx - 1]
    return current > prev ? acc + 1 : acc
  }, 0)

const solution1 = (lines: string[]) => countIncreasing(lines.map(Number))

const solution2 = (lines: string[]) => {
  const measurements = lines
    .map(Number)
    .map((current, idx, all) => current + all[idx + 1] + all[idx + 2])
    .slice(0, -2)
  return countIncreasing(measurements)
}

export default [solution1, solution2]
