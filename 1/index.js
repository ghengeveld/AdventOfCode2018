// --- Day 1: Chronal Calibration ---

const frequencies = require("./frequencies")

const res = frequencies.reduce((sum, val) => sum + val)
console.log(res)

// --- Part Two ---

const freqs = []
const found = []
let sum = 0
while (found.indexOf(sum) === -1) {
  freqs.length || freqs.push(...frequencies)
  found.push(sum)
  sum += freqs.shift()
}
console.log(sum)
