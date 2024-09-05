import { EofolComponentType } from "../constants"
import { logDefAlreadyExists } from "../logger"
import { ComponentType, DefRegistry, EofolComponentProps } from "../types"
import { cx } from "../util"

const defRegistry: DefRegistry = {}

export const getDefs = () => defRegistry

export const getDefImpl = (defs: DefRegistry) => (name: string) => defs[name]

export const getDef = (name: string) => getDefs()[name]

const getRegistryDef = (componentName: string, componentType: ComponentType, componentProps: EofolComponentProps) => ({
  name: componentName,
  type: componentType,
  render: componentProps.render,
  initialState: componentProps.initialState,
  effect: componentProps.effect,
  classname: cx(componentProps.classname),
  subscribe: componentProps.subscribe,
})

const addDef = (componentName: string, componentType: ComponentType, componentProps: EofolComponentProps) => {
  if (defRegistry[componentName]) {
    logDefAlreadyExists(componentName)
  } else {
    const def = getRegistryDef(componentName, componentType, componentProps)
    defRegistry[componentName] = def
    return def
  }
}

const defineComponentFactory =
  (componentType: ComponentType) => (componentName: string, componentProps: EofolComponentProps) =>
    addDef(componentName, componentType, componentProps)

export const defineStateful = defineComponentFactory(EofolComponentType.Stateful)
export const defineFlat = defineComponentFactory(EofolComponentType.Flat)
export const defineVirtual = defineComponentFactory(EofolComponentType.Virtual)
