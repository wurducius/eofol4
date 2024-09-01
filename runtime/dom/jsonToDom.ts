import { appendChild } from "./children"
import { onComponentMount, onComponentMounted } from "../stateful"

const traverseJsonToDom = (jsonElement, result) => {
  if (typeof jsonElement === "object") {
    let isMounted = undefined
    // @TODO Extract
    if (["e", "eofol"].includes(jsonElement.type)) {
      const mounted = onComponentMount(jsonElement)
      if (mounted) {
        const { id, result: mountResult } = mounted
        isMounted = id
        result = mountResult
      }
    } else {
      result = document.createElement(jsonElement.type)
      if (jsonElement.attributes) {
        Object.keys(jsonElement.attributes).forEach((attributeName) => {
          result.setAttribute(attributeName, jsonElement.attributes[attributeName])
        })
      }
    }
    if (jsonElement.content && Array.isArray(jsonElement.content) && jsonElement.content.length > 0) {
      jsonElement.content.forEach((jsonChild, i) => {
        // @TODO FIXME
        let nextResult = undefined
        nextResult = traverseJsonToDom(jsonElement.content[i], nextResult)
        appendChild(result, nextResult)
      })
    }
    if (isMounted) {
      onComponentMounted(isMounted)
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
