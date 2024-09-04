import { a } from "../core"
import { StaticElement } from "../defs"
import { sx } from "../styles"
import { cx } from "../util"

const linkBaseStyle = sx({})
const linkHoverStyle = sx({}, ":hover")
const linkActiveStyle = sx({}, ":active")
const linkFocusStyle = sx({}, ":focus")
const linkVisitedStyle = sx({}, ":visited")
const linkStyle = cx(linkBaseStyle, linkHoverStyle, linkActiveStyle, linkFocusStyle, linkVisitedStyle)

// @TODO register prefetch asset
export const link = (href: string, content: string | StaticElement, isExternal?: boolean, download?: string) => {
  const attributes: Record<string, string> = { href }
  if (isExternal) {
    attributes.target = "_blank"
  }
  if (download) {
    attributes.download = download
  }
  return a(linkStyle, content, attributes)
}
