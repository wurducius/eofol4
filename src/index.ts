import { hexToCSSFilter } from "hex-to-css-filter"
import { injectElement } from "./util"
import {
  getBreakpoint,
  isBrowser,
  registerServiceworker,
  sx,
  sy,
  div,
  h1,
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
  render: (state, attributes: Attributes, children: Children) =>
    div(sx({ color: "red" }), [
      "Eofol compiled!!!",
      `Attribute eofolAttribute = ${attributes.eofolAttribute}`,
      ...(children ?? []).map((child) => h1(undefined, child)),
    ]),
})

// @ts-ignore
export const second = defineStateful("second", {
  render: (state, attributes: Attributes, children: Children) =>
    // @ts-ignore
    state?.isRequesting
      ? div(sx({ color: "green" }), ["Dynamically rendered stateful component", createEofolElement("first")])
      : div(sx({ color: "blue" }), ["Second stateful component"]),
  initialState: { isRequesting: undefined },
  // @ts-ignore
  effect: (state, setState) => {
    if (!state.isRequesting) {
      setState({ ...state, isRequesting: true })
    }
  },
})
