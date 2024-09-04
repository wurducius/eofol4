import { injectElement, randomString } from "./util"
import {
  button,
  createEofolElement,
  createProjection,
  createStore,
  cx,
  dataContainer,
  defineStateful,
  div,
  forceRerender,
  getBreakpoint,
  isBrowser,
  registerServiceworker,
  selector,
  setStore,
  sx,
  sy,
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

const buttonStyle = cx(buttonBaseStyle, buttonHoverStyle, buttonActiveStyle, buttonFocusStyle)

export const first = defineStateful("first", {
  // @ts-ignore
  render: (props) => [
    div(sx({ color: "red" }), ["Eofol compiled!!!", `Attribute eofolAttribute = ${props.attributes.eofolattribute}`]),
    "Output array !!!",
    randomString(),
    // ...props.children,
  ],
})

export const firstx = defineStateful("firstx", {
  render: () => div(sx({ color: "red" }), ["Dynamically rendered and mounted stateful component working!"]),
})

export const firstxx = defineStateful("firstxx", {
  // @ts-ignore
  render: (props) => ["Firstxx", ...props.children],
})

export const second = defineStateful("second", {
  render: (props) =>
    // @ts-ignore
    props.state?.onStateChange
      ? div(sx({ color: "green" }), [
          "Stateful component state and effect working!",
          createEofolElement("firstx"),
          createEofolElement("firstxx", undefined, ["Nested child"]),
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

const onForceRerender = () => {
  forceRerender()
  console.log("Force rerender")
}

export const third = defineStateful("third", {
  render: () =>
    button(
      buttonStyle,
      "Force rerender",
      {},
      {
        onclick: onForceRerender,
      },
    ),
})

export const weather = dataContainer("weather", {
  // @ts-ignore
  render: (props) => div(undefined, `Latitude = ${props.state?.data.latitude}°`),
  url: "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m",
})

const STORE1 = "store1"
const STORE2 = "store2"
createStore(STORE1, { data: 1 })
createProjection(STORE2, STORE1, (state) => ({ data: state.data }))

export const subscribed = defineStateful("subscribed", {
  render: () => {
    const stored = selector(STORE1)
    return div(undefined, `Subscribed${stored.data ? ` -> ${stored.data}` : ""}`)
  },
})

export const projection = defineStateful("projection", {
  render: () => {
    const stored = selector(STORE2)
    return div(undefined, `Projection${stored.data ? ` -> ${stored.data}` : ""}`)
  },
})

const onSetStore = () => {
  console.log("Set store!")
  setStore(STORE1, { data: 2 })
}

// @TODO bind onclick handler at compile time OR rehydrate
export const storeSetter = defineStateful("storeSetter", {
  render: () => button(buttonStyle, "Set store", {}, { onclick: isBrowser() && onSetStore }),
})
