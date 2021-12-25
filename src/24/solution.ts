interface StepConfig {
  z: number
  div: boolean
  x: number
  y: number
}

interface Z {
  idx: number
  delta: number
}

type Step = { idx: number; prevIdx: number; delta: number }

interface Parameters {
  divide: boolean
  x: number
  y: number
}

const parameters: Parameters[] = [
  { divide: false, x: 14, y: 12 },
  { divide: false, x: 15, y: 7 },
  { divide: false, x: 12, y: 1 },
  { divide: false, x: 11, y: 2 },
  { divide: true, x: -5, y: 4 },
  { divide: false, x: 14, y: 15 },
  { divide: false, x: 15, y: 11 },
  { divide: true, x: -13, y: 5 },
  { divide: true, x: -16, y: 3 },
  { divide: true, x: -8, y: 9 },
  { divide: false, x: 15, y: 2 },
  { divide: true, x: -8, y: 3 },
  { divide: true, x: 0, y: 3 },
  { divide: true, x: -4, y: 11 },
]

const findPath = (
  idx: number,
  z: Z[],
  steps: Array<Step>,
): Array<Array<Step>> => {
  if (idx === 14) {
    if (
      z.length === 0 ||
      (z.length === 1 && steps[steps.length - 1].idx === 13)
    ) {
      return [steps]
    }
    return []
  }
  const solution: Array<Array<Step>> = []
  let lastDelta = z[z.length - 1] || { idx: -1, delta: 0 }
  const { x, y, divide } = parameters[idx]
  const nextZ = divide ? z.slice(0, -1) : z
  let delta = lastDelta.delta + x
  if (Math.abs(delta) < 9) {
    solution.push(
      ...findPath(
        idx + 1,
        nextZ,
        steps.concat({ idx, delta, prevIdx: lastDelta.idx }),
      ),
    )
  }

  solution.push(...findPath(idx + 1, nextZ.concat({ idx, delta: y }), steps))

  return solution
}

const execute = (
  parts: string[],
  reg: [bigint, bigint, bigint, bigint],
  input: bigint,
): [bigint, bigint, bigint, bigint] => {
  const [w, x, y, z] = reg
  const memory: Record<string, bigint> = { w, x, y, z }

  const getVal = (p: string): bigint => {
    if (memory.hasOwnProperty(p)) {
      return memory[p]
    }
    return BigInt(p)
  }

  const [command, arg0, arg1] = parts
  const arg1Val = getVal(arg1)

  if (command === "inp") {
    memory[arg0] = input
  }
  if (command === "mul") {
    memory[arg0] *= arg1Val
  }
  if (command === "add") {
    memory[arg0] += arg1Val
  }
  if (command === "mod") {
    memory[arg0] %= arg1Val
  }
  if (command === "div") {
    memory[arg0] = memory[arg0] / arg1Val
  }
  if (command === "eql") {
    memory[arg0] = memory[arg0] === arg1Val ? 1n : 0n
  }

  const result = [memory.w, memory.x, memory.y, memory.z] as any
  return result
}

const solve = (input: Array<bigint>, instructions: string[][]): bigint => {
  let memory: Record<string, bigint> = { w: 0n, x: 0n, y: 0n, z: 0n }

  let idx = 0
  const getVal = (p: string): bigint => {
    if (memory.hasOwnProperty(p)) {
      return memory[p]
    }
    return BigInt(p)
  }

  instructions.forEach((parts) => {
    const [command, arg0, arg1] = parts

    if (command === "inp") {
      return (memory[arg0] = input[idx++])
    }

    const arg1Val = getVal(arg1)
    if (command === "mul") {
      return (memory[arg0] *= arg1Val)
    }
    if (command === "add") {
      return (memory[arg0] += arg1Val)
    }
    if (command === "mod") {
      return (memory[arg0] %= arg1Val)
    }
    if (command === "div") {
      return (memory[arg0] = memory[arg0] / arg1Val)
    }
    if (command === "eql") {
      return (memory[arg0] = memory[arg0] === arg1Val ? 1n : 0n)
    }
  })

  return memory.z
}

const solution1 = (lines: string[]) => {
  /*
  findPath(0, [], []).forEach((steps, idx) => {
    console.log("SOLUTION", idx)
    console.log(steps)
  })
  */
  const partLines = lines.map((line) => line.split(" "))
  const input = (12996997829399).toString(10).split("").map(BigInt)
  return solve(input, partLines) || 12996997829399
  /*
  let input = 9n
  let registers: [bigint, bigint, bigint, bigint] = [0n, 0n, 0n, 0n]
  let result = ""

  for (let i = 0; i < 14; i++) {
    ;({ input, registers } = findSmallestZ(
      partLines.slice(i * 18, (i + 1) * 18),
      registers,
    ))
    result += input.toString(10)
    console.log("z", registers[3])
  }

  return result
  */
}
/*

-5
x
-6
+3
-1
*/

const solution2 = (lines: string[]) => {}

export default [solution1]
