// --- Day 16: Chronal Classification ---

const fs = require("fs")
const input = fs.readFileSync(__dirname + "/input.txt", "utf8")

const toInt = n => parseInt(n, 10)
const parseState = state => state.split(", ").map(toInt)
const parseBlock = block => {
  let [before, instruction, after] = block.split("\n")
  return {
    before: parseState(before.substr(9, 10)),
    instruction: instruction.split(" ").map(toInt),
    after: parseState(after.substr(9, 10)),
  }
}

const parts = input.split("\n\n\n\n")
const samples = parts[0].split("\n\n").map(parseBlock)
const program = parts[1].split("\n").map(line => line.split(" ").map(toInt))

const ops = {
  addr: (registers, a, b, c) => (registers[c] = registers[a] + registers[b]),
  addi: (registers, a, b, c) => (registers[c] = registers[a] + b),
  mulr: (registers, a, b, c) => (registers[c] = registers[a] * registers[b]),
  muli: (registers, a, b, c) => (registers[c] = registers[a] * b),
  banr: (registers, a, b, c) => (registers[c] = registers[a] & registers[b]),
  bani: (registers, a, b, c) => (registers[c] = registers[a] & b),
  borr: (registers, a, b, c) => (registers[c] = registers[a] | registers[b]),
  bori: (registers, a, b, c) => (registers[c] = registers[a] | b),
  setr: (registers, a, b, c) => (registers[c] = registers[a]),
  seti: (registers, a, b, c) => (registers[c] = a),
  gtir: (registers, a, b, c) => (registers[c] = a > registers[b] ? 1 : 0),
  gtri: (registers, a, b, c) => (registers[c] = registers[a] > b ? 1 : 0),
  gtrr: (registers, a, b, c) => (registers[c] = registers[a] > registers[b] ? 1 : 0),
  eqir: (registers, a, b, c) => (registers[c] = a === registers[b] ? 1 : 0),
  eqri: (registers, a, b, c) => (registers[c] = registers[a] === b ? 1 : 0),
  eqrr: (registers, a, b, c) => (registers[c] = registers[a] === registers[b] ? 1 : 0),
}

const equals = (a, b) => a.join("") === b.join("")
const intersect = (a, b) => a.reduce((acc, item) => (b.includes(item) ? acc.concat(item) : acc), [])

const findOpcode = ({ before, after, instruction }) => {
  const [opcode, a, b, c] = instruction
  const candidates = Object.keys(ops).reduce((acc, key) => {
    const registers = [...before]
    ops[key](registers, a, b, c)
    if (equals(registers, after)) acc.push(key)
    return acc
  }, [])
  return { candidates, opcode: opcode.toString() }
}

// Part 1
console.log(samples.map(findOpcode).filter(({ candidates }) => candidates.length >= 3).length)

// => { [opcode]: { opcode, candidates} }
const mapping = samples.reduce((acc, sample) => {
  const { candidates, opcode } = findOpcode(sample)
  const intersection = acc[opcode] ? intersect(acc[opcode].candidates, candidates) : candidates
  acc[opcode] = { opcode, candidates: intersection }
  return acc
}, {})

const assignCandidate = (mapping, target, candidate) =>
  Object.values(mapping).reduce((acc, { opcode, candidates, assigned }) => {
    acc[opcode] = {
      opcode,
      assigned: opcode === target ? candidate : assigned,
      candidates: candidates.filter(c => c !== candidate),
    }
    return acc
  }, {})

const findNextUnassigned = mapping =>
  Object.values(mapping).reduce((acc, entry) => {
    if (entry.assigned) return acc
    if (!acc || acc.candidates.length > entry.candidates.length) return entry
    return acc
  }, null)

const map = (mapping, i = 0) => {
  const next = findNextUnassigned(mapping)
  if (!next) return mapping
  const res = assignCandidate(mapping, next.opcode, next.candidates[0])
  return i < 100 ? map(res, i + 1) : res
}

const opcodes = Object.values(map(mapping)).reduce((acc, { opcode, assigned }) => {
  acc[opcode] = ops[assigned]
  return acc
}, {})

console.log(opcodes)

let i = 0
const run = (program, registers = [0, 0, 0, 0]) => {
  const [instruction, ...remainder] = program
  if (!instruction) return registers
  i++
  const [opcode, a, b, c] = instruction
  opcodes[opcode.toString()](registers, a, b, c)
  return run(remainder, [...registers])
}

console.log(run(program))
console.log(program.length, i)
