import { injectElement } from "../../util"
import { defineFlat, image, registerServiceworker, sx } from "../../../runtime"

injectElement("script", "Script injected and working!", true)
// injectElement("module", "External dependency imported and working!", Boolean(hexToCSSFilter))

registerServiceworker("../../")

export const examplex = defineFlat("examplex", {
  render: () =>
    image({
      src: "../../assets/media/icons/phi.svg",
      alt: "Test Image API",
      height: 100,
      width: 100,
      classname: sx({ backgroundColor: "green" }),
    }),
})
