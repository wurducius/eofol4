import type * as CSSType from "csstype"

export type EofolElement = StaticElement | string | undefined | false | null
export type EofolNode = EofolElement | EofolElement[]

export type Attributes = Record<string, string>

// @TODO Children typing
export type Children =
  | Array<StaticElement | string | undefined | false | null>
  | StaticElement
  | string
  | undefined
  | false
  | null

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
export type Render = (props: { state: State; attributes: Attributes; children: Children }) => StaticElement & {
  content?: Array<string | StaticElement | undefined | null | false> | string | StaticElement | undefined | null | false
}

export type Instance = { id: string; name: string; attributes?: Attributes; state?: any }

// eslint-disable-next-line no-unused-vars
export type ShouldUpdate = (props: { state: State; attributes: Attributes }) => boolean

export type EofolDef = {
  name: string
  type: string
  render: Render
  initialState?: State
  effect?: Effect
  shouldUpdate?: ShouldUpdate
}
export type EofolComponentProps = { render: Render; initialState?: State; effect?: Effect; shouldUpdate?: ShouldUpdate }

export type DefRegistry = Record<string, EofolDef>

type CSSObject = CSSType.Properties

// ==================     FUNC     ==================

// eslint-disable-next-line no-unused-vars
export type Handler<T> = (x: any) => void

// ==================     DOM      ==================

export type Classname = string | boolean | undefined | null | Array<string | boolean | undefined | null>

// @TODO
// export type Attributes = Object

// ==================      CSS     ==================

// @TODD install css object types
export type SxStyleObject = CSSObject

// ==================     HTTP      ==================

export type HttpMethod = "GET" | "POST" | "PUT" | "HEAD" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH"

export type SearchParams = Record<string, string>
