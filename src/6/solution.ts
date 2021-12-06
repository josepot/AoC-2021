import add from "utils/add"

const solution1 = (line: string, nDays = 80) => {
  let fish = new Map<number, number>()
  for (let i = 0; i < 9; i++) fish.set(i, 0)

  line
    .split(",")
    .map(Number)
    .forEach((value) => {
      fish.set(value, fish.get(value)! + 1)
    })

  for (let i = 0; i < nDays; i++) {
    fish.set(9, fish.get(0)!)
    fish = new Map(
      [...fish.entries()].map(([key, value]) =>
        key === 7 ? [6, value + (fish.get(9) ?? 0)] : [key - 1, value],
      ),
    )
    fish.delete(-1)
  }

  return [...fish.values()].reduce(add)
}

const solution2 = (line: string) => solution1(line, 256)

export default [solution1, solution2]
