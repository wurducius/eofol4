import { img } from "../core"
import { Classname } from "../types"
import { isBrowser } from "../util"
import { pushAsset } from "../internals"

type Dimension = string | number | undefined

const getDimension = (dimension: Dimension) => (typeof dimension === "number" ? `${dimension}px` : dimension)

export const image = ({
  src,
  alt,
  height,
  width,
  fallback,
  classname,
  isExternal,
}: {
  src: string
  alt: string
  height: Dimension
  width: Dimension
  fallback?: string
  classname?: Classname
  isExternal?: boolean
}) => {
  if (!isExternal && !isBrowser()) {
    pushAsset(src, "images")
  }
  const attributes = {
    src,
    alt,
    height: getDimension(height),
    width: getDimension(width),
    onerror: `this.onerror = null; this.src = '${fallback ?? "./assets/media/images/default-fallback.png"}';`,
  }
  return img(classname, undefined, attributes)
}
