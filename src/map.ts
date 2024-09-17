import { injectElement } from "./util"
import { capitalize, getEnv } from "../runtime"

const maplistContent = (getEnv()?.views.map(({ path }) => path) ?? [])
  .map(
    (view: string) =>
      `<li><div><a href="${view}">${view.split("/").map(capitalize).join(" / ").replace(".html", "")}</a></div></li>`,
  )
  .join("")

injectElement("map-list", maplistContent, true)
