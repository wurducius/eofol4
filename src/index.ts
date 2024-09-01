import { hexToCSSFilter } from "hex-to-css-filter"
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
} from "../runtime"
import { createEofolElement } from "../runtime/core/eofol"

const injectBreakpoint = () => {
  const breakpoint = getBreakpoint()
  injectElement("breakpoint", `Breakpoint: ${breakpoint}`, breakpoint !== undefined)
}

injectElement("script", "Script injected and working!", true)
injectElement("module", "External dependency imported and working!", Boolean(hexToCSSFilter))
injectBreakpoint()
if (isBrowser()) {
  document.getElementById("sx")?.setAttribute("class", sx({ color: "fuchsia" }))
  document.getElementById("sy")?.setAttribute("class", sy("sy-classname-test", { color: "lightgreen" }))

  window.onresize = () => {
    injectBreakpoint()
  }
}

registerServiceworker()

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
  // @ts-ignore
  render: () => {
    return button(
      `${sx({
        backgroundColor: "fuchsia",
        border: "1px solid purple",
        color: "white",
        fontFamily: "inherit",
        fontSize: "16px",
        fontWeight: 500,
        cursor: "pointer",
        padding: "4px 16px",
      })} ${sx({ backgroundColor: "purple", color: "red" }, ":hover")}`,
      "Force rerender",
      {},
      {
        onclick: () => {
          forceRerender().then(() => {
            console.log("Force rerender")
          })
        },
      },
    )
  },
})
