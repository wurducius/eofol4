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
  render: (attributes: Attributes, children: Children) =>
    div(sx({ color: "red" }), [
      "Eofol compiled!!!",
      `Attribute eofolAttribute = ${attributes.eofolAttribute}`,
      ...(children ?? []).map((child) => h1(undefined, child)),
    ]),
})
