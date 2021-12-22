import add from "utils/add"

const parseLine = (line: string) => {
  const [onOffRaw, rest] = line.split(" ")
  const isOn = onOffRaw === "on"
  const [xRange, yRange, zRange] = rest
    .split(",")
    .map((v) => v.slice(2).split("..").map(Number) as [number, number])
  return { xRange, yRange, zRange, isOn }
}

const switchLigths = (
  on: boolean,
  xRange: [number, number],
  yRange: [number, number],
  zRange: [number, number],
  state: Map<string, boolean>,
) => {
  for (let x = Math.max(-50, xRange[0]); x <= Math.min(50, xRange[1]); x++) {
    for (let y = Math.max(-50, yRange[0]); y <= Math.min(50, yRange[1]); y++) {
      for (
        let z = Math.max(-50, zRange[0]);
        z <= Math.min(50, zRange[1]);
        z++
      ) {
        const id = [x, y, z].join(",")
        state.set(id, on)
      }
    }
  }
}

const solution1 = (lines: string[]) => {
  const state = new Map<string, boolean>()
  const instructions = lines.map(parseLine)
  instructions.forEach((i) =>
    switchLigths(i.isOn, i.xRange, i.yRange, i.zRange, state),
  )

  return [...state.values()].filter(Boolean).length
}

type Range = [number, number]
interface Cube {
  x: Range
  y: Range
  z: Range
}

const isInside = (existingCube: Cube, newCube: Cube): boolean =>
  newCube.x[0] <= existingCube.x[0] &&
  newCube.x[1] >= existingCube.x[1] &&
  newCube.y[0] <= existingCube.y[0] &&
  newCube.y[1] >= existingCube.y[1] &&
  newCube.z[0] <= existingCube.z[0] &&
  newCube.z[1] >= existingCube.z[1]

const overlap = (a: Cube, b: Cube): boolean =>
  a.x[0] < b.x[1] &&
  a.x[1] > b.x[0] &&
  a.y[0] < b.y[1] &&
  a.y[1] > b.y[0] &&
  a.z[0] < b.z[1] &&
  a.z[1] > b.z[0]

function createSpaceForNewCube(currentCube: Cube, newCube: Cube): Cube[] {
  if (!overlap(currentCube, newCube)) return [currentCube]
  if (isInside(currentCube, newCube)) return []

  const xLimits = [
    currentCube.x[0],
    ...[newCube.x[0], newCube.x[1]].filter(
      (x) => currentCube.x[0] < x && x < currentCube.x[1],
    ),
    currentCube.x[1],
  ]

  const yLimits = [
    currentCube.y[0],
    ...[newCube.y[0], newCube.y[1]].filter(
      (y) => currentCube.y[0] < y && y < currentCube.y[1],
    ),
    currentCube.y[1],
  ]

  const zLimits = [
    currentCube.z[0],
    ...[newCube.z[0], newCube.z[1]].filter(
      (z) => currentCube.z[0] < z && z < currentCube.z[1],
    ),
    currentCube.z[1],
  ]

  const result: Cube[] = []

  for (let xx = 0; xx < xLimits.length - 1; xx++) {
    for (let yy = 0; yy < yLimits.length - 1; yy++) {
      for (let zz = 0; zz < zLimits.length - 1; zz++) {
        const cube = {
          x: xLimits.slice(xx, xx + 2) as [number, number],
          y: yLimits.slice(yy, yy + 2) as [number, number],
          z: zLimits.slice(zz, zz + 2) as [number, number],
        }
        if (!isInside(cube, newCube)) result.push(cube)
      }
    }
  }

  return result
}

const area = (c: Cube) =>
  (c.x[1] - c.x[0]) * (c.y[1] - c.y[0]) * (c.z[1] - c.z[0])

const solution2 = (lines: string[]) => {
  const instructions = lines.map(parseLine)
  let cubes: Cube[] = []

  instructions
    .map(
      ({ isOn, xRange, yRange, zRange }) =>
        ({
          isOn,
          x: [xRange[0], xRange[1] + 1],
          y: [yRange[0], yRange[1] + 1],
          z: [zRange[0], zRange[1] + 1],
        } as Cube & { isOn: boolean }),
    )
    .forEach(({ isOn, ...cube }) => {
      cubes = cubes.map((c) => createSpaceForNewCube(c, cube)).flat()
      if (isOn) cubes.push(cube)
    })

  return cubes.map(area).reduce(add)
}

export default [solution1, solution2]
