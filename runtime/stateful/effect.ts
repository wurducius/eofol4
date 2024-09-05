import { getInstances } from "../internals"
import { getDef } from "../defs"
import { getSetState, getState } from "./state"
import { isBrowser } from "../util"
import { getInstance } from "../instances"
import { Attributes, EffectSingle, Props } from "../types"

const playEffectImpl = (effect: EffectSingle, props: Props) => {
  if (effect) {
    const cleanup = effect(props)
    if (cleanup) {
      cleanup(props)
    }
  }
}

const getEffectProps = (id: string, attributes: Attributes) => ({
  state: getState(id),
  setState: getSetState(id),
  // @TODO FIXME add attributes to instances
  attributes,
})

export const playEffect = (id: string) => {
  if (isBrowser()) {
    const instance = getInstance(id)
    // @TODO error logging
    const def = getDef(instance.name)
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
