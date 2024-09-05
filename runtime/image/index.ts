import { img } from "../core"
import { defaultFallback } from "./default-fallback"
import { cx } from "../util"
import { Classname } from "../types"

type Dimension = string | number | undefined

const getDimension = (dimension: Dimension) => (typeof dimension === "number" ? `${dimension}px` : dimension)

// @TODO register prefetch asset
// @TODO add onerror, placeholder image, onclick fullscreen, loading
// @TODO load onerror defaultFallback from assets/media/images/...
export const image = ({
  src,
  alt,
  height,
  width,
  fallback,
  classname,
}: {
  src: string
  alt: string
  height: Dimension
  width: Dimension
  fallback?: string
  classname?: Classname
}) => {
  const attributes = {
    src,
    alt,
    height: getDimension(height),
    width: getDimension(width),
    onerror: `this.onerror = null; this.src = '${fallback ?? defaultFallback}';`,
  }
  return img(cx(classname), "", attributes)
}
