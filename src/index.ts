import { hexToCSSFilter } from "hex-to-css-filter"
import { injectElement } from "./util"
import { getBreakpoint, isBrowser, registerServiceworker, sx, sy, div, defineStateful } from "../runtime"
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
      // ...children,
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
      ? div(sx({ color: "green" }), ["Stateful component state and effect working!", createEofolElement("firstx")])
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
