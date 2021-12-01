export const range = (start: number, limit: number) =>
  Array(limit - start)
    .fill(null)
    .map((_, idx) => start + idx)

interface LinkedListNode<T> {
  value: T
  next?: LinkedListNode<T>
}
interface CircularLinkedListNode<T> {
  value: T
  next: CircularLinkedListNode<T>
}

interface DoubleLinkedListNode<T> {
  value: T
  next?: DoubleLinkedListNode<T>
  prev?: DoubleLinkedListNode<T>
}
interface DoubleCircularLinkedListNode<T> {
  value: T
  next: DoubleCircularLinkedListNode<T>
  prev: DoubleCircularLinkedListNode<T>
}

export const linkedList = <T>(values: T[]) => {
  const instances: LinkedListNode<T>[] = values.map((value) => ({ value }))
  range(0, values.length - 1).forEach(
    (idx) => (instances[idx].next = instances[idx + 1]),
  )
  return instances
}

export const circularLinkedList = <T>(values: T[]) => {
  const instances = linkedList(values)
  instances[instances.length - 1].next = instances[0]
  return instances as CircularLinkedListNode<T>[]
}

export const doubleLinkedList = <T>(values: T[]) => {
  const instances: DoubleLinkedListNode<T>[] = linkedList(values)
  let [node] = instances

  while (node && node.next && !node.next.prev) {
    node.next.prev = node
    node = node.next
  }
  return instances
}

export const doubleCircularLinkedList = <T>(values: T[]) => {
  const instances = doubleLinkedList(values)

  let [first] = instances
  let last = instances[instances.length - 1]
  first.prev = last
  last.next = first

  return instances as any as DoubleCircularLinkedListNode<T>
}

export const countNodes = <T>(
  initialNode: LinkedListNode<T> | DoubleLinkedListNode<T>,
) => {
  if (!initialNode) return 0

  let curr: LinkedListNode<T> | DoubleLinkedListNode<T> | undefined =
    initialNode
  let count = 0

  while (curr) {
    count++
    curr = curr.next
  }
  return count
}
