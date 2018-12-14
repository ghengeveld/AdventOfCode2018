// --- Day 10: The Stars Align ---

// => https://codesandbox.io/s/q3n5nz2w99

import React from "react"
import ReactDOM from "react-dom"

import "./styles.css"
import input from "./input"

const bbox = input.reduce((bbox, { position }) => {
  if (!bbox.left || position[0] < bbox.left) bbox.left = position[0]
  if (!bbox.right || position[0] > bbox.right) bbox.right = position[0]
  if (!bbox.top || position[1] < bbox.top) bbox.top = position[1]
  if (!bbox.bottom || position[1] > bbox.bottom) bbox.bottom = position[1]
  return bbox
}, {})
bbox.width = bbox.right - bbox.left
bbox.height = bbox.bottom - bbox.top
console.log(bbox)

const scale = 0.3

const canvasWidth = Math.ceil((bbox.width * scale) / 10)
const canvasHeight = Math.ceil((bbox.height * scale) / 10)
const slow = 10499
const slowdown = 500

const getPosition = ({ position, velocity }, frame) => {
  const [vx, vy] = velocity
  let [x, y] = position
  x += frame * vx + canvasWidth / 2 - 1600
  y += frame * vy + canvasHeight / 2 - 1700
  return [x, y]
}

class App extends React.Component {
  state = { frame: 0 }
  myRef = React.createRef()
  componentDidMount() {
    this.tick(0)()
  }
  tick = frame => () => {
    this.updateCanvas(frame)
    const framelength = frame > 10690 ? 1 : frame > 10400 ? 20 : 1500
    this.setState({ frame: frame + framelength })
    if (frame < 10710) setTimeout(this.tick(frame + framelength), 200 / framelength)
  }
  updateCanvas(frame) {
    if (!this.myRef.current) return
    const ctx = this.myRef.current.getContext("2d")
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    input.forEach(point => {
      const [x, y] = getPosition(point, frame)
      ctx.fillRect(x, y, 1, 1)
    })
  }
  render() {
    return (
      <div>
        <canvas ref={this.myRef} width={canvasWidth / 7} height={canvasHeight / 14} />
        <span style={{ position: "absolute", top: 100, left: 100, zIndex: 1 }}>{this.state.frame - 1}</span>
      </div>
    )
  }
}

const rootElement = document.getElementById("root")
ReactDOM.render(<App />, rootElement)
