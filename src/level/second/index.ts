import { injectElement } from "../../util"
import { defineFlat, image, sx } from "../../../runtime"

injectElement("script", "Script injected and working!", true)

export const examplex = defineFlat("examplex", {
  render: () =>
    image({
      src: "phi.svg",
      alt: "Test Image API",
      height: 100,
      width: 100,
      classname: sx({ backgroundColor: "green" }),
    }),
})
