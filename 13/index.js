// --- Day 13: Mine Cart Madness ---

const fs = require("fs")
const terminalOverwrite = require("terminal-overwrite")
const input = fs.readFileSync(__dirname + "/example4.txt", "utf8")

// clean up crashed carts (for Part 2)
const cleanup = false
// overwrite printed lines ("animated" output)
const overwrite = true
// print the tracks and trains
const printmap = true
// time in ms between ticks
const framelength = 72

let crash
let cartLocations = []
const color = cell => {
  if (cell === "v" || cell === "^" || cell === "<" || cell === ">") return "\x1b[0m\x1b[37m" + cell + "\x1b[0m\x1b[2m"
  if (cell === "X") return "\x1b[0m\x1b[31m" + cell + "\x1b[0m\x1b[2m"
  return cell
}
const write = overwrite ? terminalOverwrite : console.log
const print = (grid, frame) => {
  const tracks = printmap
    ? "\x1b[2m   " + grid.map(row => row.map(cell => color(cell)).join("")).join("\n   ") + "\x1b[0m"
    : ""
  write(" \n \n \n \n" + tracks + `\n \n \n \n \nFrame: ${frame}\nRemaining carts: ${cartLocations.length}`)
}

const grid = input
  .split(/\n/)
  .filter(row => row)
  .map(row => row.split(""))

print(grid, 0)

const copy = grid => [...grid].map(row => [...row])

const state = grid.reduce(
  (acc, row, y) =>
    row.reduce((acc, cell, x) => {
      const replacement = { "^": "|", v: "|", "<": "-", ">": "-" }[cell]
      if (replacement) acc.tracks[y][x] = replacement
      else acc.carts[y][x] = " "
      return acc
    }, acc),
  { tracks: copy(grid), carts: copy(grid) }
)

const merge = ({ tracks, carts }) =>
  tracks.map((row, y) => row.map((cell, x) => (carts[y][x] !== " " ? carts[y][x] : cell)))

// print(state.tracks)
// print(state.carts)

const clearCrashes = carts => carts.map(row => row.map(cell => (cell === "X" ? " " : cell)))
const getLocations = carts =>
  carts.reduce((acc, row, y) => row.reduce((acc, cell, x) => (cell === " " ? acc : acc.concat({ x, y })), acc), [])

const move = (cart, track, occupied, turn, x, y) => {
  if (occupied) {
    crash = [x, y]
    return ["X", turn]
  }
  const up = cart === "^"
  const down = cart === "v"
  const left = cart === "<"
  const right = cart === ">"
  if (track === "+") {
    if (turn === "left") {
      if (up) return ["<", "straight"]
      if (down) return [">", "straight"]
      if (left) return ["v", "straight"]
      if (right) return ["^", "straight"]
    }
    if (turn === "right") {
      if (up) return [">", "left"]
      if (down) return ["<", "left"]
      if (left) return ["^", "left"]
      if (right) return ["v", "left"]
    }
    return [cart, "right"]
  }
  if (track === "/") {
    if (up) return [">", turn]
    if (down) return ["<", turn]
    if (left) return ["v", turn]
    if (right) return ["^", turn]
  }
  if (track === "\\") {
    if (up) return ["<", turn]
    if (down) return [">", turn]
    if (left) return ["^", turn]
    if (right) return ["v", turn]
  }
  return [cart, turn]
}

const turns = {}

const tick = () => {
  crash = undefined
  const next = copy(state.carts)
  state.carts.forEach((row, y) =>
    row.forEach((cell, x) => {
      const d = {
        "^": { x: 0, y: -1 },
        v: { x: 0, y: 1 },
        "<": { x: -1, y: 0 },
        ">": { x: 1, y: 0 },
      }[cell]
      if (d) {
        const nx = x + d.x
        const ny = y + d.y
        const [dir, turn] = move(
          cell,
          state.tracks[ny][nx],
          next[y][x] === "X" || next[ny][nx] !== " ",
          turns[`${x},${y}`] || "left",
          nx,
          ny
        )
        delete turns[`${x},${y}`]
        if (dir !== " " && dir !== "X") {
          turns[`${nx},${ny}`] = turn
        }
        next[ny][nx] = dir
        next[y][x] = " "
      }
    })
  )
  state.carts = cleanup ? clearCrashes(next) : next
  cartLocations = getLocations(state.carts)
}

const run = (frame = 1) => {
  tick()
  print(merge(state), frame)
  if (cleanup ? cartLocations.length === 1 : crash) {
    terminalOverwrite.done()
    console.log(cleanup ? `Last cart location: ${JSON.stringify(cartLocations)}` : `Crash at: ${JSON.stringify(crash)}`)
  } else {
    setTimeout(run, printmap ? framelength : 0, frame + 1)
  }
}

run()
