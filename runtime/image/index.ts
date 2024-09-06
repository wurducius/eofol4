import { img } from "../core"
import { Classname } from "../types"
import { isBrowser } from "../util"
import { getEnv, pushAsset } from "../internals"

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
  const { BASE_URL } = getEnv()
  let srcImpl
  if (!isExternal && !isBrowser()) {
    srcImpl = `${BASE_URL}assets/media/${src.endsWith(".svg") ? "icons" : "images"}/${src}`
    pushAsset(srcImpl, "images")
  } else {
    srcImpl = `${BASE_URL}assets/media/${src.endsWith(".svg") ? "icons" : "images"}/${src}`
  }
  const attributes = {
    src: srcImpl,
    alt,
    height: getDimension(height),
    width: getDimension(width),
    onerror: `this.onerror = null; this.src = '${fallback ? `${BASE_URL}${fallback}` : `${BASE_URL}assets/media/images/default-fallback.png`}';`,
  }
  return img(classname, undefined, attributes)
}
