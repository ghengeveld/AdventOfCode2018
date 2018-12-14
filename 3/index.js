// --- Day 3: No Matter How You Slice It ---

const input = require("./input")
// const input = ["#1 @ 1,3: 4x4", "#2 @ 3,1: 4x4", "#3 @ 5,5: 2x2"]

const claims = input.map(line => {
  const [_, id, l, t, w, h] = line.match(/#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/)
  return {
    id,
    left: parseInt(l, 10),
    top: parseInt(t, 10),
    width: parseInt(w, 10),
    height: parseInt(h, 10),
    right: parseInt(l, 10) + parseInt(w, 10),
    bottom: parseInt(t, 10) + parseInt(h, 10),
  }
})

console.log(claims)

const bbox = claims.reduce(
  (res, { right, bottom }) => {
    if (!res.right || right > res.right) res.right = right
    if (!res.bottom || bottom > res.bottom) res.bottom = bottom
    return res
  },
  { left: 0, top: 0, right: 0, bottom: 0 }
)
bbox.width = bbox.right - bbox.left
bbox.height = bbox.bottom - bbox.top

const grid = []
for (let x = 0; x <= bbox.width; x++) {
  grid[x] = []
  for (let y = 0; y <= bbox.height; y++) {
    grid[x][y] = 0
  }
}

claims.forEach(({ left, top, right, bottom }) => {
  for (let x = left; x < right; x++) {
    for (let y = top; y < bottom; y++) {
      grid[x][y]++
    }
  }
})

console.log(grid.reduce((acc, row) => row.reduce((acc, cell) => (cell > 1 ? acc + 1 : acc), acc), 0))

console.log(
  claims
    .map(({ id, left, top, right, bottom }) => {
      for (let x = left; x < right; x++) {
        for (let y = top; y < bottom; y++) {
          if (grid[x][y] > 1) return false
        }
      }
      return id
    })
    .filter(Boolean)
)
