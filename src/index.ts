import { injectElement, randomString } from "./util"
import {
  getBreakpoint,
  isBrowser,
  registerServiceworker,
  sx,
  sy,
  div,
  defineStateful,
  button,
  forceRerender,
  cx,
  createEofolElement,
  dataContainer,
} from "../runtime"

const injectBreakpoint = () => {
  const breakpoint = getBreakpoint()
  injectElement("breakpoint", `Breakpoint: ${breakpoint}`, breakpoint !== undefined)
}

injectElement("script", "Script injected and working!", true)
// injectElement("module", "External dependency imported and working!", Boolean(hexToCSSFilter))
injectBreakpoint()
if (isBrowser()) {
  document.getElementById("sx")?.setAttribute("class", sx({ color: "fuchsia" }))
  document.getElementById("sy")?.setAttribute("class", sy("sy-classname-test", { color: "lightgreen" }))

  window.onresize = () => {
    injectBreakpoint()
  }
}

registerServiceworker()

const buttonBaseStyle = sx({
  backgroundColor: "darkmagenta",
  border: "1px solid purple",
  color: "white",
  fontFamily: "inherit",
  fontSize: "16px",
  fontWeight: 500,
  cursor: "pointer",
  padding: "4px 16px",
})
const buttonHoverStyle = sx({ backgroundColor: "purple", color: "red" }, ":hover")
const buttonActiveStyle = sx({ backgroundColor: "purple", color: "red" }, ":active")
const buttonFocusStyle = sx({ backgroundColor: "purple", color: "red" }, ":focus")

export const first = defineStateful("first", {
  // @ts-ignore
  render: (props) => {
    return [
      div(sx({ color: "red" }), ["Eofol compiled!!!", `Attribute eofolAttribute = ${props.attributes.eofolattribute}`]),
      "Output array !!!",
      randomString(),
      // ...props.children,
    ]
  },
})

export const firstx = defineStateful("firstx", {
  render: () => div(sx({ color: "red" }), ["Dynamically rendered and mounted stateful component working!"]),
})

export const second = defineStateful("second", {
  render: (props) =>
    // @ts-ignore
    props.state?.onStateChange
      ? div(sx({ color: "green" }), [
          "Stateful component state and effect working!",
          createEofolElement("firstx"),
          createEofolElement("third"),
        ])
      : div(sx({ color: "blue" }), ["Stateful component state and effect not working."]),
  initialState: { onStateChange: false },
  // @ts-ignore
  effect: (props) => {
    const { state, setState } = props
    if (!state.onStateChange) {
      setState({ ...state, onStateChange: true })
    }
  },
})

export const third = defineStateful("third", {
  render: () => {
    return button(
      cx(buttonBaseStyle, buttonHoverStyle, buttonActiveStyle, buttonFocusStyle),
      "Force rerender",
      {},
      {
        onclick: () => {
          forceRerender()
          console.log("Force rerender")
        },
      },
    )
  },
})

export const weather = dataContainer("weather", {
  // @ts-ignore
  render: (props) => div(undefined, `Latitude = ${props.state?.data.latitude}°`),
  url: "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m",
})
