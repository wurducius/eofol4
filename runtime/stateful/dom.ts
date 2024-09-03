import { domAppendChildren, domClearChildren } from "../dom"
import { arrayCombinatorForEach } from "../util"
import { Compiler } from "../constants"

const updateDomImpl = (update: { id: string; result: any }) => {
  if (update && update.result) {
    const target = document.getElementById(update.id)
    if (target) {
      domClearChildren(target)
      domAppendChildren(update.result, target)
    } else {
      // @TODO FIXME
      console.log(`EOFOL ERROR: DOM element with id = ${update.id} does not exist.`)
    }
  }
}

export const updateDom = arrayCombinatorForEach(updateDomImpl)

export const isEofolTag = (tag: string) => Compiler.COMPILER_EOFOL_TAGS.includes(tag)
