// --- Day 14: Chocolate Charts ---

const input = "556061"
const target = parseInt(input, 10)
const part2 = true

const scoreboard = [3, 7]
const indexes = [0, 1]

const color = final => (score, i) => (final && i >= 9 ? "\x1b[0m\x1b[37m" + score + "\x1b[0m\x1b[2m" : score)

const print = final =>
  console.log(
    "\x1b[2m" +
      scoreboard
        .map((score, i) => (i === indexes[0] ? `(${score})` : i === indexes[1] ? `[${score}]` : ` ${score} `))
        .map(color(final))
        .join("") +
      "\x1b[0m"
  )

const combine = (a, b) =>
  (a + b)
    .toString()
    .split("")
    .map(d => parseInt(d, 10))

print()
for (let i = 0; !part2; i++) {
  const a = scoreboard[indexes[0]]
  const b = scoreboard[indexes[1]]
  scoreboard.push(...combine(a, b))
  indexes[0] = (indexes[0] + 1 + a) % scoreboard.length
  indexes[1] = (indexes[1] + 1 + b) % scoreboard.length

  if (scoreboard.length >= target + 10) {
    // print(true)
    console.log(scoreboard.slice(target, target + 10).join(""))
    break
  } else {
    // print()
  }
}

// --- Part 2 ---

for (let i = 0; part2; i++) {
  const a = scoreboard[indexes[0]]
  const b = scoreboard[indexes[1]]
  scoreboard.push(...combine(a, b))
  indexes[0] = (indexes[0] + 1 + a) % scoreboard.length
  indexes[1] = (indexes[1] + 1 + b) % scoreboard.length
  // print()
  const foundIndex = scoreboard
    .slice(-input.length - 1)
    .join("")
    .indexOf(input)
  if (foundIndex >= 0) {
    console.log(scoreboard.length - input.length - 1 + foundIndex)
    break
  }
}
