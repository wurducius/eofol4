import { appendChild } from "./children"

const traverseJsonToDom = (jsonElement, result) => {
  if (typeof jsonElement === "object") {
    result = document.createElement(jsonElement.type)
    if (jsonElement.attributes) {
      Object.keys(jsonElement.attributes).forEach((attributeName) => {
        result.setAttribute(attributeName, jsonElement.attributes[attributeName])
      })
    }
    if (jsonElement.content && Array.isArray(jsonElement.content) && jsonElement.content.length > 0) {
      jsonElement.content.forEach((jsonChild, i) => {
        // @TODO FIXME
        let nextResult = undefined
        nextResult = traverseJsonToDom(jsonElement.content[i], nextResult)
        appendChild(result, nextResult)
      })
    }
  } else {
    result = jsonElement
  }
  return result
}

export const jsonToDom = (jsonElement) => {
  const result = []
  if (Array.isArray(jsonElement)) {
    for (let i = 0; i < jsonElement.length; i++) {
      result[i] = traverseJsonToDom(jsonElement[i], result[i])
    }
  } else {
    result[0] = traverseJsonToDom(jsonElement, result[0])
  }
  return result
}
