import { Attributes, Children, DefRegistry, EofolDef, getDef, getDefImpl, getDefs, State, StaticElement } from "../defs"
import { domAppendChildren, domAttributesToJson, domToJson, jsonToDom } from "../dom"
import { arrayCombinatorForEach, generateId } from "../util"
import { getInitialState } from "./state"
import { getInstance, Instance, saveStatefulInstanceImpl } from "../instances"
import { Compiler } from "../constants"
import { onComponentUpdate, onComponentUpdated } from "./lifecycle"
import { updateDom } from "./dom"
import { prune } from "./prune"
import { logDefNotFound, logElementNotFound, logDefHasNoName } from "../logger"
import { getAttributes } from "./attributes"
import { getInstances } from "../internals"

export const filterChildren = (
  content: undefined | Array<StaticElement | string | undefined | null | false>,
): Array<StaticElement | string> => {
  if (!content) {
    return []
  } else {
    return Array.isArray(content)
      ? (content.filter((x) => typeof x !== "string" || !(x.trim().length === 0)) as Array<StaticElement | string>)
      : []
  }
}

const createWrapper = (id: string) => {
  const renderedResult = document.createElement(Compiler.COMPILER_STATEFUL_WRAPPER_TAG)
  renderedResult.setAttribute("id", id)
  return renderedResult
}

export const renderElement = (def: EofolDef, state: State, attributes: Attributes, children: Children) =>
  def.render({ state, attributes, children })

export const mountImpl = (
  node: StaticElement & { content?: Array<StaticElement | string> },
  instances: Record<string, Instance>,
  defs: DefRegistry,
) => {
  const name = node.attributes?.name
  if (!name) {
    logDefHasNoName()
    return
  }
  const def = getDefImpl(defs)(name)
  if (!def) {
    logDefNotFound(name)
    return
  }
  const id = generateId()
  const attributes = getAttributes(node.attributes, id, name)
  const state = getInitialState(def.initialState)
  saveStatefulInstanceImpl(instances)(id, name, attributes, state)
  const children = filterChildren(node.content)
  return { result: renderElement(def, state, attributes, children), attributes }
}

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
  const mounted = mountImpl(jsonElement, getInstances(), getDefs())
  if (mounted) {
    const { result, attributes } = mounted
    const { id } = attributes
    const renderedDom = jsonToDom(result)
    const renderedResult = createWrapper(id)
    domAppendChildren(renderedDom, renderedResult)
    return { id, result: renderedResult }
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
