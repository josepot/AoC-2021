interface NestData {
  <T>(data: T[], ...dimensions: [number]): T[][]
  <T>(data: T[], ...dimensions: [number, number]): T[][][]
  <T>(data: T[], ...dimensions: [number, number, number]): T[][][][]
  <T>(data: T[], ...dimensions: [number, number, number, number]): T[][][][][]
  <T>(
    data: T[],
    ...dimensions: [number, number, number, number, number]
  ): T[][][][][][]
}

const nest = <T>(data: T[], len: number) => {
  if (data.length % len !== 0) {
    throw new Error(
      `Data can't be nested. ${data.length} items can't be evenly split in chunks of ${len}`,
    )
  }
  const arrLen = data.length / len
  const result: T[][] = new Array(arrLen)
  let resultIdx = 0

  for (let initialIdx = 0; initialIdx < data.length; initialIdx += len) {
    const arr: T[] = new Array(len)
    result[resultIdx++] = arr
    for (let i = 0; i < len; i++) arr[i] = data[initialIdx + i]
  }

  return result
}

const nestData: NestData = <T>(data: T[], ...dimensions: number[]) =>
  dimensions.reduce((acc, len) => nest(acc, len), data as any)

export default nestData
