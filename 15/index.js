// --- Day 15: Beverage Bandits ---

const framelength = 0

//*/
const expected = undefined
const output = undefined
const input = `
################################
######......###...##..##########
######....#G###G..##.G##########
#####...G##.##.........#########
##....##..#.##...........#######
#....#G.......##.........G.#####
##..##GG....G.................##
##.......G............#.......##
###.....G.....G#......E.......##
##......##....................##
#.....####......G.....#...######
#.#########.G....G....#E.#######
###########...#####......#######
###########..#######..E.......##
###########.#########......#.###
########..#.#########.........##
#######G....#########........###
##.##.#.....#########...EE#..#.#
#...GG......#########.#...##..E#
##...#.......#######..#...#....#
###.##........#####......##...##
###.........................#..#
####.............##........###.#
####............##.........#####
####..##....###.#...#.....######
########....###..............###
########..G...##.###...E...E.###
#########...G.##.###.E....E.####
#########...#.#######.......####
#############..########...######
##############.########.########
################################
`.trim()
//*/

/* valid: 47 * 590 = 27730
const expected = 27730 // 47 * 590
const input = `
#######
#.G...#
#...EG#
#.#.#G#
#..G#E#
#.....#
#######
`.trim()
const output = `
#######
#G....#
#.G...#
#.#.#G#
#...#.#
#....G#
#######
`.trim()
//*/

/* hp invalid: 37 * 985 = 36445
const expected = 36334 // 37 * 982
const input = `
#######
#G..#E#
#E#E.E#
#G.##.#
#...#E#
#...E.#
#######
`.trim()
const output = `
#######
#...#E#
#E#...#
#.E##.#
#E..#E#
#.....#
#######
`.trim()
//*/

/* rounds invalid: 45 * 859 = 38655
const expected = 39514 // 46 * 859
const input = `
#######
#E..EG#
#.#G.E#
#E.##E#
#G..#.#
#..E#.#
#######
`.trim()
const output = `
#######
#.E.E.#
#.#E..#
#E.##.#
#.E.#.#
#...#.#
#######
`.trim()
//*/

/* hp invalid: 35 * 790 = 27650
const expected = 27755 // 35 * 793
const input = `
#######
#E.G#.#
#.#G..#
#G.#.G#
#G..#.#
#...E.#
#######
`.trim()
const output = `
#######
#G.G#.#
#.#G..#
#..#..#
#...#G#
#...G.#
#######
`.trim()
//*/

/* valid
const expected = 28944 // 54 * 536
const input = `
#######
#.E...#
#.#..G#
#.###.#
#E#G#G#
#...#G#
#######
`.trim()
const output = `
#######
#.....#
#.#G..#
#.###.#
#.#.#.#
#G.G#G#
#######
`.trim()
//*/

/* valid
const expected = 18740 // 20 * 937
const input = `
#########
#G......#
#.E.#...#
#..##..G#
#...##..#
#...#...#
#.G...G.#
#.....G.#
#########
`.trim()
const output = `
#########
#.G.....#
#G.G#...#
#.G##...#
#...##..#
#.G.#...#
#.......#
#.......#
#########
`.trim()
//*/

const map = input.split("\n").map(line => line.split(""))
const hp = []
const getHP = ({ x, y }) => hp[y][x]
const reduceHP = ({ x, y }, ap) => (hp[y][x] = Math.max(0, getHP({ x, y }) - ap))
const moveHP = (from, to) => {
  if (!hp[to.y]) hp[to.y] = []
  hp[to.y][to.x] = hp[from.y][from.x]
  hp[from.y][from.x] = null
}
const printHP = line => (line ? " " + line.filter(Boolean).join(" ") : "")

const copy = map => [...map.map(line => [...line])]
const print = (map, withHP = true) =>
  map
    .map(
      (line, l) =>
        line.map(c => c.toString().substr(0, 1)).join("") + (withHP ? printHP(hp[l]) : "")
    )
    .join("\n") + "\n"

// map => [...{type, x, y}]
const findUnits = (map, types = ["E", "G"]) =>
  map.reduce(
    (acc, line, y) =>
      line.reduce(
        (acc, char, x) =>
          types.includes(char) ? acc.concat({ type: char, position: { x, y } }) : acc,
        acc
      ),
    []
  )

const canAttack = (position, targets) => {
  for (let i = 0; i < targets.length; i++) {
    const { x, y } = targets[i].position
    if (y - 1 === position.y && x === position.x) return true
    if (y + 1 === position.y && x === position.x) return true
    if (y === position.y && x - 1 === position.x) return true
    if (y === position.y && x + 1 === position.x) return true
  }
  return false
}

const findInRange = (map, targets) =>
  targets.reduce((acc, { position: { x, y } }) => {
    if (map[y - 1][x] === ".") acc.push({ x, y: y - 1 })
    if (map[y + 1][x] === ".") acc.push({ x, y: y + 1 })
    if (map[y][x - 1] === ".") acc.push({ x: x - 1, y })
    if (map[y][x + 1] === ".") acc.push({ x: x + 1, y })
    return acc
  }, [])

