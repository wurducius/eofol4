import { EofolComponentType } from "../constants"

type Multi<T> = T | T[] | undefined

// @TODO EofolNode typing
export type EofolNode = Multi<undefined | string>

export type Attributes = Record<string, string>

// @TODO Children typing
export type Children = StaticElement[]

// @TODO State typing
export type State = Object | undefined
// @TODO SetState typing
export type SetState = Function

// @TODO Effect typing
// export type Effect = Multi<Function>
export type Effect = undefined | Function

export type StaticElement = { type: string; attributes?: Record<string, string> }
// @TODO typing finish, solve recursion
// eslint-disable-next-line no-unused-vars
export type Render = (props: {
  state: State
  attributes: Attributes
  children: Children
}) => StaticElement & { content?: Array<string | StaticElement> }

export type EofolDef = { name: string; type: string; render: Render; initialState?: State; effect?: Effect }
export type EofolComponentProps = { render: Render; initialState?: State; effect?: Effect }

const defRegistry: Record<string, EofolDef> = {}

export const getDefs = () => defRegistry

export const getDef = (name: string) => defRegistry[name]

const getRegistryDef = (componentName: string, componentType: string, componentProps: EofolComponentProps) => ({
  name: componentName,
  type: componentType,
  render: componentProps.render,
  initialState: componentProps.initialState,
  effect: componentProps.effect,
})

const addDef = (componentName: string, componentType: string, componentProps: EofolComponentProps) => {
  if (defRegistry[componentName]) {
    console.log(
      `EOFOL ERROR: Cannot define component with name = ${componentName} because a component with that name is already defined.`,
    )
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
