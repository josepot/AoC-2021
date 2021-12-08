import add from "utils/add"

const solution1 = (lines: string[]) => {
  return lines
    .map((x) => x.split(" | ")[1].split(" "))
    .flat()
    .filter((x) => [2, 4, 3, 7].includes(x.length)).length
}

const segmentsToNumber: Record<string, number> = {
  abcefg: 0,
  cf: 1,
  acdeg: 2,
  acdfg: 3,
  bcdf: 4,
  abdfg: 5,
  abdefg: 6,
  acf: 7,
  abcdefg: 8,
  abcdfg: 9,
}

const mapDigits = (variants: string[]): Map<string, number> => {
  const candidates = new Map<number, string[][]>()
  variants.forEach((variant) => {
    if (!candidates.has(variant.length)) candidates.set(variant.length, [])
    candidates.get(variant.length)!.push(variant.split(""))
  })

  const fromRawToActual: Record<string, string> = {}
  const fromActualToRaw: Record<string, string> = {}

  const rawOne = candidates.get(2)![0]
  const rawOneDigits = new Set(rawOne)

  // let's find a
  const rawSeven = candidates.get(3)![0]
  const rawA = rawSeven.find((x) => !rawOneDigits.has(x))!
  fromRawToActual[rawA] = "a"
  fromActualToRaw.a = rawA

  // lets find rawSix
  const rawSix = candidates.get(6)!.find((possibleSix) => {
    const options = new Set(possibleSix)
    return !rawOne.every((d) => options.has(d))
  })!

  // And now we can figure out c and f
  const rawSixDigits = new Set(rawSix)
  const fIdxOnRawOne = rawOne.findIndex((x) => rawSixDigits.has(x))
  const cIdxOnRawOne = fIdxOnRawOne === 0 ? 1 : 0
  const rawF = rawOne[fIdxOnRawOne]
  fromRawToActual[rawF] = "f"
  fromActualToRaw.f = rawF
  const rawC = rawOne[cIdxOnRawOne]
  fromRawToActual[rawC] = "c"
  fromActualToRaw.c = rawC

  // the other 2 numbers with 6 digits are 0 and 9
  // and 9 has a complete overlap with 4
  const rawFour = candidates.get(4)![0]
  const rawNine = candidates.get(6)!.find((possibleNine) => {
    const options = new Set(possibleNine)
    return rawFour.every((x) => options.has(x))
  })!

  // a and g are present in 9 and not in four,
  // since we know a, let's now get g
  const rawFourDigits = new Set(rawFour)
  const rawG = rawNine.filter(
    (x) => !rawFourDigits.has(x) && x !== fromActualToRaw.a,
  )[0]
  fromRawToActual[rawG] = "g"
  fromActualToRaw.g = rawG

  // we know 6 and 9, the other number with 6 digits is zero,
  // lets get it
  const rawZero = candidates.get(6)!.find((x) => x !== rawSix && x !== rawNine)!
  const rawZeroDigits = new Set(rawZero)

  // d is present in 8 and not in zero
  const rawEight = candidates.get(7)![0]
  const rawD = rawEight.find((x) => !rawZeroDigits.has(x))!
  fromRawToActual[rawD] = "d"
  fromActualToRaw.d = rawD

  // e is present in 8 and not in 9
  const rawNineDigits = new Set(rawNine)
  const rawE = rawEight.find((x) => !rawNineDigits.has(x))!
  fromRawToActual[rawE] = "e"
  fromActualToRaw.e = rawE

  // b and d are present in 4 and not present in 1, but we know what d is so...
  const rawB = rawFour.find(
    (x) => x !== fromActualToRaw.d && !rawOneDigits.has(x),
  )!
  fromRawToActual[rawB] = "b"
  fromActualToRaw.b = rawB

  const result = new Map<string, number>(
    variants.map((variant) => [
      variant.split("").sort().join(""),
      segmentsToNumber[
        variant
          .split("")
          .map((raw) => fromRawToActual[raw])
          .sort()
          .join("")
      ],
    ]),
  )

  return result
}

const decodeNumber = (line: string): number => {
  const [variants, rawNumber] = line.split(" | ")
  const digits = mapDigits(variants.split(" "))
  return parseInt(
    rawNumber
      .split(" ")
      .map((x) => digits.get(x.split("").sort().join(""))!)
      .join(""),
    10,
  )
}

const solution2 = (lines: string[]) => lines.map(decodeNumber).reduce(add)

export default [solution1, solution2]