// const findMoves = ({ map, position: { x, y }, visited = [] }) => {
//   const moves = []
//   const tryMove = (x, y) =>
//     map[y][x] === "." && !visited.includes(`${x},${y}`) && moves.push({ x, y })
//   tryMove(x, y - 1)
//   tryMove(x, y + 1)
//   tryMove(x - 1, y)
//   tryMove(x + 1, y)
//   return moves
// }

// const findPaths = ({
//   map,
//   position,
//   target,
//   visited = [`${position.x},${position.y}`],
//   paths = [],
// }) => {
//   if (position.x === target.x && position.y === target.y) return paths.concat([visited.slice(1)])
//   const moves = findMoves({ map, position, visited })
//   if (!moves.length) return paths
//   return moves.reduce(
//     (acc, { x, y }) =>
//       acc.concat(
//         findPaths({
//           map,
//           position: { x, y },
//           target,
//           visited: visited.concat(`${x},${y}`),
//           paths,
//         })
//       ),
//     []
//   )
// }

// (map, target) => [...{x, y}]
const getSurrounding = (map, { x, y }, isValid = (map, x, y) => map[y][x] === ".") => {
  return [
    isValid(map, x, y - 1) && { x, y: y - 1 },
    isValid(map, x, y + 1) && { x, y: y + 1 },
    isValid(map, x - 1, y) && { x: x - 1, y },
    isValid(map, x + 1, y) && { x: x + 1, y },
  ].filter(Boolean)
}

const getDistances = (positions, distances, distance = 0, visited = []) =>
  positions.length
    ? getDistances(
        positions.reduce((arr, { x, y }) => {
          if (!visited.includes(`${x},${y}`)) {
            visited.push(`${x},${y}`)
            distances[y][x] = distance
            arr.push(...getSurrounding(distances, { x, y }))
          }
          return arr
        }, []),
        distances,
        distance + 1,
        visited
      )
    : distances

const sortPositions = (a, b) => {
  if (a.y > b.y) return 1
  if (a.y < b.y) return -1
  return a.x > b.x ? 1 : a.x < b.x ? -1 : 1
}

const sortMoves = (a, b) => {
  if (a.distance > b.distance) return 1
  if (a.distance < b.distance) return -1
  return sortPositions(a, b)
}

const sortUnits = (a, b) => {
  if (a.hp > b.hp) return 1
  if (a.hp < b.hp) return -1
  return sortPositions(a, b)
}

const findMove = (map, position, target) => {
  const distances = getDistances([target], copy(map))
  const moves = getSurrounding(distances, position, (map, x, y) => typeof map[y][x] === "number")
    .map(({ x, y }) => ({ x, y, distance: distances[y][x] }))
    .sort(sortMoves)
  return moves[0]
}

const turn = ap => ({ type, position }) => {
  if (!hp[position.y][position.x]) return true
  const opponentType = type === "E" ? "G" : "E"
  const targets = findUnits(map, [opponentType])
  if (!targets.length) {
    return false
  }

  let newPosition = position
  if (!canAttack(position, targets)) {
    const possibleTargets = findInRange(map, targets)
    const possibleMoves = possibleTargets
      .map(target => findMove(map, position, target))
      .filter(Boolean)
      .sort(sortMoves)
    const bestMove = possibleMoves[0]
    if (bestMove) {
      const { x, y } = bestMove
      map[y][x] = map[position.y][position.x]
      map[position.y][position.x] = "."
      newPosition = { x, y }
      moveHP(position, newPosition)
    }
  }

  const opponent = getSurrounding(map, newPosition, (map, x, y) => map[y][x] === opponentType)
    .map(({ x, y }) => ({ x, y, hp: getHP({ x, y }) }))
    .sort(sortUnits)[0]
  if (opponent) {
    reduceHP(opponent, opponentType === "E" ? 3 : ap)
    if (getHP(opponent) <= 0) {
      map[opponent.y][opponent.x] = "."
    }
  }
  return true
}

const units = findUnits(map)
const elves = units.filter(({ type }) => type === "E").length

const game = elfAP => {
  units.forEach(({ position: { x, y } }) => {
    if (!hp[y]) hp[y] = []
    hp[y][x] = 200
  })
  let rounds = 0

  const run = () => {
    const fullRound = findUnits(map)
      .map(turn(elfAP))
      .every(done => done)
    if (fullRound) {
      rounds++
      framelength ? setTimeout(run, framelength) : run()
    } else {
      const sum = []
        .concat(...hp)
        .filter(Boolean)
        .reduce((sum, val) => sum + val, 0)
      output && console.log("  correct positions:", output === print(map, false).trim())
      expected && console.log(`  correct value: ${rounds * sum === expected} (${expected})`)
      console.log(`  ${rounds} * ${sum} = ${rounds * sum}`)
      console.log(`  losses: ${elves - findUnits(map).filter(({ type }) => type === "E").length}\n`)
    }
    // console.log(print(map))
  }

  console.log(print(map))
  setTimeout(run, framelength)
}

game(15)
