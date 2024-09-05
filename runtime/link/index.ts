import { a } from "../core"
import { Classname, StaticElement } from "../types"
import { cx, isBrowser } from "../util"
import { pushAsset } from "../internals"

export const link = ({
  href,
  content,
  isExternal,
  download,
  classname,
}: {
  href: string
  content: string | StaticElement
  isExternal?: boolean
  download?: string
  classname?: Classname
}) => {
  if (!isExternal && !isBrowser()) {
    pushAsset(href, "pages")
  }
  const attributes: Record<string, string> = { href }
  if (isExternal) {
    attributes.target = "_blank"
  }
  if (download) {
    attributes.download = download
  }
  return a(cx(classname), content, attributes)
}
