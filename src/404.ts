import { getPageName, injectElement } from "./util"

injectElement("404-msg", `The requested page "${getPageName()}" does not exist.`)
