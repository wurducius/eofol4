import { EofolComponentType } from "../constants"

type Multi<T> = T | T[] | undefined

export type EofolNode = Multi<undefined | string>

export type Attributes = Record<string, string>
export type Children = undefined | string[]

export type StaticElement = { type: string; attributes?: Record<string, string> }
// @TODO typing finish, solve recursion
export type Render = (
  // eslint-disable-next-line no-unused-vars
  attributes: Attributes,
  // eslint-disable-next-line no-unused-vars
  children: Children,
) => StaticElement & { content?: Array<string | StaticElement> }

export type EofolDef = { name: string; type: string; render: Render }
export type EofolComponentProps = { render: Render }

const defRegistry: Record<string, EofolDef> = {}

const addDef = (componentName: string, componentType: string, componentProps: EofolComponentProps) => {
  if (defRegistry[componentName]) {
    console.log(
      `EOFOL ERROR: Cannot define component with name = ${componentName} because a component with that name is already defined.`,
    )
  } else {
    defRegistry[componentName] = { name: componentName, type: componentType, render: componentProps.render }
  }
}

const defineComponentFactory =
  (componentType: string) => (componentName: string, componentProps: EofolComponentProps) => {
    addDef(componentName, componentType, componentProps)
    return { ...componentProps, name: componentName, type: componentType }
  }

export const defineStateful = defineComponentFactory(EofolComponentType.Stateful)
export const defineFlat = defineComponentFactory(EofolComponentType.Flat)
export const defineVirtual = defineComponentFactory(EofolComponentType.Stateful)
