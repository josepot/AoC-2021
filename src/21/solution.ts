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

const dies: Array<number> = []
for (let i = 1; i < 4; i++) {
  for (let z = 1; z < 4; z++) {
    for (let y = 1; y < 4; y++) {
      dies.push(i + z + y)
    }
  }
}

const memo: Record<string, [number, number]> = {}
const setMemo = (
  positions: [number, number],
  scores: [number, number],
  turn: number,
  result: [number, number],
) => {
  memo[positions.join(",") + scores.join(",") + turn] = result
}

const getMemo = (
  positions: [number, number],
  scores: [number, number],
  turn: number,
): [number, number] | undefined =>
  memo[positions.join(",") + scores.join(",") + turn]

const play = (
  positions: [number, number],
  scores: [number, number],
  turn: number,
): [number, number] => {
  const memoed = getMemo(positions, scores, turn)
  if (memoed) return memoed

  if (scores[0] >= 21) return [1, 0]
  if (scores[1] >= 21) return [0, 1]

  const results = dies.map((roll) => {
    const nextPositions: [number, number] = [...positions]
    const nextScores: [number, number] = [...scores]
    nextPositions[turn] = (positions[turn] + roll) % 10
    nextScores[turn] += nextPositions[turn] + 1
    return play(nextPositions, nextScores, turn === 0 ? 1 : 0)
  })

  const result: [number, number] = [0, 0]
  results.forEach(([a, b]) => {
    result[0] += a
    result[1] += b
  })
  setMemo(positions, scores, turn, result)

  return result
}

const solution2 = () => Math.max(...play([7, 0], [0, 0], 0))

export default [solution1, solution2]
