import { createElement } from "./create-element"

// @TODO extract
const COMPILER_EOFOL_TAG_DEFAULT = "e"

export const createEofolElement = (
  name: string,
  style?: string | undefined,
  content?: any,
  attributes?: any,
  properties?: any,
) => createElement(COMPILER_EOFOL_TAG_DEFAULT, style, content, { ...attributes, name }, properties)
