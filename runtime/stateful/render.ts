import { Attributes, Children, EofolDef, getDef, State, StaticElement } from "../defs"
import { domAppendChildren, domAttributesToJson, domToJson, jsonToDom } from "../dom"
import { arrayCombinatorForEach, generateId } from "../util"
import { getInitialState } from "./state"
import { getInstance, saveStatefulInstance } from "../instances"
import { Compiler } from "../constants"
import { onComponentUpdate, onComponentUpdated } from "./lifecycle"
import { updateDom } from "./dom"
import { prune } from "./prune"
import { logDefHasNoName, logDefNotFound, logElementNotFound } from "../logger"

export const filterChildren = (
  content: Array<StaticElement | string | undefined | null | false>,
): Array<StaticElement | string> =>
  content?.filter((x) => typeof x !== "string" || !(x.trim().length === 0)) as Array<StaticElement | string>

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
      logDefNotFound(instance.name)
    }
  } else {
    logElementNotFound(instance.id)
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
      saveStatefulInstance(id, name, attributesImpl, state)
      // @TODO TYPING jsonElement.content
      // @ts-ignore
      const children = filterChildren(jsonElement.content)
      const rendered = renderElement(def, state, attributesImpl, children)
      const renderedDom = jsonToDom(rendered)
      const renderedResult = createWrapper(id)
      domAppendChildren(renderedDom, renderedResult)
      return { id, result: renderedResult }
    } else {
      logDefNotFound(name)
    }
  } else {
    logDefHasNoName()
  }
}

export const updateComponents = (ids: string | string[]) => {
  const updated: { id: string; result: any }[] = []
  arrayCombinatorForEach((id: string) => {
    updated.push({ id, result: onComponentUpdate(id) })
  })(ids)
  updateDom(updated)
  updated.forEach((update) => {
    onComponentUpdated(update.id)
  })
  prune()
}
