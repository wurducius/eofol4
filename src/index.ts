import { hexToCSSFilter } from "hex-to-css-filter"
import { injectElement } from "./util"
import { getBreakpoint, registerServiceworker, sx, sy } from "../runtime"

const injectBreakpoint = () => {
  const breakpoint = getBreakpoint()
  injectElement("breakpoint", `Breakpoint: ${breakpoint}`, breakpoint !== undefined)
}

injectElement("script", "Script injected and working!", true)
injectElement("module", "External dependency imported and working!", Boolean(hexToCSSFilter))
injectBreakpoint()
document.getElementById("sx")?.setAttribute("class", sx({ color: "fuchsia" }))
document.getElementById("sy")?.setAttribute("class", sy("sy-classname-test", { color: "lightgreen" }))

window.onresize = () => {
  injectBreakpoint()
}

registerServiceworker()
