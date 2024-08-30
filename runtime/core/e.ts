import { createElement } from "./create-element"

export const e = (tag: string, style?: string | undefined, content?: any, attributes?: any, properties?: any) => {
  // if(COMPILER_EOFOL_TAGS.includes(tag)){
  //   return createE
  // }else{
  return createElement(tag, style, content, attributes, properties)
  // }
}
