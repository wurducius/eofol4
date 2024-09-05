import { getDef, getDefImpl, getDefs } from "../defs"
import { domAttributesToJson, jsonToDom, domAppendChildren } from "../dom"
import { arrayCombinatorForEach, generateId } from "../util"
import { getInitialState, getSetState } from "./state"
import { getInstance, saveStatefulInstanceImpl } from "../instances"
import { Compiler } from "../constants"
import {
  getDerivedStateFromProps,
  onBeforeUpdate,
  onComponentUpdate,
  onComponentUpdated,
  onConstruct,
} from "./lifecycle"
import { updateDom } from "./dom"
import { prune } from "./prune"
import { logDefNotFound, logElementNotFound, logDefHasNoName } from "../logger"
import { getAttributes } from "./attributes"
import { getInstances } from "../internals"
import { Attributes, Children, DefRegistry, DefStateful, State, StaticElement, Instance, SetState } from "../types"
import { typeStateful } from "./type-stateful"

export const renderWrapperStatic = (
  content: StaticElement | string | Array<StaticElement | string>,
  attributes: Attributes,
) => ({
  type: Compiler.COMPILER_STATEFUL_WRAPPER_TAG,
  attributes,
  content: Array.isArray(content) ? content : [content],
})

const renderWrapperDynamic = (id: string) => {
  const renderedResult = document.createElement(Compiler.COMPILER_STATEFUL_WRAPPER_TAG)
  renderedResult.setAttribute("id", id)
  return renderedResult
}

export const filterChildren = (
  content: undefined | string | StaticElement | Array<StaticElement | string | undefined | null | false>,
): Array<StaticElement | string> => {
  if (!content) {
    return []
  } else {
    return Array.isArray(content)
      ? (content.filter((x) => typeof x !== "string" || !(x.trim().length === 0)) as Array<StaticElement | string>)
      : []
  }
}

export const renderElement = (
  def: DefStateful,
  state: State,
  setState: SetState,
  attributes: Attributes,
  children: Children,
) => {
  if (def.render) {
    return def.render({ state, setState, attributes, children })
  }
}

export const mountImpl = (node: StaticElement, instances: Record<string, Instance>, defs: DefRegistry) => {
  const name = node.attributes?.name
  if (!name) {
    logDefHasNoName()
    return
  }
  const def = typeStateful(getDefImpl(defs)(name))
  if (!def) {
    logDefNotFound(name)
    return
  }
  const id = generateId()
  const attributes = getAttributes(node.attributes, id, name)
  if (def.classname) {
    // @ts-ignore
    attributes.class = def.classname
  }
  const children = filterChildren(node.content)
  // @TODO handle constructor
  const state = getInitialState(def.initialState)
  const setState = getSetState(id)
  onConstruct(def, { attributes, state, setState })
  const derivedState = getDerivedStateFromProps(def, { attributes, state, setState })
  saveStatefulInstanceImpl(instances)(id, name, attributes, derivedState)
  return {
    wrap: true,
    result: renderElement(def, derivedState, setState, attributes, children),
    attributes,
  }
}

export const mount = (jsonElement: StaticElement) => {
  const mounted = mountImpl(jsonElement, getInstances(), getDefs())
  if (mounted) {
    const { result, attributes, wrap } = mounted
    const { id } = attributes
    const renderedDom = jsonToDom(result).filter(Boolean)
    let renderedResult
    if (wrap) {
      renderedResult = renderWrapperDynamic(id)
      domAppendChildren(renderedDom, renderedResult)
    } else {
      renderedResult = renderedDom
    }
    return { id, result: renderedResult }
  }
}

export const rerender = (id: string) => {
  const instance = getInstance(id)
  const def = typeStateful(getDef(instance.name))
  if (def) {
    const target = document.getElementById(instance.id)
    if (target) {
      const attributes = domAttributesToJson(target.attributes)
      if (def.classname) {
        // @ts-ignore
        attributes.class = def.classname
      }
      const state = instance.state
      const setState = getSetState(id)
      const derivedState = getDerivedStateFromProps(def, { attributes, state, setState })
      const rendered = renderElement(def, derivedState, setState, attributes, undefined)
      return jsonToDom(rendered)
    } else {
      logElementNotFound(instance.id)
    }
  } else {
    logDefNotFound(instance.name)
  }
}

export const updateComponents = (ids: string | string[]) => {
  const updated: { id: string; result: any }[] = []
  arrayCombinatorForEach((id: string) => {
    onBeforeUpdate(id)
    updated.push({ id, result: onComponentUpdate(id) })
  })(ids)
  updateDom(updated)
  updated.forEach((update) => {
    onComponentUpdated(update.id)
  })
  prune()
}
