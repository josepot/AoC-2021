import add from "utils/add"

const solution1 = (line: string, nDays = 80) => {
  let fish = Array(9).fill(0)

  line
    .split(",")
    .map(Number)
    .forEach((value) => {
      fish[value]++
    })

  for (let i = 0; i < nDays; i++) {
    fish = fish.map((_, key) =>
      key === 6 ? fish[7] + fish[0] : fish[(key + 1) % 9],
    )
  }

  return [...fish.values()].reduce(add)
}

const solution2 = (line: string) => solution1(line, 256)

export default [solution1, solution2]
