import { img } from "../core"
import { sx } from "../styles"
import { cx } from "../util"

const imageBaseStyle = sx({})
const imageStyle = cx(imageBaseStyle)

// @TODO register prefetch asset
export const image = (src: string, alt: string, height: string, width: string) => {
  const attributes = { src, alt, height, width }
  return img(imageStyle, undefined, attributes)
}
