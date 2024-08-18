import { hexToCSSFilter } from "hex-to-css-filter"
import { injectElement, registerServiceworker } from "./util"

// @TODO automate collect views
const collectedViews = ["index.html", "index2.html", "license.html", "map.html", "404.html"]

const maplistContent = collectedViews
  .map((view) => `<li><a href="${view}">${view.replace(".html", "")}</a></li>`)
  .join("")

injectElement("map-list", maplistContent, Boolean(hexToCSSFilter))

registerServiceworker()
