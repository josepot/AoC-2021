export enum Direction {
  UP = 1,
  DOWN = 2,
  LEFT = 3,
  RIGHT = 4,
}

export type Position = { x: number; y: number; key: string }

export const directionDeltas: Record<Direction, [number, number]> = {
  [Direction.UP]: [0, -1],
  [Direction.DOWN]: [0, 1],
  [Direction.LEFT]: [-1, 0],
  [Direction.RIGHT]: [1, 0],
}

export type NextDirection = {
  value: Direction
  right: NextDirection
  left: NextDirection
}

export function turnWheel(wheel: NextDirection, direction: Direction) {
  do {
    wheel = wheel.left
  } while (wheel.value !== direction)
  return wheel
}

export function getDirectionWheel() {
  const up: NextDirection = {
    value: Direction.UP,
    right: {} as NextDirection,
    left: {} as NextDirection,
  }
  const down: NextDirection = {
    value: Direction.DOWN,
    right: {} as NextDirection,
    left: {} as NextDirection,
  }
  const left: NextDirection = {
    value: Direction.LEFT,
    right: {} as NextDirection,
    left: {} as NextDirection,
  }
  const right: NextDirection = {
    value: Direction.RIGHT,
    right: {} as NextDirection,
    left: {} as NextDirection,
  }

  up.left = left
  up.right = right

  down.left = right
  down.right = left

  left.left = down
  left.right = up

  right.left = up
  right.right = down

  return up
}

export const movePosition = (
  position: Position,
  direction: Direction,
): Position => {
  const [xDelta, yDelta] = directionDeltas[direction]
  const res = {
    x: position.x + xDelta,
    y: position.y + yDelta,
    key: "",
  }
  res.key = res.x + "," + res.y
  return res
}

export const getPositionFromKey = (key: string) => {
  const [x, y] = key.split(",").map(Number)
  return { x, y, key }
}

export const getAdjacentPositions = ({ x, y }: Position): Position[] =>
  [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ].map(([x, y]) => ({ x, y, key: x + "," + y }))

export const getDiagonalPositions = ({ x, y }: Position): Position[] =>
  [
    [x + 1, y + 1],
    [x + 1, y - 1],
    [x - 1, y + 1],
    [x - 1, y - 1],
  ].map(([x, y]) => ({ x, y, key: x + "," + y }))
