let nRolls = 0
let rollNumber = 0

const roll = (): number => {
  nRolls++
  rollNumber++
  if (rollNumber === 101) rollNumber = 1
  return rollNumber
}

const solution1 = (lines: string[]) => {
  let scores = [0, 0]
  let positions = [7, 0]
  let turn = 1
  do {
    turn = (turn + 1) % 2
    const total = roll() + roll() + roll()
    positions[turn] = (positions[turn] + total) % 10
    scores[turn] += positions[turn] + 1
  } while (scores[turn] < 1000)

  turn = (turn + 1) % 2
  return scores[turn] * nRolls
}

const solution2 = (lines: string[]) => {}

export default [solution1]
