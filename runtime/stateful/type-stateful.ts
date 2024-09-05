import { DefGeneral, DefStateful } from "../types"

export const typeStateful = (def: DefGeneral) => {
  return def as DefStateful
}
