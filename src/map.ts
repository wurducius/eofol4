import { hexToCSSFilter } from "hex-to-css-filter"
import { injectElement, registerServiceworker } from "./util"

// @TODO automate collect views
const collectedViews = ["index.html", "index2.html", "license.html", "map.html", "404.html"]

const capitalize = (str: string) =>
  str
    .split("")
    .map((letter: string, i: number) => (i === 0 ? letter.toUpperCase() : letter))
    .join("")

const maplistContent = collectedViews
  .map((view) => view)
  .map((view) => `<li><a href="${view}">${capitalize(view).replace(".html", "")}</a></li>`)
  .join("")

injectElement("map-list", maplistContent, Boolean(hexToCSSFilter))

registerServiceworker()
