import { SxStyleObject } from "../types"
import { camelCaseToKebabCase, getHash, isBrowser } from "../util"
import { SX } from "../constants"

let compileCache = ""

export const getCompileCache = () => compileCache

export const clearCompileCache = () => {
  compileCache = ""
}

const cache: string[] = []

const injectStyle = (hash: string, styleContent: string, prefix?: string, skipCompileCache?: boolean) => {
  const style = (prefix || ".") + hash + styleContent
  if (isBrowser()) {
    document.styleSheets.item(0)?.insertRule(style)
  } else if (!skipCompileCache) {
    compileCache = compileCache + style
  }
  cache.push(hash)
}

const getStyleContent = (styleObj: SxStyleObject, selector?: string) =>
  // @ts-ignore
  `${selector || ""} { ${Object.keys(styleObj).reduce((acc, next) => `${acc} ${camelCaseToKebabCase(next)}: ${styleObj[next]};`, "")} } `

export const sx = (styleObj: SxStyleObject, selector?: string, prefix?: string, skipCompileCache?: boolean) => {
  const styleContent = getStyleContent(styleObj, selector)
  const hash = `${SX.STYLE_CLASSNAME_PREFIX}${getHash(styleContent).toString()}`
  if (!cache.includes(hash)) {
    injectStyle(hash, styleContent, prefix, skipCompileCache)
  }
  return hash
}

export const sy = (
  classname: string,
  styleObj: SxStyleObject,
  selector?: string,
  prefix?: string,
  skipCompileCache?: boolean,
) => {
  if (!cache.includes(classname)) {
    injectStyle(classname, getStyleContent(styleObj, selector), prefix, skipCompileCache)
  }
  return classname
}
