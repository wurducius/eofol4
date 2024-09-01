import { StaticElement } from "../defs"

const traverseDomToJson = (domElement: Node, result) => {
  if (domElement.nodeType === 3) {
    result = domElement.textContent
  } else if (domElement instanceof Element) {
    result = { type: domElement.tagName, attributes: {}, content: [] }
    // @TODO attributes
    if (domElement.childNodes && domElement.childNodes.length > 0) {
      for (let i = 0; i < domElement.childNodes.length; i++) {
        result.content[i] = traverseDomToJson(domElement.childNodes.item(i), result.content[i])
      }
    }
  } else {
    console.log(`UNKNOWN DOM NODE TYPE: ${domElement.nodeType}`)
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
