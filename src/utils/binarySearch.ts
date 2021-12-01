export default function binarySearch(
  cb: (x: number) => number,
  bottomLimit: number,
  topLimit: number,
  selectTop: boolean,
) {
  let up = topLimit
  let down = bottomLimit

  let diff
  while ((diff = Math.floor((up - down) / 2)) > 0) {
    const result = cb(down + diff)

    if (result > 0) {
      up -= diff
    } else if (result < 0) {
      down += diff
    } else {
      return down + diff
    }
  }

  return selectTop ? up : down
}
