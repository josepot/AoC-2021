import graphSearch from "./graphSearch"

const graphDistinctSearch = <T extends { id: string }>(
  initialNode: T,
  analizeNode: (node: T) => T[] | true,
  comparator: (a: T, b: T) => number,
): T => {
  const analized = new Set<string>([initialNode.id])
  return graphSearch(
    initialNode,
    (node: T) => {
      const nodes = analizeNode(node)
      if (nodes === true) return nodes
      const result = nodes.filter((x) => !analized.has(x.id))
      result.forEach((x) => analized.add(x.id))
      return result
    },
    comparator,
  )
}

export default graphDistinctSearch
