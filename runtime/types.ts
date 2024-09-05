import type * as CSSType from "csstype"

export type EofolElement = StaticElement | string | undefined | false | null
export type EofolNode = EofolElement | EofolElement[]

type ClassnameSingle = string | boolean | undefined | null
export type Classname = ClassnameSingle | ClassnameSingle[]

export type Attributes = Record<string, string>

type ChildrenSingle = StaticElement | string | undefined | false | null
export type Children = ChildrenSingle | ChildrenSingle[]

// @TODO State typing
export type State = any | undefined

// eslint-disable-next-line no-unused-vars
export type SetState = (nextState: State) => void

export type Props = { state: State; setState: SetState; attributes: Attributes; children?: Children }

// eslint-disable-next-line no-unused-vars
export type EffectSingle = ((props: Props) => (props: Props) => void) | ((props: Props) => void)

// @TODO Effect typing
// export type Effect = Multi<Function>
export type Effect = undefined | EffectSingle | EffectSingle[]

export type StaticElement = { type: string; attributes?: Record<string, string> }
// @TODO typing finish, solve recursion
// eslint-disable-next-line no-unused-vars
export type Render = (props: Props) => StaticElement & {
  content?: Array<string | StaticElement | undefined | null | false> | string | StaticElement | undefined | null | false
}

export type Instance = { id: string; name: string; attributes?: Attributes; state?: any }

// eslint-disable-next-line no-unused-vars
export type ShouldUpdate = (props: { state: State; attributes: Attributes }) => boolean

export type EofolDef = {
  name: string
  type: string
  render: Render
  classname?: Classname
  initialState?: State
  effect?: Effect
  shouldUpdate?: ShouldUpdate
  subscribe?: string | string[]
}

export type EofolComponentProps = {
  render: Render
  initialState?: State
  effect?: Effect
  shouldUpdate?: ShouldUpdate
  classname?: string
  subscribe?: string | string[]
}

export type DefRegistry = Record<string, EofolDef>

type CSSObject = CSSType.Properties

export type VIEWType = { path: string; isStatic?: boolean }
// ==================     FUNC     ==================

// eslint-disable-next-line no-unused-vars
export type Handler<T> = (x: any) => void

// ==================      CSS     ==================

// @TODD install css object types
export type SxStyleObject = CSSObject

// ==================     HTTP      ==================

export type HttpMethod = "GET" | "POST" | "PUT" | "HEAD" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH"

export type SearchParams = Record<string, string>

export const Breakpoints = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
  xxl: "xxl",
}

export type Breakpoint =
  | typeof Breakpoints.xs
  | typeof Breakpoints.sm
  | typeof Breakpoints.md
  | typeof Breakpoints.lg
  | typeof Breakpoints.xl
  | typeof Breakpoints.xxl

export type StoreState = any

export type StoreProjection = { id: string; projection: Function }

export type Store = { id: string; state: StoreState; projections?: StoreProjection[] }
