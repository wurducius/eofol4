import { hexToCSSFilter } from "hex-to-css-filter"
import { injectElement } from "./util"
import { capitalize, registerServiceworker } from "../runtime"

// @TODO automate collect views PRECOMPILE API
const collectedViews = [
  "index.html",
  "index2.html",
  "license.html",
  "map.html",
  "static.html",
  "level/index.html",
  "level/second/index.html",
  "404.html",
]

const maplistContent = collectedViews
  .map((view) => view)
  .map((view) => `<li><a href="${view}">${capitalize(view).replace(".html", "")}</a></li>`)
  .join("")

injectElement("map-list", maplistContent, Boolean(hexToCSSFilter))

registerServiceworker()
