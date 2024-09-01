import { getInstances } from "../internals"
import { Effect, EofolDef, getDefs, SetState, State } from "../defs"
import { getSetState, getState } from "./state"
import { isBrowser } from "../util"

const playEffectImpl = (effect: Effect, state: State, setState: SetState) => {
  // @ts-ignore
  effect(state, setState)
}

export const playEffect = (def: EofolDef, id: string) => {
  if (isBrowser() && def.effect) {
    if (Array.isArray(def.effect)) {
      def.effect.forEach((singleEffect) => {
        playEffectImpl(singleEffect, getState(id), getSetState(id))
      })
    } else {
      playEffectImpl(def.effect, getState(id), getSetState(id))
    }
  }
}

export const replayInitialEffect = () => {
  const instances = getInstances()["index.html"]
  Object.keys(instances).map((id) => {
    // @TODO FIX
    const instance = instances[id]
    // @TODO error logging
    const def = getDefs()[instance.name]
    playEffect(def, id)
  })
}
