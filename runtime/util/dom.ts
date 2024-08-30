import { Attributes } from "../defs"
import { Classname } from "../types"

export const ax = (base: Attributes, conditional: Record<string, any>) =>
  Object.keys(conditional).reduce(
    (acc, next) => (conditional[next] ? { ...acc, [next]: conditional[next] } : acc),
    base,
  )

export const cx = (...classnames: Classname[]) => classnames.filter(Boolean).join(" ")
