import { hexToCSSFilter } from "hex-to-css-filter"
import { injectElement } from "../../util"
import { registerServiceworker } from "../../../runtime"

injectElement("script", "Script injected and working!", true)
injectElement("module", "External dependency imported and working!", Boolean(hexToCSSFilter))

registerServiceworker("../../")
