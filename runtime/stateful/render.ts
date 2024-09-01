import { Children, getDef, StaticElement } from "../defs"
import { domAppendChildren, domAttributesToJson, domClearChildren, domToJson, jsonToDom } from "../dom"
import { getInstances } from "../internals"
import { generateId } from "../util"
import { getInitialState } from "./state"
import { saveInstance } from "../instances"

export const rerender = (id: string) => {
  const instances = getInstances()
  const instance = instances[id]
  const target = document.getElementById(instance.id)
  if (target) {
    const def = getDef(instance.name)
    if (def) {
      const state = instance.state
      const attributes = domAttributesToJson(target.attributes)

      const childrenDom = []
      for (let i = 0; i < target.childNodes.length; i++) {
        const item = target.childNodes.item(i)
        if (item) {
          childrenDom.push(item)
        }
      }
      const children: Children = domToJson(target.childNodes)
      const rendered = def.render({ state, attributes, children })
      const domResult = jsonToDom(rendered)

      domClearChildren(target)
      domAppendChildren(domResult, target)
    } else {
      console.log(`EOFOL ERROR: Definitipn with name = ${instance.name} does not exist.`)
    }
  } else {
    console.log(`EOFOL ERROR: DOM element with id = ${instance.id} does not exist.`)
  }
}

export const mount = (jsonElement: StaticElement) => {
  const attributes = jsonElement.attributes
  const name = attributes ? attributes["name"] : undefined
  if (name) {
    const def = getDef(name)
    if (def) {
      const id = generateId()
      const attributesImpl = { ...attributes, id, name }
      const rendered = def.render({ state: {}, attributes: attributesImpl ?? {}, children: [] })
      const renderedDom = jsonToDom(rendered)
      const renderedResult = document.createElement("div")
      renderedResult.setAttribute("id", id)
      for (let i = 0; i < renderedDom.length; i++) {
        renderedResult.appendChild(renderedDom[i])
      }
      // @ts-ignore
      const state = getInitialState(def.initialState)
      const instance = { id, name }
      if (state) {
        // @ts-ignore
        instance.state = state
      }
      saveInstance(id, instance)
      return { id, result: renderedResult }
    } else {
      console.log(`EOFOL ERROR: Definitipn with name = ${name} does not exist.`)
    }
  } else {
    console.log("EOFOL ERROR: Custom component has no name.")
  }
}
