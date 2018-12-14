// --- Day 4: Repose Record ---

const input = require("./input")
// const input = [
//   "[1518-11-01 00:00] Guard #10 begins shift",
//   "[1518-11-01 00:05] falls asleep",
//   "[1518-11-01 00:25] wakes up",
//   "[1518-11-01 00:30] falls asleep",
//   "[1518-11-01 00:55] wakes up",
//   "[1518-11-01 23:58] Guard #99 begins shift",
//   "[1518-11-02 00:40] falls asleep",
//   "[1518-11-02 00:50] wakes up",
//   "[1518-11-03 00:05] Guard #10 begins shift",
//   "[1518-11-03 00:24] falls asleep",
//   "[1518-11-03 00:29] wakes up",
//   "[1518-11-04 00:02] Guard #99 begins shift",
//   "[1518-11-04 00:36] falls asleep",
//   "[1518-11-04 00:46] wakes up",
//   "[1518-11-05 00:03] Guard #99 begins shift",
//   "[1518-11-05 00:45] falls asleep",
//   "[1518-11-05 00:55] wakes up",
// ]

const { events } = input
  .map(line => {
    const [_, date, time, msg] = line.match(/\[(.+) (.+)\] (.*)/)
    return { date: new Date(`${date}T${time}:00.000Z`), msg }
  })
  .sort((a, b) => a.date - b.date)
  .reduce(
    (acc, { date, msg }) => {
      const [_, guard] = msg.match(/Guard #(\d+) /) || []
      if (guard) acc.guard = parseInt(guard, 10)
      else acc.events.push({ date, msg, guard: acc.guard })
      return acc
    },
    { guard: null, events: [] }
  )

// console.log(events.filter(({ guard }) => guard === 10))

const sleep = {}
const awake = {}
const guards = Object.values(
  events.reduce((acc, { date, msg, guard }) => {
    if (!sleep[guard]) sleep[guard] = []
    if (!awake[guard]) awake[guard] = []
    if (!acc[guard]) acc[guard] = { guard, slept: 0 }
    if (msg === "falls asleep") {
      acc[guard].sleep = date
      sleep[guard].push(date.getMinutes())
    }
    if (msg === "wakes up") {
      const slept = (date - acc[guard].sleep) / 1000 / 60
      delete acc[guard].sleep
      acc[guard].slept += slept
      awake[guard].push(date.getMinutes())
    }
    return acc
  }, {})
).sort((a, b) => b.slept - a.slept)

// console.log(guards)

// console.log(sleep[10])
// console.log(awake[10])

const isAsleep = (minute, sleep, awake) =>
  sleep.reduce((res, m, i) => res + (minute >= m && minute < awake[i] ? 1 : 0), 0)

const getMinutes = chosen => {
  const minutes = []
  for (let m = 0, s = sleep[chosen], a = awake[chosen]; m < 60; m++) {
    minutes[m] = isAsleep(m, s, a)
  }
  return minutes
}

const getMax = minutes => minutes.reduce((res, val, min) => (val > res.val ? { val, min } : res), { val: 0 })

const chosen = guards[0].guard
const max = getMax(getMinutes(chosen))
console.log(`Part 1: ${chosen} * ${max.min} = ${chosen * max.min}`)

const all = guards.map(({ guard }) => ({ guard, ...getMax(getMinutes(guard)) }))
const res = all.reduce((acc, { guard, val, min }) => (val > acc.val ? { guard, val, min } : acc), { val: 0 })
console.log(`Part 2: ${res.guard} * ${res.min} = ${res.guard * res.min}`)
