// --- Day 12: Subterranean Sustainability ---

// Part 1
// const hints = {
//   "...##": "#",
//   "..#..": "#",
//   ".#...": "#",
//   ".#.#.": "#",
//   ".#.##": "#",
//   ".##..": "#",
//   ".####": "#",
//   "#.#.#": "#",
//   "#.###": "#",
//   "##.#.": "#",
//   "##.##": "#",
//   "###..": "#",
//   "###.#": "#",
//   "####.": "#",
// }
// let state = "#..#.#..##......###...###"
// const generations = 20

// Part 2
const hints = {
  "...##": "#",
  "###..": ".",
  "#.#.#": ".",
  "#####": ".",
  "....#": ".",
  "##.##": ".",
  "##.#.": "#",
  "##...": "#",
  "#..#.": "#",
  "#.#..": ".",
  "#.##.": ".",
  ".....": ".",
  "##..#": ".",
  "#..##": ".",
  ".##.#": "#",
  "..###": "#",
  "..#.#": "#",
  ".####": "#",
  ".##..": ".",
  ".#..#": "#",
  "..##.": ".",
  "#....": ".",
  "#...#": ".",
  ".###.": ".",
  "..#..": ".",
  "####.": "#",
  ".#.##": ".",
  "###.#": ".",
  "#.###": "#",
  ".#...": "#",
  ".#.#.": ".",
  "...#.": ".",
}
let state = "######....##.###.#..#####...#.#.....#..#.#.##......###.#..##..#..##..#.##..#####.#.......#.....##.."
const generations = 125

const getSlice = (state, i) =>
  (state[i - 2] || ".") + (state[i - 1] || ".") + (state[i] || ".") + (state[i + 1] || ".") + (state[i + 2] || ".")

let offset = 0

const pad = (state, offset = 0) => {
  const left = state.replace(/^\.*#/, ".....#")
  return {
    state: left.replace(/#\.*$/, "#....."),
    offset: offset + left.length - state.length,
  }
}

const calculate = state =>
  state
    .split("")
    .map((c, i) => ({ c, i: i - offset }))
    .filter(({ c }) => c === "#")
    .reduce((sum, { i }) => sum + i, 0)

padded = pad(state, offset)
state = padded.state
offset = padded.offset
let res = calculate(state)
let old = 0

console.log(`0: ${state} (${res})`)
for (let gen = 1; gen <= generations; gen++) {
  padded = pad(state, offset)
  state = padded.state
  offset = padded.offset
  let next = state
  for (let i = 0, len = next.length; i < len; i++) {
    const slice = getSlice(state, i)
    next = next.substr(0, i) + (hints[slice] || ".") + next.substr(i + 1)
  }
  state = next
  old = res
  res = calculate(state)
  console.log(`${gen}: ${state} (${res}) [${res - old}]`)
}

console.log(calculate(state) + (50000000000 - 200) * 73)
