import themeDefault from "./theme-default"
import themeSrc from "../../src/theme"
import { isBrowser, mergeDeep } from "../util"
import { compileThemeStyles } from "./compile-styles"

export type ColorComponent = { base: string; dark: string; light: string }

export type ColorTheme = {
  primary: ColorComponent
  secondary: ColorComponent
  bg: ColorComponent
  link: ColorComponent
  form: { base: string }
  typography: string
}

// @TODO finish typing
export type TypographyTheme = {}
export type SpacingTheme = {}
export type SizeTheme = {}
export type BorderRadiusTheme = {}
export type ZIndexTheme = {}
export type ConfigTheme = {}
export type Theme = {
  color: ColorTheme
  typography: TypographyTheme
  spacing: SpacingTheme
  size: SizeTheme
  borderRadius: BorderRadiusTheme
  zIndex: ZIndexTheme
  config: ConfigTheme
}

const themes: Record<string, Theme> = {}

let theme: string | undefined = undefined

export const getTheme = () => {
  return theme ? themes[theme] : themeDefault
}

export const setTheme = (themeName: string) => {
  theme = themeName
  compileThemeStyles(themes[themeName])
}

export const addTheme = (themeName: string, themeData: any) => {
  themes[themeName] = mergeDeep(themeData, themeDefault)
}

export const initTheme = () => {
  addTheme("default", themeSrc)
  theme = "default"
  if (!isBrowser()) {
    compileThemeStyles(themes["default"])
  }
}

initTheme()
