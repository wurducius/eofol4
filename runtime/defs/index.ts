import { EofolComponentType } from "../constants"
import { logDefAlreadyExists } from "../logger"
import { DefRegistry, EofolComponentProps } from "../types"

const defRegistry: DefRegistry = {}

export const getDefs = () => defRegistry

export const getDefImpl = (defs: DefRegistry) => (name: string) => defs[name]

export const getDef = (name: string) => getDefs()[name]

const getRegistryDef = (componentName: string, componentType: string, componentProps: EofolComponentProps) => ({
  name: componentName,
  type: componentType,
  render: componentProps.render,
  initialState: componentProps.initialState,
  effect: componentProps.effect,
})

const addDef = (componentName: string, componentType: string, componentProps: EofolComponentProps) => {
  if (defRegistry[componentName]) {
    logDefAlreadyExists(componentName)
  } else {
    const def = getRegistryDef(componentName, componentType, componentProps)
    defRegistry[componentName] = def
    return def
  }
}

const defineComponentFactory =
  (componentType: string) => (componentName: string, componentProps: EofolComponentProps) =>
    addDef(componentName, componentType, componentProps)

export const defineStateful = defineComponentFactory(EofolComponentType.Stateful)
export const defineFlat = defineComponentFactory(EofolComponentType.Flat)
export const defineVirtual = defineComponentFactory(EofolComponentType.Stateful)
