const targetX: [number, number] = [192, 251]
const targetY: [number, number] = [-59, -89]

const getPosition = (speed: number, time: number) =>
  ((2 * speed - (time - 1)) * time) / 2

const getMax = (
  speed: number,
  initialTime = 0,
): { position: number; time: number } => {
  let time = initialTime
  let position = 0
  do {
    const nextPosition = getPosition(speed, ++time)
    if (nextPosition <= position) return { position, time }
    position = nextPosition
  } while (true)
}

const getFirstTimeEnteringX = (speed: number): number => {
  let time = -1
  do {
    const position = getPosition(speed, ++time)
    if (position >= targetX[0]) return time
  } while (true)
}

const getStaticXInRange = (): Array<{ speed: number; time: number }> => {
  const result: Array<{ speed: number; time: number }> = []
  let speed = 0
  do {
    const max = getMax(++speed)
    if (max.position > targetX[1]) return result
    if (max.position >= targetX[0]) {
      result.push({ speed, time: getFirstTimeEnteringX(speed) })
    }
  } while (true)
}

const getPositionsXInRange = (
  speed: number,
): Array<{ x: number; time: number }> => {
  let time = 0
  let position = 0
  const result: Array<{ x: number; time: number }> = []

  do {
    const nextPosition = getPosition(speed, ++time)
    if (nextPosition > targetX[1] || nextPosition <= position) return result
    position = nextPosition
    if (position >= targetX[0]) result.push({ time, x: position })
  } while (true)
}

const getDynamicXInRange = (
  initSpeed: number,
): Array<{ speed: number; timeFrom: number; timeTo: number }> => {
  const result: Array<{ speed: number; timeFrom: number; timeTo: number }> = []
  let speed = initSpeed - 1
  do {
    const foo = getPositionsXInRange(++speed)
    if (foo.length) {
      result.push({
        speed,
        timeFrom: foo[0].time,
        timeTo: foo[foo.length - 1].time,
      })
    } else if (speed > targetX[1]) {
      return result
    }
  } while (true)
}

const getPositionsYInRange = (
  speed: number,
): Array<{ y: number; time: number }> => {
  let time = 0
  let position = 0
  const result: Array<{ y: number; time: number }> = []
  do {
    const nextPosition = getPosition(speed, ++time)
    if (nextPosition < targetY[1]) return result
    position = nextPosition
    if (position <= targetY[0]) result.push({ time, y: position })
  } while (true)
}

const getDynamicYInRange1 = (): Array<{
  speed: number
  timeFrom: number
  timeTo: number
}> => {
  const result: Array<{ speed: number; timeFrom: number; timeTo: number }> = []
  let speed = 0
  do {
    const foo = getPositionsYInRange(++speed)

    if (foo.length) {
      result.push({
        speed,
        timeFrom: foo[0].time,
        timeTo: foo[foo.length - 1].time,
      })
    }
    if (speed > targetY[1] * -1) return result
  } while (true)
}

const getDynamicYInRange2 = (): Array<{
  speed: number
  timeFrom: number
  timeTo: number
}> => {
  const result: Array<{ speed: number; timeFrom: number; timeTo: number }> = []
  let speed = 1
  do {
    const foo = getPositionsYInRange(--speed)
    if (speed < targetY[1]) return result
    if (foo.length) {
      result.push({
        speed,
        timeFrom: foo[0].time,
        timeTo: foo[foo.length - 1].time,
      })
    }
  } while (true)
}

const solution1 = () => getMax(targetY[1] * -1 - 1).position

const solution2 = () => {
  const xPositions: Array<{ pos: number; from: number; to: number }> = []
  const yPositions: Array<{ pos: number; from: number; to: number }> = []

  let lastSpeed = 0
  getStaticXInRange().forEach((x) => {
    xPositions.push({ pos: x.speed, from: x.time, to: Infinity })
    lastSpeed = x.speed
  })

  getDynamicXInRange(lastSpeed + 1).forEach((x) => {
    xPositions.push({ pos: x.speed, from: x.timeFrom, to: x.timeTo })
  })

  getDynamicYInRange1().forEach((y) => {
    yPositions.push({ pos: y.speed, from: y.timeFrom, to: y.timeTo })
  })

  getDynamicYInRange2().forEach((y) => {
    yPositions.push({ pos: y.speed, from: y.timeFrom, to: y.timeTo })
  })

  let count = 0

  yPositions.forEach((y) => {
    xPositions.forEach((x) => {
      if (
        (y.from >= x.from && y.from <= x.to) ||
        (y.to >= x.from && y.to <= x.to) ||
        (x.from >= y.from && x.from <= y.to) ||
        (x.to >= y.from && x.to <= y.to)
      ) {
        count++
      }
    })
  })
  return count
}

export default [solution1, solution2]
