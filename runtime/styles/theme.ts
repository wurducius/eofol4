import themeDefault from "./theme-default"
import themeSrc from "../../src/theme"

export const getTheme = () => {
  return { ...themeDefault, ...themeSrc }
}
