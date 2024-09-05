import { a } from "../core"
import { Classname, StaticElement } from "../types"
import { cx } from "../util"

// @TODO register prefetch asset
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
  const attributes: Record<string, string> = { href }
  if (isExternal) {
    attributes.target = "_blank"
  }
  if (download) {
    attributes.download = download
  }
  return a(cx(classname), content, attributes)
}
