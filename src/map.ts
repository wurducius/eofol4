import { hexToCSSFilter } from "hex-to-css-filter"
import { injectElement } from "./util"
import { capitalize, registerServiceworker } from "../runtime"
import { getEnv } from "../runtime/internals"

const maplistContent = (getEnv()?.views.map(({ path }) => path) ?? [])
  .map((view: string) => `<li><div><a href="${view}">${capitalize(view).replace(".html", "")}</a></div></li>`)
  .join("")

injectElement("map-list", maplistContent, Boolean(hexToCSSFilter))

registerServiceworker()
