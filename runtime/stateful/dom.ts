import { domAppendChildren, domClearChildren } from "../dom"
import { arrayCombinatorForEach } from "../util"

const updateDomImpl = (update: { id: string; result: any }) => {
  const target = document.getElementById(update.id)
  if (target) {
    domClearChildren(target)
    domAppendChildren(update.result, target)
  } else {
    // @TODO FIXME
    console.log(`EOFOL ERROR: DOM element with id = ${update.id} does not exist.`)
  }
}

export const updateDom = arrayCombinatorForEach(updateDomImpl)
