import { StaticElement } from "../defs"
import { logUnknownDomElement } from "../logger"

const traverseDomToJson = (domElement: Node, result) => {
  if (domElement.nodeType === 3) {
    result = domElement.textContent
  } else if (domElement instanceof Element) {
    const attributes: Record<string, string> = {}
    for (let i = 0; i < domElement.attributes.length; i++) {
      const domAttribute = domElement.attributes.item(i)
      if (domAttribute) {
        attributes[domAttribute.name] = domAttribute.value
      }
    }
    result = { type: domElement.tagName, attributes, content: [] }
    // @TODO attributes
    if (domElement.childNodes && domElement.childNodes.length > 0) {
      for (let i = 0; i < domElement.childNodes.length; i++) {
        result.content[i] = traverseDomToJson(domElement.childNodes.item(i), result.content[i])
      }
    }
  } else {
    logUnknownDomElement(domElement.nodeType.toString())
  }
  return result
}

export const domToJson = (domElement) => {
  const result: StaticElement[] = []
  for (let i = 0; i < domElement.length; i++) {
    result[i] = traverseDomToJson(domElement[i], result[i])
  }
  return result
}
