const readInstructions = (lines: string[]) =>
  lines.map((line) => {
    const [instruction, deltaStr] = line.split(" ") as [
      "forward" | "down" | "up",
      string,
    ]
    return [instruction, Number(deltaStr)] as const
  })

const solution1 = (lines: string[]) => {
  let x = 0
  let y = 0

  readInstructions(lines).forEach(([command, delta]) => {
    switch (command) {
      case "forward":
        return (x += delta)
      case "down":
        return (y += delta)
      case "up":
        return (y -= delta)
    }
  })

  return x * y
}

const solution2 = (lines: string[]) => {
  let x = 0
  let y = 0
  let aim = 0

  readInstructions(lines).forEach(([command, delta]) => {
    switch (command) {
      case "forward": {
        x += delta
        y += aim * delta
        break
      }
      case "down":
        return (aim += delta)
      case "up":
        return (aim -= delta)
    }
  })

  return x * y
}

export default [solution1, solution2]
