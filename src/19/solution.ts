import add from "utils/add"

type Position = [number, number, number]
interface PositionWithScanner {
  position: Position
  isScanner: boolean
}

interface Beacon {
  idx: number
  isScanner: boolean
  positionInScanner: Position
  distances: Map<number, number>
}

interface Scanner {
  idx: number
  beacons: Array<Beacon>
}

const mergeScanners = (
  a: Scanner,
  b: Scanner,
): PositionWithScanner[] | null => {
  const overlaps: { aIdx: number; bIdx: number; nOverlaps: number }[] = []

  for (let aIdx = 0; aIdx < a.beacons.length; aIdx++) {
    for (let bIdx = 0; bIdx < b.beacons.length; bIdx++) {
      const aDistances = new Set(a.beacons[aIdx].distances.values())
      const bDistances = new Set(b.beacons[bIdx].distances.values())

      let nOverlaps = 0
      aDistances.forEach((d) => {
        if (bDistances.has(d)) nOverlaps++
      })
      overlaps.push({ aIdx, bIdx, nOverlaps })
    }
  }

  overlaps.sort((a, b) => b.nOverlaps - a.nOverlaps)

  const fromA = a.beacons[overlaps[0].aIdx]

  const getDeltas = (a: Position, b: Position): Position =>
    a.map((x, idx) => b[idx] - x) as Position

  const getAbsDeltas = (a: Position, b: Position): Position =>
    getDeltas(a, b).map((x) => Math.abs(x)) as Position

  let toIdx = 1
  let toA = a.beacons[overlaps[toIdx].aIdx]

  while (
    new Set(getAbsDeltas(fromA.positionInScanner, toA.positionInScanner)).size <
    3
  ) {
    toIdx++
    toA = a.beacons[overlaps[toIdx].aIdx]
  }

  const fromB = b.beacons[overlaps[0].bIdx]
  const toB = b.beacons[overlaps[toIdx].bIdx]

  const aDeltas = getDeltas(fromA.positionInScanner, toA.positionInScanner)
  const bDeltas = getDeltas(fromB.positionInScanner, toB.positionInScanner)

  const aSortedDeltas = aDeltas
    .map((value, idx) => [idx, value, Math.abs(value)] as const)
    .sort((a, b) => a[2] - b[2])

  const bSortedDeltas = bDeltas
    .map((value, idx) => [idx, value, Math.abs(value)] as const)
    .sort((a, b) => a[2] - b[2])

  const bMultipliers = aSortedDeltas.map((val, idx) =>
    val[1] === bSortedDeltas[idx][1] ? 1 : -1,
  )
  const aIdxs = aSortedDeltas.map((x) => x[0])
  const bIdxs = bSortedDeltas.map((x) => x[0])

  const scanners = new Set<string>()

  const aPositions = a.beacons.map(({ positionInScanner, isScanner }) => {
    const x = positionInScanner[aIdxs[0]] - fromA.positionInScanner[aIdxs[0]]
    const y = positionInScanner[aIdxs[1]] - fromA.positionInScanner[aIdxs[1]]
    const z = positionInScanner[aIdxs[2]] - fromA.positionInScanner[aIdxs[2]]

    const result = [x, y, z].join(",")
    if (isScanner) scanners.add(result)
    return result
  })

  const bPositions = b.beacons.map(({ positionInScanner, isScanner }) => {
    const x =
      (positionInScanner[bIdxs[0]] - fromB.positionInScanner[bIdxs[0]]) *
      bMultipliers[0]
    const y =
      (positionInScanner[bIdxs[1]] - fromB.positionInScanner[bIdxs[1]]) *
      bMultipliers[1]
    const z =
      (positionInScanner[bIdxs[2]] - fromB.positionInScanner[bIdxs[2]]) *
      bMultipliers[2]

    const result = [x, y, z].join(",")
    if (isScanner) scanners.add(result)
    return result
  })

  const result = new Set<string>(aPositions.concat(bPositions))

  if (aPositions.length + bPositions.length - result.size < 12) return null

  return [...result].map((r) => ({
    position: r.split(",").map(Number) as Position,
    isScanner: scanners.has(r),
  }))
}

const getDistance = (a: Position, b: Position): number =>
  Math.sqrt(a.map((x, idx) => Math.pow(x - b[idx], 2)).reduce(add))

