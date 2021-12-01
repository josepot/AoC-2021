interface StackNode<T> {
  value: T
  prev?: StackNode<T>
}

export default class Stack<T> {
  private current?: StackNode<T>

  constructor(vals?: T[]) {
    if (vals === undefined) return
    vals.forEach((val) => this.push(val))
  }
  push(value: T) {
    this.current = { value, prev: this.current }
  }

  pop() {
    const result = this.current?.value
    this.current = this.current?.prev
    return result
  }

  peek() {
    return this.current?.value
  }
}
