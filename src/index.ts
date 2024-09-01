import { hexToCSSFilter } from "hex-to-css-filter"
import { injectElement } from "./util"
import {
  getBreakpoint,
  isBrowser,
  registerServiceworker,
  sx,
  sy,
  div,
  defineStateful,
  Attributes,
  Children,
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
  // eslint-disable-next-line no-unused-vars
  render: (state, attributes: Attributes, children: Children) => {
    return [
      div(sx({ color: "red" }), ["Eofol compiled!!!", `Attribute eofolAttribute = ${attributes.eofolattribute}`]),
      "Output array !!!",
      // ...children,
    ]
  },
})

export const firstx = defineStateful("firstx", {
  // @ts-ignore
  // eslint-disable-next-line no-unused-vars
  render: (state, attributes: Attributes, children: Children) =>
    div(sx({ color: "red" }), ["Dynamically rendered and mounted stateful component working!"]),
})

export const second = defineStateful("second", {
  // eslint-disable-next-line no-unused-vars
  render: (state, attributes: Attributes, children: Children) =>
    // @ts-ignore
    state?.onStateChange
      ? div(sx({ color: "green" }), ["Stateful component state and effect working!", createEofolElement("firstx")])
      : div(sx({ color: "blue" }), ["Stateful component state and effect not working."]),
  initialState: { onStateChange: false },
  // @ts-ignore
  effect: (state, setState) => {
    if (!state.onStateChange) {
      setState({ ...state, onStateChange: true })
    }
  },
})
