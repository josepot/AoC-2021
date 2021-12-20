const solution1 = (lines: string[], nTimes = 2) => {
  const base = lines[0]
  let baseImage = lines.slice(2)

  const getPixelAtPos = (x: number, y: number, idx: number) => {
    const defaultC = idx % 2 === 0 ? "." : "#"
    let binaryStr = ""

    binaryStr += (baseImage[y - 1]?.[x - 1] ?? defaultC) === "." ? "0" : "1"
    binaryStr += (baseImage[y - 1]?.[x] ?? defaultC) === "." ? "0" : "1"
    binaryStr += (baseImage[y - 1]?.[x + 1] ?? defaultC) === "." ? "0" : "1"

    binaryStr += (baseImage[y]?.[x - 1] ?? defaultC) === "." ? "0" : "1"
    binaryStr += (baseImage[y]?.[x] ?? defaultC) === "." ? "0" : "1"
    binaryStr += (baseImage[y]?.[x + 1] ?? defaultC) === "." ? "0" : "1"

    binaryStr += (baseImage[y + 1]?.[x - 1] ?? defaultC) === "." ? "0" : "1"
    binaryStr += (baseImage[y + 1]?.[x] ?? defaultC) === "." ? "0" : "1"
    binaryStr += (baseImage[y + 1]?.[x + 1] ?? defaultC) === "." ? "0" : "1"

    return base[parseInt(binaryStr, 2)]
  }

  const margin = 1

  for (let i = 0; i < nTimes; i++) {
    baseImage = Array(baseImage.length + margin + margin)
      .fill(null)
      .map((_, idx) => idx - margin)
      .map((y) =>
        Array(baseImage[0].length + margin + margin)
          .fill(null)
          .map((_, idx) => idx - margin)
          .map((x) => getPixelAtPos(x, y, i))
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
