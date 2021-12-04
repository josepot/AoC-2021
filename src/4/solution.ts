interface Board {
  callNumber: (input: number) => boolean
  getScore: (lastCalled: number) => number
}

const getBoard = (input: number[][]): Board => {
  const unmarked = new Map<number, { x: number; y: number }>()
  const markedRows = new Map<number, number>(input[0].map((_, idx) => [idx, 0]))
  const markedCols = new Map<number, number>(input.map((_, idx) => [idx, 0]))

  input.forEach((row, rowIdx) => {
    row.forEach((cell, colIdx) => {
      unmarked.set(cell, { x: colIdx, y: rowIdx })
    })
  })

  const rows = input.length
  const cols = input[0].length

  function callNumber(input: number): boolean {
    if (!unmarked.has(input)) return false

    const { x, y } = unmarked.get(input)!
    unmarked.delete(input)

    markedRows.set(y, markedRows.get(y)! + 1)
    if (markedRows.get(y) === rows) return true

    markedCols.set(x, markedCols.get(x)! + 1)
    return markedCols.get(x) === cols
  }

  function getScore(lastCalledNumber: number): number {
    return [...unmarked.keys()].reduce((a, b) => a + b, 0) * lastCalledNumber
  }

  return {
    callNumber,
    getScore,
  }
}

const solution1 = (lines: string[]) => {
  const lottery = lines.splice(0, 1)[0].split(",").map(Number)

  const boards: Board[] = []

  while (lines.length > 0) {
    boards.push(
      getBoard(
        lines
          .splice(0, 6)
          .slice(1)
          .map((line) =>
            line
              .split(" ")
              .map((x) => parseInt(x))
              .filter((x) => !Number.isNaN(x)),
          ),
      ),
    )
  }

  for (let i = 0; i < lottery.length; i++) {
    const current = lottery[i]
    for (let b = 0; b < boards.length; b++) {
      const board = boards[b]
      if (board.callNumber(current)) return board.getScore(current)
    }
  }
}

const solution2 = (lines: string[]) => {}

export default [solution1]
