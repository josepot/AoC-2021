import graphSearch from "./graphSearch"

const graphDistinctSearch = <T extends { id: string }>(
  initialNode: T,
  analizeNode: (node: T) => T[] | true,
  comparator: (a: T, b: T) => number,
  comparatorReplace: (prev: T, current: T) => boolean = () => false,
): T => {
  const analized = new Map<string, T>([[initialNode.id, initialNode]])
  return graphSearch(
    initialNode,
    (node: T) => {
      const nodes = analizeNode(node)
      if (nodes === true) return nodes
      const result = nodes.filter(
        (x) => !analized.has(x.id) || comparatorReplace(analized.get(x.id)!, x),
      )
      result.forEach((x) => analized.set(x.id, x))
      return result
    },
    comparator,
  )
}

export default graphDistinctSearch
