import { getPageName, injectElement } from "./util"

const pageName = getPageName()
const content404 = pageName === "404.html" ? "Page not found." : `The requested page "${pageName}" does not exist.`

injectElement("404-msg", content404)
