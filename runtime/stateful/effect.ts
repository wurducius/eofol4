import { getInstances } from "../internals"
import { Effect, getDefs } from "../defs"
import { getSetState, getState } from "./state"
import { isBrowser } from "../util"

const playEffectImpl = (effect: Effect, props) => {
  if (effect) {
    effect(props)
  }
}

const getEffectProps = (id: string, attributes) => ({
  state: getState(id),
  setState: getSetState(id),
  // @TODO FIXME add attributes to instances
  attributes,
})

export const playEffect = (id: string) => {
  if (isBrowser()) {
    const instances = getInstances()
    // @TODO FIX
    const instance = instances[id]
    // @TODO error logging
    const def = getDefs()[instance.name]
    if (def.effect) {
      if (Array.isArray(def.effect)) {
        def.effect.forEach((singleEffect) => {
          playEffectImpl(singleEffect, getEffectProps(id, instance.attributes))
        })
      } else {
        playEffectImpl(def.effect, getEffectProps(id, instance.attributes))
      }
    }
  }
}

export const replayInitialEffect = () => {
  const instances = getInstances()
  Object.keys(instances).map((id) => {
    playEffect(id)
  })
}
