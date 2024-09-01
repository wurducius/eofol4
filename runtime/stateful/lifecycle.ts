import { playEffect } from "./effect"
import { mount, rerender } from "./render"
import { StaticElement } from "../defs"
import { removeInstance } from "../instances"

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

export const onComponentUnmount = (id: string) => {
  removeInstance(id)
}

// eslint-disable-next-line no-unused-vars
export const onComponentUnmounted = (id: string) => {}
