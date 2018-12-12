// --- Day 11: Chronal Charge ---

const getPowerLevel = (x, y, sn) => {
  // Find the fuel cell's rack ID, which is its X coordinate plus 10.
  const rackID = x + 10
  // Begin with a power level of the rack ID times the Y coordinate.
  let power = rackID * y
  // Increase the power level by the value of the grid serial number (your puzzle input).
  power += sn
  // Set the power level to itself multiplied by the rack ID.
  power *= rackID
  // Keep only the hundreds digit of the power level (so 12345 becomes 3; numbers with no hundreds digit become 0).
  power = Math.floor(power / 100) % 10
  // Subtract 5 from the power level.
  return power - 5
}

const getTotalPower = (x, y, sn, size) => {
  let power = 0
  for (let xx = x; xx < x + size && xx <= 300; xx++) {
    for (let yy = y; yy < y + size && yy <= 300; yy++) {
      power += getPowerLevel(xx, yy, sn)
    }
  }
  return power
}

const findMaxPower = sn => {
  const res = { max: 0 }
  for (let size = 1; size <= 300; size++) {
    for (let x = 1; x + size - 1 <= 300; x++) {
      for (let y = 1; y + size - 1 <= 300; y++) {
        const power = getTotalPower(x, y, sn, size)
        if (power > res.max) {
          res.max = power
          res.x = x
          res.y = y
          res.size = size
          console.log(`${res.x},${res.y},${res.size} (${res.max})`)
        }
      }
    }
  }
}

findMaxPower(9110)
