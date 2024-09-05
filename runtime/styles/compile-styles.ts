import { sy } from "./sx"
import { Theme } from "./theme"
import { SxStyleObject } from "../types"
import { getEnv } from "../internals"

const syy = (styleName: string, styleObj: SxStyleObject) => sy(styleName, styleObj, undefined, "")

export const compileThemeStyles = (theme: Theme) => {
  const breakpoints = getEnv().config.breakpoints

  syy("body", {
    backgroundColor: "#1a202c",
    fontFamily: "Inter, sans-serif",
    fontSize: "16px",
    fontWeight: 400,
    color: "#edf2f7",
  })

  sy("container", {
    padding: `${theme.spacing.lg}px ${theme.spacing.lg}px`,
  })

  // @TODO include breakpoints into env.config or such at compile time
  breakpoints?.forEach((breakpoint: { name: string; maxWidth: number | undefined }) => {
    if (breakpoint.maxWidth) {
      sy(`container-${breakpoint.name}`, {
        maxWidth: `${breakpoint.maxWidth}px`,
      })
    }
  })

  syy("a", {
    fontWeight: 700,
    color: "#30cccc",
  })
  syy("a:visited", {
    color: "#299393",
  })
  syy("a:hover", {
    color: "#87e6e6",
  })
  syy("a:active", {
    color: "#87e6e6",
  })

  syy("button", {
    backgroundColor: "darkmagenta",
    border: "1px solid purple",
    color: "white",
    fontFamily: "inherit",
    fontSize: "16px",
    fontWeight: 500,
    cursor: "pointer",
    padding: "4px 16px",
  })
  syy("button:hover", {
    backgroundColor: "purple",
    color: "red",
  })
  syy("button:focus", {
    backgroundColor: "purple",
    color: "red",
  })
  syy("button:active", {
    backgroundColor: "purple",
    color: "red",
  })
}
