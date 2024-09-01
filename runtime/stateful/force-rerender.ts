import { isBrowser, sleepPromise } from "../util"
import { getInstances } from "../internals"
import { Children, getDef } from "../defs"
import { domAppendChildren, domAttributesToJson, domClearChildren, jsonToDom } from "../dom"

export const forceRerender = async () => {
  if (isBrowser()) {
    const instances = getInstances()["index.html"]
    Object.keys(instances).forEach((id) => {
      const instance = instances[id]
      const target = document.getElementById(instance.id)
      if (target) {
        const def = getDef(instance.name)
        if (def) {
          const state = instance.state
          const attributes = domAttributesToJson(target.attributes)

          //   const children = domToJson(target.childNodes)
          const childrenDom = []
          for (let i = 0; i < target.childNodes.length; i++) {
            const item = target.childNodes.item(i)
            if (item) {
              childrenDom.push(item)
            }
          }
          // @TODO Fix children prop later after analysis
          const children: Children = []

          const rendered = def.render(state, attributes, children)

          const domResult = jsonToDom(rendered)

          // @TODO handle children tree
          domClearChildren(target)
          domAppendChildren(domResult, target)
        } else {
          console.log(`EOFOL ERROR: DOM element with id = ${instance.id} does not exist.`)
        }
      } else {
        //@TODO error logging
      }
    })
    // @TODO FIXME SLEEP
    await sleepPromise()
  }
}
