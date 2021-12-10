import add from "utils/add"
import Stack from "../utils/Stack"

const openToClose: Record<string, string> = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
}

const points: Record<string, number> = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
}

const completionPoints: Record<string, number> = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
}

// zero means that it's leagal
// greater than zero is the points for corrupted lines
// smaller than zero are the negated points for incomplete lines
const getScore = (chars: string): number => {
  const stack = new Stack<string>()
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i]
    const closing = openToClose[char]
    if (closing) {
      stack.push(closing)
      continue
    }
    if (stack.peek() !== char) return points[char]
    stack.pop()
  }

  let score = 0
  while (stack.peek()) {
    score *= 5
    score -= completionPoints[stack.pop()!]
  }
  return score
}

const solution1 = (lines: string[]) =>
  lines
    .map(getScore)
    .filter((x) => x > 0)
    .reduce(add)

const solution2 = (lines: string[]) => {
  const sortedResults = lines
    .map(getScore)
    .filter((x) => x < 0)
    .sort((a, b) => a - b)

  return sortedResults[(sortedResults.length - 1) / 2] * -1
}

export default [solution1, solution2]
