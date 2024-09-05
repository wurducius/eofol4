import { a } from "../core"
import { StaticElement } from "../defs"

/*
const linkBaseStyle = sx({})
const linkHoverStyle = sx({}, ":hover")
const linkActiveStyle = sx({}, ":active")
const linkFocusStyle = sx({}, ":focus")
const linkVisitedStyle = sx({}, ":visited")
const linkStyle = cx(linkBaseStyle, linkHoverStyle, linkActiveStyle, linkFocusStyle, linkVisitedStyle)
*/

// @TODO register prefetch asset
export const link = ({
  href,
  content,
  isExternal,
  download,
}: {
  href: string
  content: string | StaticElement
  isExternal?: boolean
  download?: string
}) => {
  const attributes: Record<string, string> = { href }
  if (isExternal) {
    attributes.target = "_blank"
  }
  if (download) {
    attributes.download = download
  }
  return a(undefined, content, attributes)
}
