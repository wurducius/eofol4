import { hexToCSSFilter } from "hex-to-css-filter"
import { injectElement, registerServiceworker } from "../../util"

injectElement("script", "Script injected and working!", true)
injectElement("module", "External dependency imported and working!", Boolean(hexToCSSFilter))

registerServiceworker("../../")
