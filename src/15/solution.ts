import graphDistinctSearch from "utils/graphDistinctSearch"
import { readGrid } from "utils/readGrid"

interface Node {
  id: string
  x: number
  y: number
  val: number
  prev: Node | null
}
const solution1 = (lines: string[]) => {
  const grid = readGrid(lines, Number)
  const initialNode: Node = {
    x: 0,
    y: 0,
    id: "0,0-0,0",
    prev: null,
    val: 0,
  }

  const result = graphDistinctSearch<Node>(
    initialNode,
    (node) => {
      if (node.x === 99 && node.y === 99) return true
      return grid.getCrossNeighboursPos(node.x, node.y).map(([x, y]) => ({
        x,
        y,
        id: `${x},${y}`,
        val: node.val + grid.getCell(x, y),
        prev: node,
      }))
    },
    (a, b) => b.val - a.val,
  )

  return result.val
}

const solution2 = (lines: string[]) => {
  const grid = readGrid(lines, Number)
  const initialNode: Node = {
    x: 0,
    y: 0,
    id: "0,0-0,0",
    prev: null,
    val: 0,
  }

  const getCell = (xx: number, yy: number) => {
    const x = xx % 100
    const y = yy % 100
    let val = grid.getCell(x, y)

    const deltaX = Math.floor(xx / 100)
    val = val + deltaX
    if (val > 9) val -= 9

    const deltaY = Math.floor(yy / 100)
    val = val + deltaY
    if (val > 9) val -= 9

    return val
  }

  const getCrossNeighboursPos = (x: number, y: number) => {
    return [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]
      .map(([diffX, diffY]) => [x + diffX, y + diffY] as const)
      .filter(([xx, yy]) => xx > -1 && xx < 500 && yy > -1 && yy < 500)
  }

  const result = graphDistinctSearch<Node>(
    initialNode,
    (node) => {
      if (node.x === 499 && node.y === 499) return true
      return getCrossNeighboursPos(node.x, node.y).map(([x, y]) => ({
        x,
        y,
        id: `${x},${y}`,
        val: node.val + getCell(x, y),
        prev: node,
      }))
    },
    (a, b) => b.val - a.val,
  )

  return result.val
}

export default [solution1, solution2]
