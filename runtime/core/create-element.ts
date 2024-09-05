import { Classname, EofolNode } from "../types"
import { cx } from "../util"

export const createElement = (
  tag: string,
  style?: Classname,
  content?: EofolNode,
  attributes?: any,
  properties?: any,
) => {
  const attributesImpl = { ...properties, ...attributes }
  if (style) {
    attributesImpl.class = cx(style)
  }
  return {
    type: tag,
    attributes: attributesImpl,
    content: (Array.isArray(content) ? content : [content]).filter(Boolean),
    properties,
  }
}

export const f = (tag: string) => (style?: Classname, content?: any, attributes?: any, properties?: any) =>
  createElement(tag, style, content, attributes, properties)
