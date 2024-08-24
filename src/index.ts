import { hexToCSSFilter } from "hex-to-css-filter"
import { injectElement } from "./util"
import { getBreakpoint, isBrowser, registerServiceworker, sx, sy } from "../runtime"

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

const e = (tag: string, style: string | undefined, content: any, attributes?: any, properties?: any) => {
  const attributesImpl = { ...properties, ...attributes }
  if (style) {
    attributesImpl.class = style
  }
  return {
    type: tag,
    attributes: attributesImpl,
    content: Array.isArray(content) ? content : [content],
  }
}

export const first = {
  name: "first",
  render: (attributes: any, children: any) =>
    e(
      "div",
      sx({ color: "red" }),
      ["Eofol compiled!!!", `Attribute eofolAttribute = ${attributes.eofolAttribute}`, ...children].map((child) =>
        e("h1", undefined, child),
      ),
    ),
}
