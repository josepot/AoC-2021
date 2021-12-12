interface Cave {
  id: string
  isBig: boolean
  edges: Set<Cave>
}

interface Path {
  prev: Path | null
  current: Cave
  smallCaves: Set<Cave>
  wildCard?: boolean
}

const solution1 = (lines: string[]) => {
  const caves = new Map<string, Cave>()

  const upsertCave = (id: string): Cave => {
    if (caves.has(id)) return caves.get(id)!
    const result: Cave = {
      id,
      isBig: id === id.toUpperCase(),
      edges: new Set(),
    }
    caves.set(id, result)
    return result
  }

  lines.forEach((line) => {
    const [from, to] = line.split("-").map(upsertCave)
    from.edges.add(to)
    to.edges.add(from)
  })

  const startingPath: Path = {
    prev: null,
    current: caves.get("start")!,
    smallCaves: new Set(),
  }
  startingPath.smallCaves.add(startingPath.current)

  const findValidPaths = (from: Path): Path[] => {
    if (from.current.id === "end") return [from]

    return [...from.current.edges]
      .filter((edge) => !from.smallCaves.has(edge))
      .map((edge) => {
        const newFrom: Path = {
          prev: from,
          current: edge,
          smallCaves: new Set(from.smallCaves),
        }

        if (!edge.isBig) newFrom.smallCaves.add(edge)

        return findValidPaths(newFrom)
      })
      .flat()
  }

  return findValidPaths(startingPath).length
}

const solution2 = (lines: string[]) => {
  const caves = new Map<string, Cave>()

  const upsertCave = (id: string): Cave => {
    if (caves.has(id)) return caves.get(id)!
    const result: Cave = {
      id,
      isBig: id === id.toUpperCase(),
      edges: new Set(),
    }
    caves.set(id, result)
    return result
  }

  lines.forEach((line) => {
    const [from, to] = line.split("-").map(upsertCave)
    from.edges.add(to)
    to.edges.add(from)
  })

  const startingPath: Path = {
    prev: null,
    current: caves.get("start")!,
    smallCaves: new Set(),
  }
  startingPath.smallCaves.add(startingPath.current)

  const findValidPaths = (from: Path): Path[] => {
    if (from.current.id === "end") return [from]

    return [...from.current.edges]
      .filter(
        (edge) =>
          !from.smallCaves.has(edge) || (!from.wildCard && edge.id !== "start"),
      )
      .map((edge) => {
        const newFrom: Path = {
          prev: from,
          current: edge,
          smallCaves: new Set(from.smallCaves),
          wildCard: from.wildCard || (!edge.isBig && from.smallCaves.has(edge)),
        }

        if (!edge.isBig) newFrom.smallCaves.add(edge)

        return findValidPaths(newFrom)
      })
      .flat()
  }

  return findValidPaths(startingPath).length
}

export default [solution1, solution2]
