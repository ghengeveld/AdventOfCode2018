// --- Day 2: Inventory Management System ---

// const boxes = ["abcdef", "bababc", "abbcde", "abcccd", "aabcdd", "abcdee", "ababab"]
const boxes = require("./boxes")

const counts = id =>
  id.split("").reduce((acc, char) => {
    acc[char] = acc[char] ? acc[char] + 1 : 1
    return acc
  }, {})

const groups = counts =>
  Object.values(counts).reduce(
    (acc, count) => {
      if (count === 2) acc.doubles = 1
      if (count === 3) acc.triples = 1
      return acc
    },
    { doubles: 0, triples: 0 }
  )

const checksum = boxes =>
  boxes.map(counts).reduce(
    (acc, counts) => {
      const { doubles, triples } = groups(counts)
      acc.doubles += doubles
      acc.triples += triples
      return acc
    },
    { doubles: 0, triples: 0 }
  )

const { doubles, triples } = checksum(boxes)

console.log(doubles * triples)

// --- Part Two ---

// const ids = ["abcde", "fghij", "klmno", "pqrst", "fguij", "axcye", "wvxyz"]
const ids = require("./boxes")

const compare = (a, b) => {
  if (a.length !== b.length) return []
  const common = []
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) common.push(a[i])
  }
  return common
}

for (let i = 0; i < ids.length; i++) {
  for (let j = i; j < ids.length; j++) {
    if (i !== j) {
      const common = compare(ids[i], ids[j])
      if (common.length === ids[i].length - 1) console.log(common.join(""))
    }
  }
}
