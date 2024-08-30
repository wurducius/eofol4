import { getInstances } from "../internals"
import { getDef, State } from "../defs"
import { isBrowser } from "../util"
import { JSONToHTML } from "html-to-json-parser"

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
          const attributes = {}
          for (let i = 0; i < target.attributes.length; i++) {
            const att = target.attributes.item(i)
            if (att && att.value) {
              attributes[att.name] = att.value
            }
          }
          const children = target.children
          const rendered = def.render(state, attributes, [])

          const result = document.createElement("div")

          Object.keys(attributes).forEach((attributeName) => {
            result.setAttribute(attributeName, attributes[attributeName])
          })

          const childrenToDelete = []
          for (let i = 0; i < target.children.length; i++) {
            childrenToDelete.push(target.children.item(i))
          }
          childrenToDelete.forEach((childToDelete) => {
            if (childToDelete) {
              target.removeChild(childToDelete)
            }
          })

          if (rendered.content) {
            rendered.content.forEach((renderedChild) => {
              let resultChild
              if (typeof renderedChild === "object") {
                resultChild = document.createElement(renderedChild.type)
              } else {
                resultChild = document.createTextNode(renderedChild)
              }
              result.appendChild(resultChild)
            })
          }
          // @TODO handle children tree
          // @TODO render into div wrapper
          target.appendChild(result)
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
