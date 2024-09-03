import { Attributes, Children, EofolDef, getDef, State, StaticElement } from "../defs"
import { domAppendChildren, domAttributesToJson, domToJson, jsonToDom } from "../dom"
import { generateId } from "../util"
import { getInitialState } from "./state"
import { getInstance, saveStatefulInstance } from "../instances"
import { Compiler } from "../constants"

const createWrapper = (id: string) => {
  const renderedResult = document.createElement(Compiler.COMPILER_STATEFUL_WRAPPER_TAG)
  renderedResult.setAttribute("id", id)
  return renderedResult
}

export const renderElement = (def: EofolDef, state: State, attributes: Attributes, children: Children) =>
  def.render({ state, attributes, children })

export const rerender = (id: string) => {
  const instance = getInstance(id)
  const target = document.getElementById(instance.id)
  if (target) {
    const def = getDef(instance.name)
    if (def) {
      const state = instance.state
      const attributes = domAttributesToJson(target.attributes)
      const children: Children = domToJson(target.childNodes)
      const rendered = renderElement(def, state, attributes, children)
      return jsonToDom(rendered)
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
      const state = getInitialState(def.initialState)
      saveStatefulInstance(id, name, state)
      // @TODO TYPING jsonElement.content
      // @ts-ignore
      const rendered = renderElement(def, state, attributesImpl, jsonElement.content)
      const renderedDom = jsonToDom(rendered)
      const renderedResult = createWrapper(id)
      domAppendChildren(renderedDom, renderedResult)
      return { id, result: renderedResult }
    } else {
      console.log(`EOFOL ERROR: Definitipn with name = ${name} does not exist.`)
    }
  } else {
    console.log("EOFOL ERROR: Custom component has no name.")
  }
}
