import PriorityQueue from "priorityqueuejs"

const graphSearch = <T>(
  initialNode: T,
  analizeNode: (node: T) => T[] | true,
  comparator: (a: T, b: T) => number,
): T => {
  const nodesToAnalize = new PriorityQueue<T>(comparator)
  nodesToAnalize.enq(initialNode)

  do {
    const currentNode = nodesToAnalize.deq()
    const result = analizeNode(currentNode)
    if (result === true) return currentNode
    result.forEach((x) => nodesToAnalize.enq(x))
  } while (nodesToAnalize.size() > 0)

  throw new Error("No match")
}

export default graphSearch
