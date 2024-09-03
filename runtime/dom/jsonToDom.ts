import { appendChild } from "./children"
import { isEofolTag, onComponentMount, onComponentMounted, onComponentUpdate, onComponentUpdated } from "../stateful"
import { getInstance } from "../instances"

const wireAttributes = (jsonElement, result) => {
  if (jsonElement.attributes) {
    Object.keys(jsonElement.attributes).forEach((attributeName) => {
      result.setAttribute(attributeName, jsonElement.attributes[attributeName])
    })
  }
}

const wireProperties = (jsonElement, result) => {
  if (jsonElement.properties) {
    Object.keys(jsonElement.properties).forEach((propertyName) => {
      result[propertyName] = jsonElement.properties[propertyName]
    })
  }
}

const isAlreadyMounted = (parent, childIndex) =>
  parent &&
  parent.content[childIndex] &&
  parent.content[childIndex].attributes &&
  parent.content[childIndex].attributes.id &&
  getInstance(parent.content[childIndex].attributes.id)

const traverseJsonToDom = (jsonElement, result, parent, childIndex) => {
  if (typeof jsonElement === "object") {
    let isMounted = undefined
    let isUpdated = undefined
    if (isEofolTag(jsonElement.type)) {
      if (isAlreadyMounted(parent, childIndex)) {
        const id = parent.content[childIndex].attributes.id
        const updated = onComponentUpdate(id)
        if (updated) {
          isUpdated = id
          result = updated
        }
      } else {
        const mounted = onComponentMount(jsonElement)
        if (mounted) {
          const { id, result: mountResult } = mounted
          isMounted = id
          result = mountResult
        }
      }
    } else {
      result = document.createElement(jsonElement.type)
      wireAttributes(jsonElement, result)
    }

    wireProperties(jsonElement, result)

    if (jsonElement.content && Array.isArray(jsonElement.content) && jsonElement.content.length > 0) {
      jsonElement.content.forEach((jsonChild, i) => {
        // @TODO FIXME
        let nextResult = undefined
        nextResult = traverseJsonToDom(jsonElement.content[i], nextResult, jsonElement, i)
        appendChild(result, nextResult)
      })
    }
    if (isMounted) {
      onComponentMounted(isMounted)
    }
    if (isUpdated) {
      onComponentUpdated(isUpdated)
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
      result[i] = traverseJsonToDom(jsonElement[i], result[i], undefined, undefined)
    }
  } else {
    result[0] = traverseJsonToDom(jsonElement, result[0], undefined, undefined)
  }
  return result
}
