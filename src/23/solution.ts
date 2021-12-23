import graphDistinctSearch from "../utils/graphDistinctSearch"

enum AmphipodType {
  Amber = 1,
  Bronce = 10,
  Cooper = 100,
  Desert = 1000,
}

enum State {
  Init,
  Transit,
  Done,
}

const codeAmphipod: Record<string, AmphipodType> = {
  A: AmphipodType.Amber,
  B: AmphipodType.Bronce,
  C: AmphipodType.Cooper,
  D: AmphipodType.Desert,
}
const input = "CBBDDAAC"
const input2 = input.split("").map((c) => codeAmphipod[c])

const initialmap: Record<string, null | AmphipodType> = {}
for (let x = 0; x < 11; x++) initialmap[`${x},0`] = null
initialmap["2,1"] = input2[0]
initialmap["2,2"] = input2[1]
initialmap["4,1"] = input2[2]
initialmap["4,2"] = input2[3]
initialmap["6,1"] = input2[4]
initialmap["6,2"] = input2[5]
initialmap["8,1"] = input2[6]
initialmap["8,2"] = input2[7]

const initialAmphipods = [
  { type: input2[0], state: State.Init, location: "2,1" },
  { type: input2[1], state: State.Init, location: "2,2" },
  { type: input2[2], state: State.Init, location: "4,1" },
  { type: input2[3], state: State.Init, location: "4,2" },
  { type: input2[4], state: State.Init, location: "6,1" },
  { type: input2[5], state: State.Init, location: "6,2" },
  { type: input2[6], state: State.Init, location: "8,1" },
  { type: input2[7], state: State.Init, location: "8,2" },
]

const amphipodRows: Record<AmphipodType, number> = {
  [AmphipodType.Amber]: 2,
  [AmphipodType.Bronce]: 4,
  [AmphipodType.Cooper]: 6,
  [AmphipodType.Desert]: 8,
}

const doorRows = new Set([2, 4, 6, 8])

interface Amphipod {
  type: AmphipodType
  state: State
  location: string
}

interface GamePosition {
  id: string
  prev: GamePosition | null
  points: number
  amphipods: Array<Amphipod>
  map: Record<string, null | AmphipodType>
}

const getGamePositionId = (amphipods: Amphipod[], points: number) =>
  amphipods.map((a) => a.location).join(",") + ":" + points

const initialGamePosition: GamePosition = {
  id: getGamePositionId(initialAmphipods, 0),
  prev: null,
  points: 0,
  map: initialmap,
  amphipods: initialAmphipods,
}

const generateMoves = (currentGame: GamePosition): GamePosition[] | true => {
  const { amphipods, points, map } = currentGame
  if (amphipods.every((a) => a.state === State.Done)) return true

  const result: GamePosition[] = []

  amphipods.forEach((amphipod) => {
    if (amphipod.state === State.Done) return

    const [currentX, currentY] = amphipod.location.split(",").map(Number)

    let initialPoints = points
    if (amphipod.state === State.Init) {
      if (map[`${currentX},${currentY - 1}`] !== null) return

      initialPoints += amphipod.type * currentY

      let nextPoints = initialPoints

      for (let x = currentX - 1; map[`${x},0`] === null; x--) {
        nextPoints += amphipod.type
        if (doorRows.has(x)) continue

        const nextAmphipods: Array<Amphipod> = amphipods.map((a) =>
          a === amphipod
            ? {
                ...a,
                state: State.Transit,
                location: `${x},0`,
              }
            : a,
        )

        const nextMap: Record<string, null | AmphipodType> = {
          ...map,
          [amphipod.location]: null,
          [`${x},0`]: amphipod.type,
        }

        result.push({
          id: getGamePositionId(nextAmphipods, nextPoints),
          prev: currentGame,
          points: nextPoints,
          amphipods: nextAmphipods,
          map: nextMap,
        })
      }

      nextPoints = initialPoints
      for (let x = currentX + 1; map[`${x},0`] === null; x++) {
        nextPoints += amphipod.type
        if (doorRows.has(x)) continue

        const nextAmphipods: Array<Amphipod> = amphipods.map((a) =>
          a === amphipod
            ? {
                ...a,
                state: State.Transit,
                location: `${x},0`,
              }
            : a,
        )

        const nextMap: Record<string, null | AmphipodType> = {
          ...map,
          [amphipod.location]: null,
          [`${x},0`]: amphipod.type,
        }

        result.push({
          id: getGamePositionId(nextAmphipods, nextPoints),
          prev: currentGame,
          points: nextPoints,
          amphipods: nextAmphipods,
          map: nextMap,
        })
      }
    }

    const targetX = amphipodRows[amphipod.type]
    const homeSpots = [`${targetX},1`, `${targetX},2`]
    const home =
      map[homeSpots[1]] === null
        ? homeSpots[1]
        : map[homeSpots[1]] === amphipod.type && map[homeSpots[0]] === null
        ? homeSpots[0]
        : null

    if (home) {
      const direction = currentX > amphipodRows[amphipod.type] ? -1 : 1
      let nextPoints = initialPoints

      let x = currentX
      do {
        x += direction
        nextPoints += amphipod.type
        if (map[`${x},0`] !== null) return
      } while (x !== targetX)

      nextPoints += amphipod.type * (home === homeSpots[0] ? 1 : 2)
      const nextAmphipods: Array<Amphipod> = amphipods.map((a) =>
        a === amphipod
          ? {
              ...a,
              state: State.Done,
              location: home,
            }
          : a,
      )

      const nextMap: Record<string, null | AmphipodType> = {
        ...map,
        [amphipod.location]: null,
        [home]: amphipod.type,
      }

      result.push({
        id: getGamePositionId(nextAmphipods, nextPoints),
        prev: currentGame,
        points: nextPoints,
        amphipods: nextAmphipods,
        map: nextMap,
      })
    }
  })

  return result
}

const template = `#############
#...........#
###.#.#.#.###
  #.#.#.#.#
  #########`

const amphipodCode: Record<AmphipodType, string> = {
  [AmphipodType.Amber]: "A",
  [AmphipodType.Bronce]: "B",
  [AmphipodType.Cooper]: "C",
  [AmphipodType.Desert]: "D",
}

const print = (amphipods: Amphipod[]) => {
  const res = template.split("\n").map((line) => line.split(""))

  amphipods.forEach((a) => {
    const [x, y] = a.location
      .split(",")
      .map(Number)
      .map((x) => x + 1)
    res[y][x] = amphipodCode[a.type]
  })

  console.log("")
  console.log(res.map((line) => line.join("")).join("\n"))
}

const solution1 = () =>
  graphDistinctSearch(
    initialGamePosition,
    generateMoves,
    (a, b) => b.points - a.points,
  ).points

const solution2 = (lines: string[]) => {}

export default [solution1]
