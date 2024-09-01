import { playEffect } from "./effect"
import { mount, rerender } from "./render"
import { StaticElement } from "../defs"

export const onComponentMounted = (id: string) => {
  playEffect(id)
}

export const onComponentUpdated = (id: string) => {
  playEffect(id)
}

export const onComponentMount = (jsonElement: StaticElement) => {
  return mount(jsonElement)
}

export const onComponentUpdate = (id: string) => {
  rerender(id)
}
