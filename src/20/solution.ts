const range = (from: number, to: number) => {
  const result = new Array<number>(to - from)
  for (let i = from; i <= to; i++) result[i - from] = i
  return result
}

const solution1 = (lines: string[], nTimes = 2) => {
  const base = lines[0]
  let baseImage = lines.slice(2)

  const getPixelAtPos = (x: number, y: number, defaultC: string) => {
    let binaryStr = ""

    for (let yy = y - 1; yy <= y + 1; yy++)
      for (let xx = x - 1; xx <= x + 1; xx++)
        binaryStr += (baseImage[yy]?.[xx] ?? defaultC) === "." ? "0" : "1"

    return base[parseInt(binaryStr, 2)]
  }

  for (let i = 0; i < nTimes; i++) {
    const defaultC = i % 2 === 0 ? "." : "#"
    baseImage = range(-1, baseImage.length + 1).map((y) =>
      range(-1, baseImage[0].length + 1)
        .map((x) => getPixelAtPos(x, y, defaultC))
        .join(""),
    )
  }

  return baseImage
    .map((line) =>
      line
        .split("")
        .filter((x) => x === "#")
        .join(""),
    )
    .join("").length
}

const solution2 = (lines: string[]) => solution1(lines, 50)

export default [solution1, solution2]
