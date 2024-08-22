import { BREAKPOINT } from "../constants"

const mediaQuery = (maxWidth: number | undefined, minWidth: number | undefined) => {
  console.log(
    `${minWidth !== undefined ? `(min-width: ${minWidth}px)` : ""}${minWidth !== undefined && maxWidth !== undefined ? " and " : ""}${maxWidth !== undefined ? `(max-width: ${maxWidth}px)` : ""}`,
  )
  return window.matchMedia(
    `${minWidth !== undefined ? `(min-width: ${minWidth}px)` : ""}${minWidth !== undefined && maxWidth !== undefined ? " and " : ""}${maxWidth !== undefined ? `(max-width: ${maxWidth}px)` : ""}`,
  ).matches
}

export const getBreakpoint = () => {
  if (typeof window !== "undefined") {
    let breakpoint
    if (mediaQuery(BREAKPOINT.sm - 1, undefined)) {
      breakpoint = "xs"
    } else if (mediaQuery(BREAKPOINT.md - 1, BREAKPOINT.sm)) {
      breakpoint = "sm"
    } else if (mediaQuery(BREAKPOINT.lg - 1, BREAKPOINT.md)) {
      breakpoint = "md"
    } else if (mediaQuery(BREAKPOINT.xl - 1, BREAKPOINT.lg)) {
      breakpoint = "lg"
    } else {
      breakpoint = "xl"
    }
    return breakpoint
  }
}
