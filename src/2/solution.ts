const solution1 = (lines: string[]) => {
  const instructions = lines.map((line) => {
    const result = line.split(" ")
    return [result[0], Number(result[1])] as const
  })

  let x = 0
  let y = 0
  instructions.forEach(([command, delta]) => {
    if (command === "forward") {
      x += delta
    }
    if (command === "down") {
      y += delta
    }
    if (command === "up") {
      y -= delta
    }
  })
  return x * y
}

const solution2 = (lines: string[]) => {
  const instructions = lines.map((line) => {
    const result = line.split(" ")
    return [result[0], Number(result[1])] as const
  })

  let x = 0
  let y = 0
  let aim = 0
  instructions.forEach(([command, delta]) => {
    if (command === "forward") {
      x += delta
      y += aim * delta
    }
    if (command === "down") {
      aim += delta
    }
    if (command === "up") {
      aim -= delta
    }
  })
  return x * y
}

export default [solution1, solution2]
