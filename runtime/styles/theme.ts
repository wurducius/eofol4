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

export type TypographyComponent = { fontFamily?: string; fontWeight?: number; fontSize?: string }
export type TypographyTheme = {
  default: TypographyComponent
  h1?: TypographyComponent
  h2?: TypographyComponent
  h3?: TypographyComponent
  h4?: TypographyComponent
  h5?: TypographyComponent
  h6?: TypographyComponent
  p?: TypographyComponent
  link?: TypographyComponent
  button?: TypographyComponent
}

export type SpacingTheme = {
  xxxs: string
  xxs: string
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  xxl: string
  xxxl: string
}

export type SizeTheme = {}

export type BorderRadiusTheme = { borderRadius: string }

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
