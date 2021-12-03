const solution1 = (lines: string[]) => {
  const len = lines[0].length

  const sums = Array(len).fill(0)

  lines.forEach((line) => {
    line.split("").forEach((val, x) => {
      sums[x] += Number(val)
    })
  })

  const first = parseInt(
    sums.map((x) => (x >= lines.length / 2 ? 1 : 0)).join(""),
    2,
  )
  const second = parseInt(
    sums.map((x) => (x >= lines.length / 2 ? 0 : 1)).join(""),
    2,
  )

  return first * second
}

const findNumber = (lines: Array<Array<"0" | "1">>, keepMore: boolean) => {
  let result = lines
  let idx = 0
  while (result.length > 1) {
    const zeros: Array<"0" | "1">[] = []
    const ones: Array<"0" | "1">[] = []

    result.forEach((line) => {
      const target = line[idx] === "0" ? zeros : ones
      target.push(line)
    })

    if (zeros.length === ones.length) {
      result = keepMore ? ones : zeros
    } else {
      const [more, less] =
        zeros.length > ones.length ? [zeros, ones] : [ones, zeros]
      result = keepMore ? more : less
    }
    idx++
  }

  return parseInt(result[0] as unknown as string, 2)
}

const solution2 = (lines: Array<Array<"0" | "1">>) =>
  findNumber(lines, true) * findNumber(lines, false)

export default [solution1, solution2]
