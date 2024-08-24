import { hexToCSSFilter } from "hex-to-css-filter"
import { injectElement } from "./util"
import { getBreakpoint, isBrowser, registerServiceworker, sx, sy } from "../runtime"
import { getAssets } from "../runtime/internals"

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

// @TODO we are trying to fetch non-existing script bundles such as static.js for static view static.html
const prefetchAssets = () => {
  const assets = getAssets()
  const queue: string[] = []
  // @ts-ignore
  assets.pages.forEach((page: string) => {
    queue.push(page)
    const split = page.split("/")
    const scriptPath = `./assets/js/${split
      .map((part: string, i: number) => {
        if (i + 1 < split.length) {
          return part
        } else {
          const innerSplit = part.split(".")
          return innerSplit
            .map((innerPart: string, j: number) => (j + 1 < innerSplit.length ? innerPart : "js"))
            .join(".")
        }
      })
      .join("/")}`
    queue.push(scriptPath)
  })

  Promise.all(queue.map((asset) => fetch(asset).then(() => {}))).then(() => {
    console.log("Prefetch API -> All assets fetched.")
  })
}

if (isBrowser()) {
  window.onload = () => {
    prefetchAssets()
  }
}

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
