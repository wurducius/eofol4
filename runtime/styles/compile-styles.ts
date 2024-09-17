import { getCompileCache, sy, syy } from "./sx"
import { Theme } from "./theme"
import { getEnv } from "../internals"

export const compileThemeStyles = (theme: Theme) => {
  syy("body", {
    backgroundColor: "#1a202c",
    fontFamily: "Inter, sans-serif",
    fontSize: "16px",
    fontWeight: 400,
    color: "#edf2f7",
  })

  sy("container", {
    margin: "0 auto 0 auto",
    textAlign: "center",
    padding: `${theme.spacing.lg}px ${theme.spacing.lg}px`,
  })

  const breakpoints = getEnv().config.breakpoints
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
    border: "1px solid black",
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

  console.log(getCompileCache())
}
