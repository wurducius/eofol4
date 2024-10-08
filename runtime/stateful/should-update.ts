import { getInstance } from "../instances"
import { getDef } from "../defs"
import { typeStateful } from "./type-stateful"

export const shouldUpdate = (id: string) => {
  const instance = getInstance(id)
  const def = typeStateful(getDef(instance.name))
  // @TODO error null checking logging
  // @TODO ADD ATTRIBUTES TO INSTANCE DATA
  return !def.shouldUpdate || def.shouldUpdate({ state: instance.state, attributes: instance.attributes })
}
