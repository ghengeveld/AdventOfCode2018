// --- Day 9: Marble Mania ---

const part1 = () => {
  const players = 470
  const marbles = 72170
  const circle = [0]
  const scores = [...Array(players)].map(_ => 0)
  let current = 0

  const print = p =>
    `[${p}] ` + circle.map((v, i) => (i === current ? `(${v})` : ` ${v} `)).join("")

  const cw = (current, offset, length) => (current + offset) % length
  const ccw = (current, offset, length) =>
    (current + Math.ceil(offset / length) * length - offset) % length

  const insert = next => {
    const index = cw(current, 2, circle.length) || circle.length
    circle.splice(index, 0, next)
    current = index
  }

  const score = (player, value) => {
    scores[player - 1] += value
    const index = ccw(current, 7, circle.length)
    scores[player - 1] += circle.splice(index, 1)[0]
    current = index
  }

  // console.log(print("-"))
  for (let next = 1, player = 1; next <= marbles; next++) {
    next % 23 === 0 ? score(player, next) : insert(next)
    // console.log(print(player))
    player = player === players ? 1 : player + 1
  }

  console.log(scores.sort().reverse()[0])
}

// part1() // 388024

// --- Part 2 ---

const part2 = () => {
  const players = 470
  const marbles = 72170 * 100
  const scores = [...Array(players)].map(_ => 0)
  const node = (value, cw, ccw) => ({ value, cw, ccw })
  const start = node(0)
  start.cw = start
  start.ccw = start
  let current = start

  const print = (player, cursor = start, visited = []) =>
    visited.includes(cursor)
      ? `[${player}] ` +
        visited.map(node => (node === current ? `(${node.value})` : ` ${node.value} `)).join("")
      : print(player, cursor.cw, visited.concat(cursor))

  const insert = (value, cursor = current, offset = 1) => {
    if (!offset) {
      const { cw } = cursor
      cursor.cw = node(value, cw, cursor)
      cw.ccw = cursor.cw
      current = cursor.cw
    } else insert(value, cursor.cw, offset - 1)
  }

  const score = (player, value, cursor = current, offset = 7) => {
    if (!offset) {
      scores[player - 1] += value
      scores[player - 1] += cursor.value
      const { cw, ccw } = cursor
      cw.ccw = ccw
      ccw.cw = cw
      current = cw
    } else score(player, value, cursor.ccw, offset - 1)
  }

  // console.log(print("-"))
  for (let next = 1, player = 1; next <= marbles; next++) {
    next % 23 === 0 ? score(player, next) : insert(next)
    // console.log(print(player))
    player = player === players ? 1 : player + 1
  }

  console.log(scores.sort().reverse()[0])
}

part2() // 3180929875
