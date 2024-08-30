import { getInstances } from "../internals"
import { getDef, State } from "../defs"
import { generateId, isBrowser } from "../util"

type Instance = { id: string; name: string; state?: any }

const updateInstance = (id: string, nextInstance: Instance | undefined) => {
  const instances = getInstances()["index.html"]
  instances[id] = nextInstance
}

export const saveInstance = (id: string, nextInstance: Instance) => {
  updateInstance(id, nextInstance)
}

export const removeInstance = (id: string) => {
  updateInstance(id, undefined)
}

const traverseDomToJson = (domElement, result) => {
  if (domElement.nodeName === "#text") {
    result = domElement.textContent
  } else {
    result = { type: domElement.tagName, attributes: {}, content: [] }
    // @TODO attributes
    if (domElement.children && domElement.children.length > 0) {
      for (let i = 0; i < domElement.children.length; i++) {
        result.content[i] = traverseDomToJson(domElement.children.item(i), result.content[i])
      }
    }
  }
  return result
}

const domToJson = (domElement) => {
  let result = undefined
  return traverseDomToJson(domElement, result)
}

const traverseJsonToDom = (jsonElement, result) => {
  if (typeof jsonElement === "object") {
    result = document.createElement(jsonElement.type)
    // @TODO attributes
    if (jsonElement.content && Array.isArray(jsonElement.content) && jsonElement.content.length > 0) {
      jsonElement.content.forEach((jsonChild, i) => {
        result[i] = traverseJsonToDom(jsonElement.content[i], result[i])
      })
    }
  } else {
    result = jsonElement
  }
  return result
}

const jsonToDom = (jsonElement) => {
  let result = undefined
  return traverseJsonToDom(jsonElement, result)
}

const domAttributesToJson = (domAttributes) => {
  const attributes = {}
  for (let i = 0; i < domAttributes.length; i++) {
    const att = domAttributes.item(i)
    if (att && att.value) {
      attributes[att.name] = att.value
    }
  }
  return attributes
}

const setAttributes = (domElement, attributes) => {
  Object.keys(attributes)
    .filter((attributeName) => !["id", "name"].includes(attributeName))
    .forEach((attributeName) => {
      domElement.setAttribute(attributeName, attributes[attributeName])
    })
}

const domClearChildren = (domElement) => {
  const childrenToDelete = []
  for (let i = 0; i < domElement.children.length; i++) {
    childrenToDelete.push(domElement.children.item(i))
  }
  childrenToDelete.forEach((childToDelete) => {
    if (childToDelete) {
      domElement.removeChild(childToDelete)
    }
  })
}

const renderElement = () => {}

// @TODO move to stateful
export const forceRerender = async () => {
  if (isBrowser()) {
    const instances = getInstances()["index.html"]
    Object.keys(instances).forEach((id) => {
      const instance = instances[id]
      const target = document.getElementById(instance.id)
      if (target) {
        const def = getDef(instance.name)
        if (def) {
          const state = instance.state
          const attributes = domAttributesToJson(target.attributes)
          const children = domToJson(target.children)
          const rendered = def.render(state, attributes, children)

          const domResult = jsonToDom(rendered)
          console.log(domResult)

          setAttributes(domResult, attributes)

          const result = [domResult]

          domClearChildren(target)

          if (rendered.content) {
            rendered.content.forEach((renderedChild) => {
              let resultChild
              if (typeof renderedChild === "object") {
                if (renderedChild.type === "e") {
                  const childName = renderedChild.attributes["name"]
                  const childDef = getDef(childName)
                  const childId = renderedChild.attributes["id"]
                  const childAttributes = {} // renderedChild.attributes
                  const childChildren = []
                  if (childId) {
                    const childInstance = getInstances()["index.html"][childId]
                    const childState = childInstance.state
                    resultChild = childDef.render(childState, childAttributes, childChildren)
                  } else {
                    const mountedId = generateId()
                    // @ts-ignore
                    const childState = childDef.initialState
                    getInstances()["index.html"][mountedId] = { id: mountedId, name: childName, state: childState }
                    const childRendered = childDef.render(childState, childAttributes, childChildren)
                    resultChild = document.createElement(childRendered.type)
                  }
                } else {
                  resultChild = document.createElement(renderedChild.type)
                }
              } else {
                resultChild = document.createTextNode(renderedChild)
              }
              result[0].appendChild(resultChild)
            })
          }
          // @TODO handle children tree
          // @TODO render into div wrapper
          result.forEach((item) => {
            target.appendChild(item)
          })
        } else {
          console.log(`EOFOL ERROR: DOM element with id = ${instance.id} does not exist.`)
        }
      } else {
        //@TODO error logging
      }
    })
  }
}

// @TODO move to stateful
export const getInitialState = (initialState: State) => (initialState ? { ...initialState } : undefined)

// @TODO move to stateful
export const getSetState = (id: string) => (nextState: State) => {
  // @TODO merge
  //const instance = getInstance(id)
  const instance = getInstances()["index.html"][id]
  saveInstance(id, { ...instance, state: nextState })
  forceRerender()
}

export const getInstance = (id: string) => {
  const instance = getInstances()["index.html"][id]
  if (instance) {
    return instance
  } else {
    console.log(`EOFOL ERROR: Instance with id = ${id} does not exist.`)
  }
}
