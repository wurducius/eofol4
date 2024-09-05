import { img } from "../core"
import { defaultFallback } from "./default-fallback"

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
}: {
  src: string
  alt: string
  height: Dimension
  width: Dimension
  fallback?: string
}) => {
  const attributes = {
    src,
    alt,
    height: getDimension(height),
    width: getDimension(width),
    onerror: `this.onerror = null; this.src = '${fallback ?? defaultFallback}';`,
  }
  return img(undefined, "", attributes)
}
