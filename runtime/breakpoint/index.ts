import { BREAKPOINT } from "../constants"
import { Render } from "../types"

const Breakpoints = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
  xxl: "xxl",
}

export type Breakpoint =
  | typeof Breakpoints.xs
  | typeof Breakpoints.sm
  | typeof Breakpoints.md
  | typeof Breakpoints.lg
  | typeof Breakpoints.xl
  | typeof Breakpoints.xxl

const mediaQuery = (maxWidth: number | undefined, minWidth: number | undefined) =>
  window.matchMedia(
    `${minWidth !== undefined ? `(min-width: ${minWidth}px)` : ""}${minWidth !== undefined && maxWidth !== undefined ? " and " : ""}${maxWidth !== undefined ? `(max-width: ${maxWidth}px)` : ""}`,
  ).matches

export const getBreakpoint = (): Breakpoint | undefined => {
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

export const getBreakpointView = (views: {
  xs: Render
  sm: Render
  md: Render
  lg: Render
  xl: Render
  xxl: Render
}) => {
  const breakpoint = getBreakpoint()
  if (breakpoint) {
    // @ts-ignore
    return views[breakpoint]()
  }
}
