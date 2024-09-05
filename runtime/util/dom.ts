import { Attributes, Classname } from "../types"

export const ax = (base: Attributes, conditional: Record<string, any>) =>
  Object.keys(conditional).reduce(
    (acc, next) => (conditional[next] ? { ...acc, [next]: conditional[next] } : acc),
    base,
  )

export const cx = (...classnames: Classname[]) => {
  if (classnames && classnames[0] && Array.isArray(classnames[0])) {
    return classnames[0].filter(Boolean).join(" ")
  } else {
    return classnames.filter(Boolean).join(" ")
  }
}
