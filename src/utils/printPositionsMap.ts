type Mapper<T> = (
  val: T,
  x: number,
  y: number,
  originalX: number,
  originalY: number,
) => string

type RecordMapper<T extends string | number | symbol> = Record<T, string>

export default function printPositionsMap<T extends string | number | symbol>(
  map: Map<string, T>,
  cellMapper: Mapper<T> | RecordMapper<T>,
) {
  const limits = [...map.keys()]
    .map((x) => x.split(",").map(Number) as [number, number])
    .reduce(
      (acc, [x, y]) => ({
        left: Math.min(acc.left, x),
        right: Math.max(acc.right, x),
        top: Math.min(acc.top, y),
        bottom: Math.max(acc.bottom, y),
      }),
      { left: Infinity, right: 0, top: Infinity, bottom: 0 },
    )
  const width = limits.right - limits.left + 1
  const hight = limits.bottom - limits.top + 1

  const mapper =
    typeof cellMapper === "function" ? cellMapper : (x: T) => cellMapper[x]

  const result = Array(hight)
    .fill(null)
    .map((_, yDelta) => yDelta + limits.top)
    .map((y, yy) =>
      Array(width)
        .fill(null)
        .map((_, xDelta) => xDelta + limits.left)
        .map((x, xx) => mapper(map.get([x, y].join(","))!, xx, yy, x, y) ?? ".")
        .join(""),
    )
  return result.join("\n")
}
