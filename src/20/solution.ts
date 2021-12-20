const solution1 = (lines: string[]) => {
  const base = lines[0]
  let baseImage = lines.slice(2)

  const getPixelAtPos = (x: number, y: number) => {
    let binaryStr = ""

    binaryStr += (baseImage[y - 1]?.[x - 1] ?? ".") === "." ? "0" : "1"
    binaryStr += (baseImage[y - 1]?.[x] ?? ".") === "." ? "0" : "1"
    binaryStr += (baseImage[y - 1]?.[x + 1] ?? ".") === "." ? "0" : "1"

    binaryStr += (baseImage[y]?.[x - 1] ?? ".") === "." ? "0" : "1"
    binaryStr += (baseImage[y]?.[x] ?? ".") === "." ? "0" : "1"
    binaryStr += (baseImage[y]?.[x + 1] ?? ".") === "." ? "0" : "1"

    binaryStr += (baseImage[y + 1]?.[x - 1] ?? ".") === "." ? "0" : "1"
    binaryStr += (baseImage[y + 1]?.[x] ?? ".") === "." ? "0" : "1"
    binaryStr += (baseImage[y + 1]?.[x + 1] ?? ".") === "." ? "0" : "1"

    const idx = parseInt(binaryStr, 2)

    return base[idx]
  }

  const margin = 10

  for (let i = 0; i < 2; i++) {
    baseImage = Array(baseImage.length + margin + margin)
      .fill(null)
      .map((_, idx) => idx - margin)
      .map((y) =>
        Array(baseImage[0].length + margin + margin)
          .fill(null)
          .map((_, idx) => idx - margin)
          .map((x) => getPixelAtPos(x, y))
          .join(""),
      )
  }

  return baseImage
    .slice(18)
    .slice(0, -18)
    .map((line) =>
      line
        .split("")
        .slice(18)
        .slice(0, -18)
        .filter((x) => x === "#")
        .join(""),
    )
    .join("").length
}

const solution2 = (lines: string[]) => {}

export default [solution1]
