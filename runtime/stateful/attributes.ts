import { Attributes } from "../types"

export const getAttributes = (attributes: Attributes | undefined, id: string, name: string) => ({
  ...attributes,
  id,
  name,
})
