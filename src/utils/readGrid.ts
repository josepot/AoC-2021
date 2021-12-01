export function readGrid<T>(lines: string[], getCellData: (i: string) => T) {
  return getGrid(lines.map((line) => line.split("").map(getCellData)))
}

export function getGrid<T>(data: T[][]) {
  const N_ROWS = data.length
  const N_COLS = data[0].length

  const getCell = (x: number, y: number) => data[y]?.[x]
  const getCrossNeighbours = (x: number, y: number) =>
    [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]
      .map(([diffX, diffY]) => [x + diffX, y + diffY] as const)
      .filter(([xx, yy]) => xx > -1 && xx < N_COLS && yy > -1 && yy < N_ROWS)
      .map(([xx, yy]) => getCell(xx, yy))
  const getDiagonalNeighbours = (x: number, y: number) =>
    [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ]
      .map(([diffX, diffY]) => [x + diffX, y + diffY] as const)
      .filter(([xx, yy]) => xx > -1 && xx < N_COLS && yy > -1 && yy < N_ROWS)
      .map(([xx, yy]) => getCell(xx, yy))
  const getAllNeighbours = (x: number, y: number) =>
    getCrossNeighbours(x, y).concat(getDiagonalNeighbours(x, y))

  type Mapper = (val: T, x: number, y: number, arr: T[][]) => T
  const map = (mapperFn: Mapper) =>
    getGrid(
      data.map((row, y) => row.map((cell, x) => mapperFn(cell, x, y, data))),
    )

  return {
    getCell,
    getAllNeighbours,
    getCrossNeighbours,
    getDiagonalNeighbours,
    map,
    N_ROWS,
    N_COLS,
    data,
  }
}
