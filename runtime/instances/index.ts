import { getInstances } from "../internals"
import { Children, getDef, State, StaticElement } from "../defs"
import { isBrowser } from "../util"

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

const htmlCollectionToArray = (x: NodeList) => {
  const a = []
  for (let i = 0; i < x.length; i++) {
    a.push(x[i])
  }
  return a
}

const domToJson = (domElement) => {
  const result: StaticElement[] = []
  for (let i = 0; i < domElement.length; i++) {
    result[i] = traverseDomToJson(domElement[i], result[i])
  }
  return result
}

const appendChild = (target, child) => {
  if (child) {
    if (typeof child === "string") {
      target.insertAdjacentHTML("beforeend", child)
    } else {
      target.appendChild(child)
    }
  }
}

const traverseJsonToDom = (jsonElement, result) => {
  if (typeof jsonElement === "object") {
    result = document.createElement(jsonElement.type)
    // @TODO attributes
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

const jsonToDom = (jsonElement) => {
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

const domAppendChildren = (children, target) => {
  children.forEach((child) => {
    appendChild(target, child)
  })
}

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

          //   const children = domToJson(target.childNodes)
          const childrenDom = []
          for (let i = 0; i < target.childNodes.length; i++) {
            const item = target.childNodes.item(i)
            if (item) {
              childrenDom.push(item)
            }
          }
          // @TODO Fix children prop later after analysis
          const children: Children = []

          const rendered = def.render(state, attributes, children)

          const domResult = jsonToDom(rendered)

          // @TODO handle children tree
          domClearChildren(target)
          domAppendChildren(domResult, target)
        } else {
          console.log(`EOFOL ERROR: DOM element with id = ${instance.id} does not exist.`)
        }
      } else {
        //@TODO error logging
      }
    })
    // @TODO FIXME SLEEP
    await new Promise((r) => setTimeout(r, 500))
  }
}

// @TODO move to stateful
export const getInitialState = (initialState: State) => (initialState ? { ...initialState } : undefined)

// @TODO move to stateful
export const getState = (id: string) => {
  const instance = getInstances()["index.html"][id]
  return instance?.state
}

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