const getScanner = (
  positions: PositionWithScanner[],
  scannerIdx: number,
): Scanner => {
  const beacons = new Array<Beacon>(positions.length)
  const result: Scanner = { idx: scannerIdx, beacons }

  for (let aIdx = 0; aIdx < positions.length - 1; aIdx++) {
    for (let bIdx = aIdx + 1; bIdx < positions.length; bIdx++) {
      const beaconA: Beacon = beacons[aIdx] || {
        idx: aIdx,
        isScanner: positions[aIdx].isScanner,
        positionInScanner: positions[aIdx].position,
        distances: new Map<number, number>(),
      }
      beacons[aIdx] = beaconA

      const beaconB = beacons[bIdx] || {
        idx: bIdx,
        isScanner: positions[bIdx].isScanner,
        positionInScanner: positions[bIdx].position,
        distances: new Map<number, number>(),
      }
      beacons[bIdx] = beaconB

      const distance = getDistance(
        beaconA.positionInScanner,
        beaconB.positionInScanner,
      )
      beaconA.distances.set(bIdx, distance)
      beaconB.distances.set(aIdx, distance)
    }
  }
  return result
}

const getNDistancesOverlaps = (a: Scanner, b: Scanner): number => {
  const aDistances = new Set(
    a.beacons.map((beacon) => [...beacon.distances.values()]).flat(),
  )
  const bDistances = new Set(
    b.beacons.map((beacon) => [...beacon.distances.values()]).flat(),
  )

  let count = 0
  aDistances.forEach((d) => {
    if (bDistances.has(d)) count++
  })
  return count
}

const getMatchingPriorities = (input: Scanner[]) => {
  const result: { aIdx: number; bIdx: number; nOverlaps: number }[] = []

  for (let aIdx = 0; aIdx < input.length - 1; aIdx++) {
    for (let bIdx = aIdx + 1; bIdx < input.length; bIdx++) {
      result.push({
        aIdx,
        bIdx,
        nOverlaps: getNDistancesOverlaps(input[aIdx], input[bIdx]),
      })
    }
  }
  return result.sort((a, b) => b.nOverlaps - a.nOverlaps)
}

const mergeManyScanners = (
  input: Array<Array<PositionWithScanner>>,
): Array<Array<PositionWithScanner>> => {
  const scanners = input.map(getScanner)
  const priorities = getMatchingPriorities(scanners)
  const toMerge = new Set(
    Array(scanners.length)
      .fill(null)
      .map((_, idx) => idx),
  )

  const result: Array<Array<PositionWithScanner>> = []

  for (let i = 0; i < priorities.length; i++) {
    const current = priorities[i]
    if (toMerge.has(current.aIdx) && toMerge.has(current.bIdx)) {
      const res = mergeScanners(scanners[current.aIdx], scanners[current.bIdx])
      if (!res) {
        return [...input.filter((_, idx) => toMerge.has(idx)), ...result]
      }
      toMerge.delete(current.aIdx)
      toMerge.delete(current.bIdx)
      result.push(res)
    }
  }
  return [...input.filter((_, idx) => toMerge.has(idx)), ...result]
}

const solution1 = (lines: string[]) => {
  const scannersRaw: Array<Array<Position>> = []

  let current: Array<Position> = []
  lines.forEach((line) => {
    if (line.startsWith("---")) {
      current = []
      return scannersRaw.push(current)
    }
    if (line === "") return
    current.push(line.split(",").map(Number) as Position)
  })

  let scanners: Array<Array<PositionWithScanner>> = scannersRaw.map(
    (positions) =>
      positions
        .map((position) => ({ position, isScanner: false }))
        .concat({ position: [0, 0, 0], isScanner: true }),
  )

  let next = scanners

  do {
    scanners = next
    next = mergeManyScanners(scanners)
  } while (next.length > 1)

  return next[0].filter((x) => !x.isScanner).length
}

const solution2 = (lines: string[]) => {
  const scannersRaw: Array<Array<Position>> = []

  let current: Array<Position> = []
  lines.forEach((line) => {
    if (line.startsWith("---")) {
      current = []
      return scannersRaw.push(current)
    }
    if (line === "") return
    current.push(line.split(",").map(Number) as Position)
  })

  let scanners: Array<Array<PositionWithScanner>> = scannersRaw.map(
    (positions) =>
      positions
        .map((position) => ({ position, isScanner: false }))
        .concat({ position: [0, 0, 0], isScanner: true }),
  )

  let next = scanners

  do {
    scanners = next
    next = mergeManyScanners(scanners)
  } while (next.length > 1)

  const finalScanners = next[0]
    .filter((x) => x.isScanner)
    .map((x) => x.position)

  let maxDistance = 0
  const getManDistance = (a: Position, b: Position): number =>
    a.map((value, idx) => Math.abs(b[idx] - value)).reduce(add)

  for (let aIdx = 0; aIdx < finalScanners.length - 1; aIdx++) {
    for (let bIdx = aIdx + 1; bIdx < finalScanners.length; bIdx++) {
      maxDistance = Math.max(
        maxDistance,
        getManDistance(finalScanners[aIdx], finalScanners[bIdx]),
      )
    }
  }

  return maxDistance
}

export default [solution1, solution2]
