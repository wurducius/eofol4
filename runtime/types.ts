import type * as CSSType from "csstype"

type CSSObject = CSSType.Properties

// ==================     FUNC     ==================

// eslint-disable-next-line no-unused-vars
export type Handler<T> = (x: any) => void

// ==================     DOM      ==================

export type Classname = string | boolean | undefined | null

// @TODO
export type Attributes = Object

// ==================      CSS     ==================

// @TODD install css object types
export type SxStyleObject = CSSObject

// ==================     HTTP      ==================

export type HttpMethod = "GET" | "POST" | "PUT" | "HEAD" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH"
