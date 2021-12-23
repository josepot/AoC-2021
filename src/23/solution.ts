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

const getGamePositionId = (amphipods: Amphipod[]) =>
  amphipods.map((a) => a.location).join(",")

const generateMoves =
  (nSpots: number) =>
  (currentGame: GamePosition): GamePosition[] | true => {
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
            id: getGamePositionId(nextAmphipods),
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
            id: getGamePositionId(nextAmphipods),
            prev: currentGame,
            points: nextPoints,
            amphipods: nextAmphipods,
            map: nextMap,
          })
        }
      }

      const targetX = amphipodRows[amphipod.type]
      let home: string | null = null
      let homeLevel = 0
      for (let i = 1; i <= nSpots; i++) {
        const currentPos = `${targetX},${i}`
        const currentVal = map[`${targetX},${i}`]
        if (currentVal === null) {
          home = currentPos
          homeLevel = i
          continue
        }
        if (currentVal !== amphipod.type) {
          home = null
        }
        break
      }

      if (home) {
        const direction = currentX > amphipodRows[amphipod.type] ? -1 : 1
        let nextPoints = initialPoints

        let x = currentX
        do {
          x += direction
          nextPoints += amphipod.type
          if (map[`${x},0`] !== null) return
        } while (x !== targetX)

        nextPoints += amphipod.type * homeLevel

        const nextAmphipods: Array<Amphipod> = amphipods.map((a) =>
          a === amphipod
            ? {
                ...a,
                state: State.Done,
                location: home!,
              }
            : a,
        )

        const nextMap: Record<string, null | AmphipodType> = {
          ...map,
          [amphipod.location]: null,
          [home]: amphipod.type,
        }

        result.push({
          id: getGamePositionId(nextAmphipods),
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

const solution1 = () => {
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

  const initialGamePosition: GamePosition = {
    id: getGamePositionId(initialAmphipods),
    prev: null,
    points: 0,
    map: initialmap,
    amphipods: initialAmphipods,
  }

  return graphDistinctSearch(
    initialGamePosition,
    generateMoves(2),
    (a, b) => b.points - a.points,
    (prev, current) => current.points < prev.points,
  ).points
}

const solution2 = (lines: string[]) => {
  const input = "CDDBBCBDDBAAAACC"
  const input2 = input.split("").map((c) => codeAmphipod[c])

  const initialmap: Record<string, null | AmphipodType> = {}
  for (let x = 0; x < 11; x++) initialmap[`${x},0`] = null
  initialmap["2,1"] = input2[0]
  initialmap["2,2"] = input2[1]
  initialmap["2,3"] = input2[2]
  initialmap["2,4"] = input2[3]

  initialmap["4,1"] = input2[4]
  initialmap["4,2"] = input2[5]
  initialmap["4,3"] = input2[6]
  initialmap["4,4"] = input2[7]

  initialmap["6,1"] = input2[8]
  initialmap["6,2"] = input2[9]
  initialmap["6,3"] = input2[10]
  initialmap["6,4"] = input2[11]

  initialmap["8,1"] = input2[12]
  initialmap["8,2"] = input2[13]
  initialmap["8,3"] = input2[14]
  initialmap["8,4"] = input2[15]

  const initialAmphipods = [
    { type: input2[0], state: State.Init, location: "2,1" },
    { type: input2[1], state: State.Init, location: "2,2" },
    { type: input2[2], state: State.Init, location: "2,3" },
    { type: input2[3], state: State.Init, location: "2,4" },

    { type: input2[4], state: State.Init, location: "4,1" },
    { type: input2[5], state: State.Init, location: "4,2" },
    { type: input2[6], state: State.Init, location: "4,3" },
    { type: input2[7], state: State.Init, location: "4,4" },

    { type: input2[8], state: State.Init, location: "6,1" },
    { type: input2[9], state: State.Init, location: "6,2" },
    { type: input2[10], state: State.Init, location: "6,3" },
    { type: input2[11], state: State.Init, location: "6,4" },

    { type: input2[12], state: State.Init, location: "8,1" },
    { type: input2[13], state: State.Init, location: "8,2" },
    { type: input2[14], state: State.Init, location: "8,3" },
    { type: input2[15], state: State.Init, location: "8,4" },
  ]

  const initialGamePosition: GamePosition = {
    id: getGamePositionId(initialAmphipods),
    prev: null,
    points: 0,
    map: initialmap,
    amphipods: initialAmphipods,
  }

  return graphDistinctSearch(
    initialGamePosition,
    generateMoves(4),
    (a, b) => b.points - a.points,
    (prev, current) => current.points < prev.points,
  ).points
}

export default [solution1, solution2]
