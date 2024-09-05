import themeDefault from "./theme-default"
import themeSrc from "../../src/theme"
import { mergeDeep } from "../util"

// @TODO typing
export type Theme = any

const themes: Record<string, Theme> = {}

let theme: string | undefined = undefined

export const getTheme = () => {
  return mergeDeep(theme ? themes[theme] : {}, themeDefault)
}

export const setTheme = (themeName: string) => {
  theme = themeName
}

export const addTheme = (themeName: string, themeData: Theme) => {
  themes[themeName] = themeData
}

addTheme("default", themeSrc)
setTheme("default")
