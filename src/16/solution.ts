interface Literal {
  type: 4
  value: bigint
}

interface Operator {
  type: 0 | 1 | 2 | 3 | 5 | 6 | 7
  value: Array<Package>
}

type InnerPackage = Literal | Operator

interface Package {
  version: number
  start: number
  end: number
  inner: InnerPackage
}

const readPackage = (binaryStr: string, idx: number): Package => {
  let start = idx

  const version = parseInt(binaryStr.substring(idx, idx + 3), 2)
  idx += 3

  const type = parseInt(binaryStr.substring(idx, idx + 3), 2)
  idx += 3

  if (type === 4) {
    let stop = false
    let str = ""
    do {
      stop = binaryStr[idx] === "0"
      idx++

      str += binaryStr.substring(idx, idx + 4)
      idx += 4
    } while (!stop)

    return {
      version,
      start,
      end: idx,
      inner: {
        type: 4,
        value: BigInt("0b" + str),
      },
    }
  }

  const value: Package[] = []

  const lenBits = binaryStr[idx++] === "0" ? 15 : 11
  const len = parseInt(binaryStr.substring(idx, idx + lenBits), 2)

  idx += lenBits
  if (lenBits === 15) {
    const endIdx = idx + len

    do {
      const innerPackage = readPackage(binaryStr, idx)
      idx = innerPackage.end
      value.push(innerPackage)
    } while (idx != endIdx)
  } else {
    do {
      const innerPackage = readPackage(binaryStr, idx)
      idx = innerPackage.end
      value.push(innerPackage)
    } while (value.length < len)
  }

  return {
    version,
    start,
    end: idx,
    inner: {
      type: type as unknown as 0 | 1 | 2 | 3 | 5 | 6 | 7,
      value,
    },
  }
}

const addVersions = (input: Package): number => {
  if (input.inner.type === 4) return input.version
  return (
    input.version +
    input.inner.value.map(addVersions).reduce((a, b) => a + b, 0)
  )
}

const calc = (input: Package): bigint => {
  const { inner } = input
  if (inner.type === 4) return inner.value

  const values = inner.value.map(calc)

  if (inner.type === 0) return values.reduce((a, b) => a + b)
  if (inner.type === 1) return values.reduce((a, b) => a * b)

  if (inner.type === 2) return values.reduce((a, b) => (b < a ? b : a))
  if (inner.type === 3) return values.reduce((a, b) => (b > a ? b : a))

  if (inner.type === 5) return values[0] > values[1] ? 1n : 0n
  if (inner.type === 6) return values[0] < values[1] ? 1n : 0n

  return values[0] === values[1] ? 1n : 0n
}

const solution1 = (line: string) => {
  const binaryStr = line
    .split("")
    .map((c) => parseInt(c, 16).toString(2).padStart(4, "0"))
    .flat()
    .join("")

  let res = readPackage(binaryStr, 0)
  return addVersions(res)
}

const solution2 = (line: string) => {
  const binaryStr = line
    .split("")
    .map((c) => parseInt(c, 16).toString(2).padStart(4, "0"))
    .flat()
    .join("")

  return calc(readPackage(binaryStr, 0)).toString(10)
}

// export default [solution1]
export default [solution1, solution2]
