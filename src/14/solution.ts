import { linkedList, LinkedListNode } from "../utils/linkedLists"

const solution1 = (lines: string[]) => {
  const [first] = linkedList<string>(lines[0].split(""))
  const rules = new Map<string, string>(
    lines.slice(2).map((line) => line.split(" -> ") as [string, string]),
  )

  for (let i = 0; i < 10; i++) {
    let current = first
    while (current.next) {
      const key = current.value + current.next.value
      if (rules.has(key)) {
        const newNode = {
          value: rules.get(key)!,
          next: current.next,
        }
        current.next = newNode
        current = newNode.next
      } else {
        current = current.next
      }
    }
  }

  const elements: Record<string, number> = {}
  let current: LinkedListNode<string> | undefined = first
  while (current) {
    elements[current.value] = (elements[current.value] ?? 0) + 1
    current = current.next
  }
  const sorted = Object.entries(elements).sort((a, b) => a[1] - b[1])

  return sorted[sorted.length - 1][1] - sorted[0][1]
}

const solution2 = (lines: string[]) => {
  const rules = new Map<string, string>(
    lines.slice(2).map((line) => line.split(" -> ") as [string, string]),
  )

  let pairs: Record<string, number> = {}
  lines[0]
    .split("")
    .map((c, idx, arr) => c + arr[idx + 1])
    .slice(0, -1)
    .forEach((pair) => {
      pairs[pair] = (pairs[pair] ?? 0) + 1
    })
  let elements: Record<string, number> = {}
  lines[0].split("").forEach((e) => {
    elements[e] = (elements[e] ?? 0) + 1
  })

  for (let i = 0; i < 40; i++) {
    const nextPairs: Record<string, number> = {}
    const nextElements = { ...elements }

    Object.entries(pairs).forEach(([key, value]) => {
      if (rules.has(key)) {
        const middle = rules.get(key)!
        nextPairs[key[0] + middle] = (nextPairs[key[0] + middle] ?? 0) + value
        nextPairs[middle + key[1]] = (nextPairs[middle + key[1]] ?? 0) + value
        nextElements[middle] = (nextElements[middle] ?? 0) + value
      } else {
        nextPairs[key] = (nextPairs[key] ?? 0) + value
      }
    })

    pairs = nextPairs
    elements = nextElements
  }

  const sorted = Object.entries(elements).sort((a, b) => a[1] - b[1])

  return sorted[sorted.length - 1][1] - sorted[0][1]
}

export default [solution1, solution2]
