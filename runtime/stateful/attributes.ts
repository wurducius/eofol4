import { Attributes } from "../defs"

export const getAttributes = (attributes: Attributes | undefined, id: string, name: string) => ({
  ...attributes,
  id,
  name,
})
