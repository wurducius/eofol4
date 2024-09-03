import { injectElement } from "./util"
import { capitalize, registerServiceworker, getEnv } from "../runtime"

const maplistContent = (getEnv()?.views.map(({ path }) => path) ?? [])
  .map(
    (view: string) =>
      `<li><div><a href="${view}">${view.split("/").map(capitalize).join(" / ").replace(".html", "")}</a></div></li>`,
  )
  .join("")

injectElement("map-list", maplistContent, true)

registerServiceworker()
