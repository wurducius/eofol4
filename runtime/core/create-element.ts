export const createElement = (
  tag: string,
  style?: string | undefined,
  content?: any,
  attributes?: any,
  properties?: any,
) => {
  const attributesImpl = { ...properties, ...attributes }
  if (style) {
    attributesImpl.class = style
  }
  return {
    type: tag,
    attributes: attributesImpl,
    content: Array.isArray(content) ? content : [content],
  }
}

export const f = (tag: string) => (style?: string | undefined, content?: any, attributes?: any, properties?: any) =>
  createElement(tag, style, content, attributes, properties)
